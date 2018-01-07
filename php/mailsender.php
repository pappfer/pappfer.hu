<?php

require(__DIR__ . '/../vendor/autoload.php');

$dotenv = new Dotenv\Dotenv(__DIR__ . '/../');
$dotenv->load();

$url = 'https://www.google.com/recaptcha/api/siteverify';
$data = [
    'secret' => getenv('RECAPTCHA_SECRET'),
    'response' => $_POST['g-recaptcha-response'],
    'remoteip' => $_SERVER['REMOTE_ADDR'],
];

$options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($data)
    ],
];
$context = stream_context_create($options);
$result = json_decode(file_get_contents($url, false, $context));

if ($result->success === 1) {
    $transport = (new Swift_SmtpTransport(getenv('SMTP_HOST'), intval(getenv('SMTP_PORT')), getenv('SMTP_SECURITY')))
        ->setUsername(getenv('SMTP_USERNAME'))
        ->setPassword(getenv('SMTP_PASSWORD'));

    $mailer = new Swift_Mailer($transport);

    if (!isset($_POST['rsSubject'])) {
        $subject = "Contact form message";
    } else {
        $subject = $_POST['rsSubject'];
    }

    $message = (new Swift_Message($subject))
        ->setFrom([$_POST['rsEmail'] => $_POST['rsName']])
        ->setTo([getenv('EMAIL')])
        ->setReplyTo($_POST['rsEmail'])
        ->setBody($_POST['rsMessage']);

    $result = $mailer->send($message);

    echo json_encode((bool)$result);
} else {
    echo json_encode(false);
}