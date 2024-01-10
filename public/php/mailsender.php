<?php

use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Email;

require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../locales/languages.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$success = false;
$message = _('Error sending message.');

if (empty($_POST['g-recaptcha-response'])) {
    $message = _('Failed to detect that you are not a robot.');
} else {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://www.google.com/recaptcha/api/siteverify',
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => [
            'secret' => getenv('RECAPTCHA_V3_SECRET'),
            'response' => $_POST['g-recaptcha-response'],
            'remoteip' => $_SERVER['REMOTE_ADDR'],
        ],
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $output = curl_exec($ch);
    curl_close($ch);

    $json = json_decode($output);

    if ($json->success && $json->score >= 0.5) {
        if (!empty($_POST['rsEmail']) && !empty($_POST['rsName']) && !empty($_POST['rsMessage'])) {
            $dsn = 'smtp://' . getenv('SMTP_USERNAME') .':' . getenv('SMTP_PASSWORD') .
                '@' . getenv('SMTP_HOST') . ':' . getenv('SMTP_PORT');
            $transport = Transport::fromDsn($dsn);
            $mailer = new Mailer($transport);

            if (!isset($_POST['rsSubject'])) {
                $subject = 'pappfer.hu kapcsolatfelvétel';
            } else {
                $subject = $_POST['rsSubject'];
            }

            $emailBody = '<p>Üdv,</p><p>E-mail érkezett a pappfer.hu-n keresztül. Küldő adatai:</p>';
            $emailBody .= '<ul>';
            $emailBody .= '<li>Név: ' . $_POST['rsName'] . '</li>';
            $emailBody .= '<li>E-mail: ' . $_POST['rsEmail'] . '</li>';
            $emailBody .= '<li>Tárgy: ' . $subject . '</li>';
            $emailBody .= '</ul>';
            $emailBody .= '<p>Üzenet:</p>';
            $emailBody .= $_POST['rsMessage'];

            $email = (new Email())
                ->from($_POST['rsEmail'])
                ->to(getenv('EMAIL'))
                ->replyTo($_POST['rsEmail'])
                ->subject($subject)
                ->text(strip_tags($emailBody))
                ->html($emailBody);

            try {
                $mailer->send($email);
                $success = true;
            } catch (TransportExceptionInterface $e) {
                $success = false;
                $message = $e->getMessage();
            }

            $message = $success ? _('Thank you for contacting me.') . ' ' . _('I will get back to you shortly.') :
                _('Error sending message.');
        } else {
            $success = false;
            $message = _('You need to fill in all required fields.');
        }
    } else {
        $success = false;
        $message = _('Google reCaptcha error.');
    }
}

echo json_encode([
    'success' => $success,
    'message' => $message,
]);