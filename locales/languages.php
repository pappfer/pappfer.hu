<?php
$lang = 'en';

/**
 * Returns the valid languages. The language code (ISO 639-1) is the array key.
 * @return array
 */
function validLangs()
{
    return [
        'de' => 'de_DE.utf8',
        'en' => 'en_GB.utf8',
        'hu' => 'hu_HU.utf8',
    ];
}

/**
 * Verifies if the given $locale is supported in the project.
 * @param string $locale
 * @return bool
 */
function valid($locale)
{
    return array_key_exists($locale, validLangs());
}

if (strlen($_SERVER['REQUEST_URI']) > 2 && valid($_SERVER['REQUEST_URI'][1] . $_SERVER['REQUEST_URI'][2])) {
    $lang = $_SERVER['REQUEST_URI'][1] . $_SERVER['REQUEST_URI'][2];
    setcookie('lang', $lang);
} else if (isset($_GET['lang']) && valid($_GET['lang'])) {
    $lang = htmlspecialchars($_GET['lang']);
    setcookie('lang', $lang);
} else if (isset($_COOKIE['lang']) && valid($_COOKIE['lang'])) {
    $lang = htmlspecialchars($_COOKIE['lang']);
} else if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    $languages = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
    array_walk($languages, static function (&$lang) {
        $lang = strtr(strtok($lang, ';'), ['-' => '_']);
    });
    foreach ($languages as $browserLang) {
        if (valid($browserLang)) {
            $lang = $browserLang;
            break;
        }
    }
}

putenv('LANG=' . validLangs()[$lang]);
setlocale(LC_ALL, validLangs()[$lang]);

bindtextdomain('app', './locales');
bind_textdomain_codeset('app', 'UTF-8');
textdomain('app');