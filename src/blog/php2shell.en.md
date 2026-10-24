---
slug: php2shell
date: 2026-10-21
updated: 2026-10-23
category: security
keywords: PHP, PHP2Shell, CVE-2026-109618, CVE-2026-109619, CVE-2026-115560, PHP-FPM, Laravel, WordPress, remote code execution
title: PHP2Shell: an urgent checklist for every PHP server
metaTitle: PHP2Shell: how to check and patch your PHP server | Ferenc Papp
description: Two critical PHP RCEs were patched on 21 October 2026. Check your server, update safely, investigate compromise, and find fixes for older PHP releases.
---
**Update, 23 October:** PHP has warned about a third issue, CVE-2026-115560, which the 21 October releases do not fix. It only affects an unusual setup (details [below](#if-you-can-t-update-today)), PHP calls it unlikely, and no attacks have been reported. The fix until the next regular release is one line you may already have: `session.upload_progress.enabled = 0`. If you set it on the 21st, leave it in place, even after updating.

On 21 October the PHP project shipped emergency fixes for two critical vulnerabilities, CVE-2026-109618 and CVE-2026-109619, collectively known as **PHP2Shell**. Both can lead to remote code execution without authentication, and both have a CVSS 4.0 score of 9.2. A demonstrated mod_php exploit runs before application code starts, so updating WordPress, Laravel or a plugin does not fix the underlying problem. PHP itself has to be patched.

This is not a theoretical bug that can wait for the next maintenance window. Details leaked before the official release, public proof-of-concept code is circulating, Cloudflare has observed attack traffic, and European cybersecurity authorities have urged organisations to apply the updates, starting with internet-facing systems. Cloudflare's WAF rules add a useful layer of protection, but Cloudflare itself still tells customers to update PHP.

If your business runs on Laravel, Symfony, WordPress, Drupal, Magento or anything else built on PHP, here is the checklist for today.

## The short version

1. Update PHP to **8.5.12, 8.4.27, 8.3.36 or 8.2.35**, or to your Linux distribution's patched package.
2. **Restart** PHP-FPM or Apache, so the patched binary is the one actually serving requests.
3. Set `session.upload_progress.enabled = 0` and keep it until PHP's next regular release, updated or not.
4. Check logs and running processes for signs of compromise; patching does not undo an earlier intrusion.
5. On PHP 8.1 or older? Read the last section. You have a bigger problem.

## Are you affected?

If a vulnerable PHP version serves web traffic, treat it as exposed until you have checked the exact package and configuration. The advisory covers PHP-FPM, Apache with mod_php, php-cgi, FrankenPHP and LiteSpeed. The PHP team rates the risk highest for **mod_php**, where a demonstrated exploit needs only an unauthenticated request.

Two things trip people up when they check:

**The command line can lie.** `php -v` shows the CLI version, which is not necessarily what your web server runs. Check the service that actually handles requests:

```bash
systemctl list-units 'php*-fpm*'   # which FPM versions are running
php-fpm8.3 -v                      # substitute your version
```

**Your distribution's version numbers won't match.** Ubuntu, Debian and Red Hat backport security fixes into their own builds, so a patched server may still say `8.3.6`. Don't compare numbers. Look for the CVE in the package changelog instead:

```bash
# Debian / Ubuntu
apt changelog php8.3-fpm | grep -E 'CVE-2026-10961(8|9)'

# RHEL / Alma / Rocky
rpm -q --changelog php-fpm | grep -E 'CVE-2026-10961(8|9)'
```

You need confirmation for **both** CVEs. A changelog search is a useful first check, not universal proof: repositories format changelogs differently and some omit CVE identifiers. If either CVE is missing, compare the installed package version with your vendor's security notice. On Ubuntu, for example, Canonical publishes the exact fixed package version for every supported release.

## How to update

**Your own VPS (Ubuntu or Debian, including servers managed by Forge or Ploi)**

```bash
sudo apt update && sudo apt upgrade
sudo systemctl restart php8.3-fpm    # restart every FPM version you run
sudo systemctl restart apache2       # if you use mod_php
```

**Docker.** The official `php` images are rebuilt with the fixes. Your image isn't rebuilt until you do it:

```bash
docker build --pull --no-cache -t your-app .
docker run --rm your-app php -v
```

Then redeploy. If you pin base images by digest, bump the digest first.

**Shared or managed hosting.** You can't patch this yourself, but the risk is still yours. Ask your host directly: *"Have you deployed the fixes for CVE-2026-109618 and CVE-2026-109619 on the server my site runs on?"* Get a clear yes before you stop worrying.

**Serverless and PaaS.** Move to your provider's patched runtime as soon as it's published, then redeploy.

## After patching, check for compromise

An update closes the vulnerability; it does not tell you whether somebody reached the server first. Review web-server, PHP, authentication and endpoint logs from at least the hours before the public disclosure. Look for unusual child processes spawned by PHP or the web server, unexpected files and accounts, unfamiliar scheduled jobs and outbound connections that your application does not normally make.

If you find something suspicious, preserve the logs and isolate the host before cleaning it. Restoring only the website files is not enough if an attacker obtained the PHP worker's permissions or stole application secrets. Rotate credentials and API keys from a known-clean machine, and rebuild the server from a trusted image where possible.

## If you can't update today

The PHP team lists mitigations for teams that need a few hours or days. They narrow specific attack paths. **They do not make you safe.** Treat them as a bridge to the update, not a replacement for it.

```ini
; Put these in php.ini or the server config. Do NOT rely on .user.ini or ini_set():
; they apply too late to help.
session.upload_progress.enabled = 0
post_max_size = 8M          ; 32M if your app needs file uploads
upload_max_filesize = 6M    ; keep it below post_max_size
memory_limit = -1           ; read the note below first
fatal_error_backtraces = 0  ; PHP 8.5 only
```

In an FPM pool, write each setting as `php_admin_value[session.upload_progress.enabled] = 0` so applications can't override it. Restart every worker afterwards.

**Keep the first line after you update.** On 23 October PHP published a follow-up advisory for CVE-2026-115560, which the emergency releases do not fix. It needs an application that sets `session.serialize_handler` to `php_binary` or `php_serialize` in its configuration and then switches it to `php` with `ini_set()` before `session_start()`, with upload progress still enabled. That is rare, but you don't need to check every app to be safe: `session.upload_progress.enabled = 0` closes it, and the fix will ship in the next regular release. If you want to know whether one of your apps does this, search the code:

```bash
grep -rn 'serialize_handler' --include='*.php' .
```

**About `memory_limit = -1`:** this looks wrong, and it is a trade-off. It removes the memory-limit failure that one of the bugs relies on, but then a single request can consume all available RAM. Pair it with a container or cgroup memory limit that kills only the offending worker. The advisory warns against using `RLIMIT_AS` or `RLIMIT_DATA` for this, because they can trigger the vulnerable path themselves.

Also cap request sizes at the web server or proxy (for example `client_max_body_size 8m;` in Nginx), and fix any fatal errors or timeouts an attacker can trigger from outside: upload handlers, importers, callbacks.

## Running an older PHP release?

The PHP project no longer supports the 7.4, 8.0 and 8.1 branches, but it made an exception for these vulnerabilities and published minimal source backports for all three. That also gave third-party package maintainers a basis for patched binary builds.

If you use [Deb.Sury.org](https://deb.sury.org/) on Debian or the `ondrej/php` PPA on Ubuntu, Ondřej Surý has backported the fixes to packages for older PHP branches as well. You do not need to compile PHP yourself in that case: upgrade from the repository, restart every affected FPM pool or Apache instance, then verify the **installed package** version and changelog. A fixed package existing in the repository does not mean it is already installed on your server. Mirrors can lag, too: on release day the Launchpad PPA still served an unfixed build for some branches, so run `apt-cache policy php8.3-fpm` (with your version) and check that the candidate is the fixed one before you rely on it.

This addresses these two CVEs; it does not make PHP 7.4, 8.0 or 8.1 generally supported again. Fixes for other known or future vulnerabilities are not guaranteed, so plan the move to a supported branch separately.

Your realistic options:

- **Update from your package source.** Ubuntu (on 20.04 and older through Ubuntu Pro's Expanded Security Maintenance), Deb.Sury/`ondrej/php` and some LTS vendors provide patched packages for older PHP branches. Verify them with both the changelog check above and the vendor advisory.
- **Apply the mitigations today** and treat them as temporary.
- **Upgrade to a currently supported PHP branch.** How long that takes depends on the application and its dependencies. A maintained Laravel project may move quickly; an old custom system needs testing before anyone can make an honest estimate.

If you've been postponing that upgrade, this week is the reminder that postponing has a price.

## The real lesson

A security fix only protects you once it's deployed, and every hour between release and deployment is an open door. After this week, it's worth having clear answers to three questions:

- Do you know which PHP version every one of your servers runs?
- Can you update and restart production within an hour, without holding your breath?
- Is it someone's actual job to do that when an advisory like this lands?

If any answer is "not really", fix that before the next advisory, because there will be one.

## Need a hand?

I'm Ferenc Papp, a freelance full-stack developer from Debrecen, Hungary. I've been building and maintaining PHP and Laravel applications for over 15 years, for clients across Europe and the United States. If you need a server checked and patched today, or a legacy PHP application upgraded to a supported version, [get in touch](https://pappfer.hu/en/#contact).

---

**Sources**

- [php.net: official security advisory](https://www.php.net/archive/2026.php#2026-10-21-5)
- [php.net: informational advisory on session upload progress (CVE-2026-115560)](https://www.php.net/archive/2026.php#2026-10-23-1)
- [ENISA: joint statement on the critical PHP vulnerabilities](https://www.enisa.europa.eu/news/joint-statement-on-critical-php-vulnerabilities)
- [Ubuntu: fixed package versions and update instructions](https://ubuntu.com/blog/php2shell-vulnerability-fixes-available)
- [Cloudflare: WAF protection and observed attack traffic](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/)
- [Sansec: PHP2Shell analysis and public exploit](https://sansec.io/research/php2shell)
- [deb.sury.org: release-day discussion of the backports](https://codeberg.org/oerdnj/deb.sury.org/issues/145)
- [Tenable: PHP2Shell FAQ](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote)
- [watchTowr: exploitation activity](https://watchtowr.com/intelligence/php-remote-code-execution-php2shell/)
- [Huntress: rapid response](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities)
- [Computer Weekly: critical PHP flaws put millions of websites at risk](https://www.computerweekly.com/news/366652446/Critical-PHP-flaws-puts-millions-of-websites-at-risk-of-takeover)
