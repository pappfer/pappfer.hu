---
slug: php2shell
date: 2026-10-21
kicker: Biztonsági figyelmeztetés
keywords: PHP, PHP2Shell, CVE-2026-109618, CVE-2026-109619, PHP-FPM, Laravel, WordPress, távoli kódfuttatás
title: PHP2Shell: azonnali teendők minden PHP-szerveren
metaTitle: PHP2Shell: így ellenőrizd és javítsd a PHP-szervert | Papp Ferenc
description: Két kritikus PHP-hibát javítottak 2026. október 21-én. Ellenőrzés, biztonságos frissítés, behatolásvizsgálat és javítások régi PHP-verziókhoz.
---
Október 21-én a PHP fejlesztői soron kívüli javítást adtak ki két kritikus sebezhetőségre, a CVE-2026-109618-ra és a CVE-2026-109619-re. A két hibát összefoglalóan **PHP2Shell** néven emlegetik. Mindkettő lehetővé teheti, hogy a támadó bejelentkezés nélkül kódot futtasson a szerveren; a CVSS 4.0 szerinti értékelésük 9,2. A mod_php-hoz bemutatott támadás még az alkalmazáskód indulása előtt lefut, ezért egy WordPress-, Laravel- vagy bővítményfrissítés önmagában nem oldja meg a problémát. Magát a PHP-t kell javítani.

Ez nem az a hiba, amely ráér a következő karbantartási ablakig. A részletek már a hivatalos kiadás előtt kiszivárogtak, nyilvános exploitkód kering, a Cloudflare támadási forgalmat észlelt, az európai kiberbiztonsági szervezetek pedig a javítások telepítésére szólítanak fel, az internet felől elérhető rendszerekkel kezdve. A Cloudflare WAF-szabályai hasznos plusz védelmet adnak, de a PHP frissítését nem váltják ki.

Ha a céged weboldala vagy webalkalmazása Laravelen, Symfonyn, WordPressen, Drupalon, Magentón vagy bármilyen más PHP-alapú rendszeren fut, ez a mai teendőlistád.

## Röviden

1. Frissítsd a PHP-t **8.5.12, 8.4.27, 8.3.36 vagy 8.2.35** verzióra, vagy a Linux-disztribúciód javított csomagjára.
2. **Indítsd újra** a PHP-FPM-et vagy az Apache-ot, hogy tényleg a javított verzió szolgálja ki a kéréseket.
3. Nézd át a naplókat és a futó folyamatokat is: a frissítés nem tesz semmissé egy korábbi betörést.
4. PHP 8.1-en vagy régebbin vagy? Olvasd el az utolsó részt, mert neked nagyobb a gondod.

## Érintett vagy?

Ha sérülékeny PHP-verzió szolgálja ki a webes kéréseket, kezeld érintettként a rendszert addig, amíg a pontos csomagot és konfigurációt nem ellenőrizted. A figyelmeztetés kiterjed a PHP-FPM-re, az Apache mod_php-ra, a php-cgi-re, a FrankenPHP-ra és a LiteSpeedre. A PHP csapata a **mod_php**-nál tartja a legnagyobbnak a kockázatot: a bemutatott támadáshoz ott egyetlen, bejelentkezés nélküli kérés is elég.

Ellenőrzéskor két dolgon szoktak elcsúszni:

**A parancssor félrevezethet.** A `php -v` a parancssori PHP verzióját mutatja, ami nem feltétlenül az, amit a webszerver futtat. Azt a szolgáltatást nézd meg, amelyik ténylegesen a kéréseket kezeli:

```bash
systemctl list-units 'php*-fpm*'   # milyen FPM-verziók futnak
php-fpm8.3 -v                      # a saját verzióddal
```

**A disztribúció verziószámai nem fognak egyezni.** Az Ubuntu, a Debian és a Red Hat a saját csomagjaiba építi be a biztonsági javításokat, így egy már javított szerver is kiírhatja például, hogy `8.3.6`. Ne a számokat hasonlítsd össze, hanem keresd meg a CVE-t a csomag változásnaplójában:

```bash
# Debian / Ubuntu
apt changelog php8.3-fpm | grep -E 'CVE-2026-10961(8|9)'

# RHEL / Alma / Rocky
rpm -q --changelog php-fpm | grep -E 'CVE-2026-10961(8|9)'
```

Mindkét CVE-hez kell megerősítés. A changelog átnézése jó első ellenőrzés, de nem mindenhol döntő bizonyíték: a tárolók eltérően vezetik a változásnaplót, néhol pedig a CVE-azonosító sem kerül bele. Ha bármelyik hiányzik, vesd össze a telepített csomag pontos verzióját a disztribúció biztonsági közleményével. Az Ubuntu például minden támogatott kiadáshoz külön megadja a már javított csomagverziót.

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

## Frissítés után keress behatolásra utaló nyomokat

A frissítés bezárja a hibát, de nem mondja meg, hogy valaki megelőzött-e. Nézd át legalább a nyilvános bejelentést megelőző óráktól kezdve a webszerver, a PHP, a hitelesítési rendszer és a végpontvédelem naplóit. Gyanús lehet a PHP vagy a webszerver által indított szokatlan folyamat, egy ismeretlen fájl, felhasználó vagy időzített feladat, illetve olyan kimenő kapcsolat, amelyet az alkalmazás normálisan nem kezdeményez.

Ha találsz valamit, előbb őrizd meg a naplókat és válaszd le a gépet a hálózatról. A weboldal fájljainak visszamásolása nem elég, ha a támadó megszerezte a PHP worker jogosultságait vagy hozzáfért az alkalmazás titkaihoz. A jelszavakat és API-kulcsokat tiszta gépről cseréld le; ha lehet, a szervert megbízható image-ből építsd újra.

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

## Régi PHP-verziót használsz?

A PHP projekt a 7.4, 8.0 és 8.1 ágakat már nem támogatja, de ennél a hibánál kivételt tett: mindháromhoz kiadott minimális forráskód-visszaportolást. Erre építve a külső csomagkarbantartók is tudtak javított binárisokat készíteni.

Ha Debianon a [Deb.Sury.org](https://deb.sury.org/) csomagjait, Ubuntun pedig az `ondrej/php` PPA-t használod, Ondřej Surý a javítást a régi PHP-ágak csomagjaiba is visszaportolta. Vagyis itt nem kell saját PHP-t fordítanod: frissíts a tárolóból, indítsd újra az összes érintett FPM-poolt vagy Apache-ot, majd ellenőrizd a **telepített csomag** verzióját és változásnaplóját. Attól, hogy a tárolóban már megjelent a javítás, a szervered még nem frissül automatikusan. A tükrök is késhetnek: a kiadás napján a Launchpad PPA néhány ágnál még javítatlan csomagot adott. Az `apt-cache policy php8.3-fpm` paranccsal (a saját verzióddal) nézd meg, hogy a telepítésre jelölt verzió már a javított-e.

Ez a két CVE-t kezeli, de nem teszi újra támogatottá a PHP 7.4-et, 8.0-t vagy 8.1-et. Más ismert és később felfedezett hibák javítása továbbra sem garantált, ezért a verzióváltást érdemes külön feladatként betervezni.

A reális lehetőségeid:

- **Frissíts a csomagforrásodból.** Az Ubuntu (20.04-en és régebbin az Ubuntu Pro kiterjesztett biztonsági támogatásával), a Deb.Sury/`ondrej/php` és egyes LTS-szolgáltatók már régi PHP-ágakhoz is adnak javított csomagokat. Ellenőrizd a fenti changelog-paranccsal és a szolgáltató közleményével is.
- **Állítsd be ma az ideiglenes védekezést**, de csak átmeneti megoldásnak tekintsd.
- **Válts jelenleg támogatott PHP-ágra.** Hogy ez mennyi idő, az alkalmazástól és a függőségeitől függ. Egy karbantartott Laravel-projekt gyorsan mozdulhat; egy régi egyedi rendszert előbb fel kell mérni és tesztelni, csak utána lehet felelősen becsülni.

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

- [php.net: hivatalos biztonsági közlemény](https://www.php.net/archive/2026.php#2026-10-21-5)
- [ENISA: közös közlemény a kritikus PHP-hibákról](https://www.enisa.europa.eu/news/joint-statement-on-critical-php-vulnerabilities)
- [Ubuntu: javított csomagverziók és frissítési útmutató](https://ubuntu.com/blog/php2shell-vulnerability-fixes-available)
- [Cloudflare: WAF-védelem és észlelt támadási forgalom](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/)
- [Sansec: PHP2Shell-elemzés és nyilvános exploit](https://sansec.io/research/php2shell)
- [deb.sury.org: egyeztetés a backportokról a kiadás napján](https://codeberg.org/oerdnj/deb.sury.org/issues/145)
- [Tenable: PHP2Shell GYIK](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote)
- [watchTowr: kihasználási kísérletek](https://watchtowr.com/intelligence/php-remote-code-execution-php2shell/)
- [Huntress: gyorsreagálású elemzés](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities)
- [Computer Weekly: kritikus PHP-hibák weboldalak millióit veszélyeztetik](https://www.computerweekly.com/news/366652446/Critical-PHP-flaws-puts-millions-of-websites-at-risk-of-takeover)
