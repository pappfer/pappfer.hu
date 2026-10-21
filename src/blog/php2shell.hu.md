---
slug: php2shell
date: 2026-10-21
kicker: Biztonsági figyelmeztetés
keywords: PHP, PHP2Shell, CVE-2026-109618, CVE-2026-109619, PHP-FPM, Laravel, WordPress, távoli kódfuttatás
title: PHP2Shell: mit tegyél ma, ha a weboldalad PHP-n fut
metaTitle: PHP2Shell (CVE-2026-109618/109619): teendők most | Papp Ferenc
description: Két kritikus, bejelentkezés nélkül kihasználható PHP-hibát javítottak 2026. október 21-én. Így nézheted meg, érintett vagy-e, és így frissíts biztonságosan.
---
Október 21-én a PHP fejlesztői javítást adtak ki két kritikus sebezhetőségre, a CVE-2026-109618-ra és a CVE-2026-109619-re. A biztonsági szakma **PHP2Shell** néven emlegeti őket. Mindkettővel bejelentkezés nélkül lehet kódot futtatni a szervereden, és mindkettő 9,2 pontot kapott a tízes skálán. Legalább egy beállításnál a támadás még azelőtt lefut, hogy az alkalmazásod egyetlen sora elindulna. Vagyis ez ellen semmilyen keretrendszer, bővítmény vagy alkalmazásszintű tűzfal nem véd.

Hogy mennyire komoly, azt a nagyok reakciója mutatja. A Wikimedia Alapítvány a javításig lekapcsolta egyes rendszereit. A BBC több műsoroldala elsötétült. Egy időre leállt a Pinboard, a 4chan és több európai kormányzati oldal is. A biztonsági cégek már kihasználási kísérleteket látnak.

Ha a céged weboldala vagy webalkalmazása Laravelen, Symfonyn, WordPressen, Drupalon, Magentón vagy bármilyen más PHP-alapú rendszeren fut, ez a mai teendőlistád.

## Röviden

1. Frissítsd a PHP-t **8.5.12, 8.4.27, 8.3.36 vagy 8.2.35** verzióra, vagy a Linux-disztribúciód javított csomagjára.
2. **Indítsd újra** a PHP-FPM-et vagy az Apache-ot, hogy tényleg a javított verzió szolgálja ki a kéréseket.
3. PHP 8.1-en vagy régebbin vagy? Olvasd el az utolsó részt, mert neked nagyobb a gondod.

## Érintett vagy?

Szinte biztosan, ha a weboldaladat PHP szolgálja ki. A figyelmeztetés kiterjed a PHP-FPM-re, az Apache mod_php-ra, a php-cgi-re, a FrankenPHP-ra és a LiteSpeedre. A PHP csapata a **mod_php**-nál tartja a legnagyobbnak a kockázatot: ott egyetlen, bejelentkezés nélküli kérés elég a működő támadáshoz.

Ellenőrzéskor két dolgon szoktak elcsúszni:

**A parancssor félrevezethet.** A `php -v` a parancssori PHP verzióját mutatja, ami nem feltétlenül az, amit a webszerver futtat. Azt a szolgáltatást nézd meg, amelyik ténylegesen a kéréseket kezeli:

```bash
systemctl list-units 'php*-fpm*'   # milyen FPM-verziók futnak
php-fpm8.3 -v                      # a saját verzióddal
```

**A disztribúció verziószámai nem fognak egyezni.** Az Ubuntu, a Debian és a Red Hat a saját csomagjaiba építi be a biztonsági javításokat, így egy már javított szerver is kiírhatja például, hogy `8.3.6`. Ne a számokat hasonlítsd össze, hanem keresd meg a CVE-t a csomag változásnaplójában:

```bash
# Debian / Ubuntu
apt changelog php8.3-fpm | grep -m1 CVE-2026-109618

# RHEL / Alma / Rocky
rpm -q --changelog php-fpm | grep -m1 CVE-2026-109618
```

Ha kapsz egy sort, megvan a javítás. Ha nincs kimenet, még nem frissítettél.

## Hogyan frissíts?

**Saját VPS (Ubuntu vagy Debian, akkor is, ha Forge vagy Ploi kezeli)**

```bash
sudo apt update && sudo apt upgrade
sudo systemctl restart php8.3-fpm    # minden futó FPM-verziót indíts újra
sudo systemctl restart apache2       # ha mod_php-t használsz
```

**Docker.** A hivatalos `php` image-eket a javítással újraépítették. A te image-ed viszont csak akkor frissül, ha te is újraépíted:

```bash
docker build --pull --no-cache -t your-app .
docker run --rm your-app php -v
```

Utána telepítsd újra. Ha digest alapján rögzíted az alap image-et, előbb azt frissítsd.

**Megosztott tárhely.** Itthon a legtöbb kisebb céges oldal ilyen tárhelyen fut. A frissítést nem te végzed el, de a kockázat a tiéd. Írj a tárhelyszolgáltatódnak: *„Telepítettétek már a CVE-2026-109618 és CVE-2026-109619 javítását azon a szerveren, ahol az oldalam fut?”* Amíg nem kapsz egyértelmű igent, ne tekintsd lezártnak.

**Serverless és PaaS.** Válts a szolgáltatód javított futtatókörnyezetére, amint elérhető, és telepítsd újra az alkalmazást.

## Ha ma nem tudsz frissíteni

A PHP csapata ideiglenes védekezést is javasol, ha néhány óra vagy nap kell a frissítésig. Ezek egyes támadási útvonalakat zárnak le, de **nem tesznek biztonságossá**. Tekintsd őket átmeneti megoldásnak a frissítésig, ne helyette.

```ini
; php.ini-be vagy a szerverkonfigurációba. A .user.ini és az ini_set() NEM jó:
; túl későn lépnek életbe.
session.upload_progress.enabled = 0
post_max_size = 8M          ; 32M, ha az alkalmazásnak kell fájlfeltöltés
upload_max_filesize = 6M    ; maradjon a post_max_size alatt
memory_limit = -1           ; előbb olvasd el a lenti megjegyzést
fatal_error_backtraces = 0  ; csak PHP 8.5
```

FPM-poolban így add meg az egyes beállításokat: `php_admin_value[session.upload_progress.enabled] = 0`. Így az alkalmazás nem tudja felülírni őket. Utána indíts újra minden workert.

**A `memory_limit = -1`-ről:** furcsán hangzik, és valóban kompromisszum. Megszünteti azt a memórialimit-hibát, amelyre az egyik sebezhetőség épül, cserébe viszont egyetlen kérés felélheti az összes memóriát. Ezért párosítsd egy konténer- vagy cgroup-memórialimittel, amely csak a túlfutó workert állítja le. A figyelmeztetés kifejezetten óv attól, hogy erre `RLIMIT_AS`-t vagy `RLIMIT_DATA`-t használj, mert azok maguk is kiválthatják a sebezhető hibát.

Korlátozd a kérések méretét a webszerveren vagy a proxyn is (Nginxben például `client_max_body_size 8m;`). Javítsd ki azokat a végzetes hibákat és időtúllépéseket is, amelyeket kívülről ki lehet váltani: a feltöltés- és importkezelőkben vagy a callbackekben.

## Még PHP 7.4-en, 8.0-n vagy 8.1-en vagy?

Ez a kellemetlen rész. Ezek a verziók már nem kapnak hivatalos frissítést. A hiba súlyossága miatt a PHP biztonsági csapata most kivételesen kiadott minimális forráskód-szintű javításokat a 7.4–8.1 verziókhoz, de ezek csak annak segítenek, aki maga fordítja a PHP-t.

A reális lehetőségeid:

- **Kérdezd meg a szolgáltatódat.** Egyes Linux-disztribúciók és hosszú távú támogatást nyújtó cégek kiadnak javított csomagokat. Ellenőrizd a fenti changelog-paranccsal.
- **Állítsd be ma az ideiglenes védekezést**, de csak átmeneti megoldásnak tekintsd.
- **Frissíts PHP 8.3-ra vagy 8.4-re.** Egy átlagos Laravel- vagy egyedi PHP-alkalmazásnál ez jellemzően néhány nap vagy pár hét munka, nem hónapoké. Ritkán maga a PHP a nehéz rész. Inkább az évek óta nem frissített függőségek.

Ha eddig halogattad ezt a frissítést, ez a hét megmutatta, hogy a halogatásnak ára van.

## A valódi tanulság

Egy biztonsági javítás csak attól kezdve véd, hogy telepítetted, és a kiadás meg a telepítés között eltelt minden óra nyitott ajtó. Ezek után érdemes világos választ adni három kérdésre:

- Tudod, melyik szervereden milyen PHP-verzió fut?
- Tudod egy órán belül frissíteni és újraindítani az éles rendszert úgy, hogy közben nem kell visszatartanod a lélegzeted?
- Van valaki, akinek ténylegesen ez a dolga, amikor egy ilyen figyelmeztetés megjelenik?

Ha bármelyikre az a válasz, hogy „nem igazán”, ezt még a következő figyelmeztetés előtt rendezd. Mert lesz következő.

## Segítsek?

Papp Ferenc vagyok, debreceni szabadúszó full-stack fejlesztő. Több mint 15 éve építek és tartok karban PHP- és Laravel-alkalmazásokat, magyar, európai és amerikai ügyfeleknek. Ha még ma át kell nézni és frissíteni egy szervert, vagy egy régi PHP-alkalmazást kell támogatott verzióra hozni, [keress meg](https://pappfer.hu/hu/#contact).

---

**Források**

- [php.net: biztonsági figyelmeztetés és letöltések](https://www.php.net/)
- [Tenable: PHP2Shell GYIK](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote)
- [watchTowr: kihasználási kísérletek](https://watchtowr.com/intelligence/php-remote-code-execution-php2shell/)
- [Huntress: gyorsreagálású elemzés](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities)
- [Computer Weekly: kritikus PHP-hibák weboldalak millióit veszélyeztetik](https://www.computerweekly.com/news/366652446/Critical-PHP-flaws-puts-millions-of-websites-at-risk-of-takeover)
- [How-To Geek: lekapcsolt oldalak](https://www.howtogeek.com/your-favorite-websites-are-down-due-to-an-internet-breaking-security-failure/)
