---
slug: php2shell
date: 2026-10-21
kicker: Security advisory
keywords: PHP, PHP2Shell, CVE-2026-109618, CVE-2026-109619, PHP-FPM, Laravel, WordPress, remote code execution
title: PHP2Shell: what to do today if your business runs on PHP
metaTitle: PHP2Shell (CVE-2026-109618/109619): what to do today | Ferenc Papp
description: Two critical, unauthenticated PHP RCEs were patched on 21 October 2026. How to check if you're affected, update safely, and what to do on PHP 8.1 or older.
---
On 21 October the PHP project shipped fixes for two critical vulnerabilities, CVE-2026-109618 and CVE-2026-109619, which the security community has named **PHP2Shell**. Both let an attacker run code on your server without logging in, and both are rated 9.2 out of 10. In at least one setup the attack fires before a single line of your application runs. That means no framework, plugin or application-level firewall rule can catch it.

The reactions show how seriously big operators take this. The Wikimedia Foundation took some of its systems offline until they were patched. Several BBC programme pages went dark. Pinboard, 4chan and a number of European government sites disappeared for a while too. Security firms are already seeing exploitation attempts.

If your business runs on Laravel, Symfony, WordPress, Drupal, Magento or anything else built on PHP, here is the checklist for today.

## The short version

1. Update PHP to **8.5.12, 8.4.27, 8.3.36 or 8.2.35**, or to your Linux distribution's patched package.
2. **Restart** PHP-FPM or Apache, so the patched binary is the one actually serving requests.
3. On PHP 8.1 or older? Read the last section. You have a bigger problem.

## Are you affected?

Almost certainly, if PHP serves your web traffic. The advisory covers PHP-FPM, Apache with mod_php, php-cgi, FrankenPHP and LiteSpeed. The PHP team rates the risk highest for **mod_php**, where a working exploit needs nothing more than one unauthenticated request.

Two things trip people up when they check:

**The command line can lie.** `php -v` shows the CLI version, which is not necessarily what your web server runs. Check the service that actually handles requests:

```bash
systemctl list-units 'php*-fpm*'   # which FPM versions are running
php-fpm8.3 -v                      # substitute your version
```

**Your distribution's version numbers won't match.** Ubuntu, Debian and Red Hat backport security fixes into their own builds, so a patched server may still say `8.3.6`. Don't compare numbers. Look for the CVE in the package changelog instead:

```bash
# Debian / Ubuntu
apt changelog php8.3-fpm | grep -m1 CVE-2026-109618

# RHEL / Alma / Rocky
rpm -q --changelog php-fpm | grep -m1 CVE-2026-109618
```

If you get a line back, you have the fix. No output means you're not patched yet.

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

**About `memory_limit = -1`:** this looks wrong, and it is a trade-off. It removes the memory-limit failure that one of the bugs relies on, but then a single request can consume all available RAM. Pair it with a container or cgroup memory limit that kills only the offending worker. The advisory warns against using `RLIMIT_AS` or `RLIMIT_DATA` for this, because they can trigger the vulnerable path themselves.

Also cap request sizes at the web server or proxy (for example `client_max_body_size 8m;` in Nginx), and fix any fatal errors or timeouts an attacker can trigger from outside: upload handlers, importers, callbacks.

## Still on PHP 7.4, 8.0 or 8.1?

This is the uncomfortable part. These versions no longer receive official updates. Because this bug is so severe, the PHP security team published minimal source-code backports for 7.4 through 8.1. Those help only if you compile PHP yourself.

Your realistic options:

- **Check your vendor.** Some Linux distributions and long-term-support vendors ship backported fixes. Use the changelog check above.
- **Apply the mitigations today** and treat them as temporary.
- **Upgrade to PHP 8.3 or 8.4.** For a typical Laravel or custom PHP application, that is usually a matter of days or a few weeks, not months. The hard part is rarely PHP itself. It's the dependencies that haven't been touched in years.

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

- [php.net: security advisory and downloads](https://www.php.net/)
- [Tenable: PHP2Shell FAQ](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote)
- [watchTowr: exploitation activity](https://watchtowr.com/intelligence/php-remote-code-execution-php2shell/)
- [Huntress: rapid response](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities)
- [Computer Weekly: critical PHP flaws put millions of websites at risk](https://www.computerweekly.com/news/366652446/Critical-PHP-flaws-puts-millions-of-websites-at-risk-of-takeover)
- [How-To Geek: sites taken offline](https://www.howtogeek.com/your-favorite-websites-are-down-due-to-an-internet-breaking-security-failure/)
