<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../locales/languages.php';

$dotenv = new Dotenv\Dotenv(__DIR__ . '/../');
$dotenv->load();

$success = false;
$message = _('Error sending message.');

if (!empty($_POST['rsEmail']) && !empty($_POST['rsName']) && !empty($_POST['rsMessage']) && !empty($_POST['rsQuestion'])) {
    $transport = (new Swift_SmtpTransport(getenv('SMTP_HOST'),
        (int)getenv('SMTP_PORT'), getenv('SMTP_SECURITY')))
        ->setUsername(getenv('SMTP_USERNAME'))
        ->setPassword(getenv('SMTP_PASSWORD'));

    $mailer = new Swift_Mailer($transport);

    if (!isset($_POST['rsSubject'])) {
        $subject = 'pappfer.hu kapcsolatfelvétel';
    } else {
        $subject = $_POST['rsSubject'];
    }

    if (!in_array(trim($_POST['rsQuestion']), ['blue', 'skyblue', 'lightblue', 'darkblue',
        'kék', 'kek', 'világoskék', 'sötétkék', 'vilagoskek', 'sotetkek'])) {
        $success = false;
        $message = _('The answer provided to the anti-robot question is wrong.');
    } else {
        $emailBody = '<p>Üdv,</p><p>E-mail érkezett a pappfer.hu-n keresztül. Küldő adatai:</p>';
        $emailBody .= '<ul>';
        $emailBody .= '<li>Név:' . $_POST['rsName'] .'</li>';
        $emailBody .= '<li>E-mail:' . $_POST['rsEmail'] .'</li>';
        $emailBody .= '<li>Tárgy' . $subject .'</li>';
        $emailBody .= '</ul>';
        $emailBody .= '<p>Üzenet:</p>';
        $emailBody .= $_POST['rsMessage'];
        $emailMessage = (new Swift_Message($subject))
            ->setFrom([$_POST['rsEmail'] => $_POST['rsName']])
            ->setTo([getenv('EMAIL')])
            ->setReplyTo($_POST['rsEmail'])
            ->setBody($emailBody);

        try {
            $result = $mailer->send($emailMessage);
            $success = (bool)$result;
        } catch (Exception $e) {
            $success = false;
            $message = $e->getMessage();
        }

        $message = $success ? _('Thank you for contacting me. I will get back to you shortly.') :
            _('Error sending message.');
    }
} else {
    $success = false;
    $message = _('You need to fill in all required fields.');
}

echo json_encode([
    'success' => $success,
    'message' => $message,
]);