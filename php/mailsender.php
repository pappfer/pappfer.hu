<?php

require __DIR__ . '/../vendor/autoload.php';

if (isset($_POST['rsEmail'], $_POST['rsName'], $_POST['rsMessage'])) {
    $transport = (new Swift_SmtpTransport(getenv('SMTP_HOST'), int(getenv('SMTP_PORT')), getenv('SMTP_SECURITY')))
        ->setUsername(getenv('SMTP_USERNAME'))
        ->setPassword(getenv('SMTP_PASSWORD'));

    $mailer = new Swift_Mailer($transport);

    if (!isset($_POST['rsSubject'])) {
        $subject = 'pappfer.hu kapcsolatfelvétel';
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