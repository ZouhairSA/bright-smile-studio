<?php
/**
 * Contact form endpoint
 *
 * Responsibilities:
 * - Receive contact form data via HTTP POST
 * - Validate and sanitize required fields
 * - Store the message in the `contacts` table
 * - Return a JSON response describing the result
 */

header('Content-Type: application/json; charset=utf-8');

// Start session so we can optionally link the message to a logged-in user.
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode HTTP non autorisée. Utilisez POST.'
    ]);
    exit;
}

require_once __DIR__ . '/config.php';

/**
 * Helper to send an error response for the contact form.
 *
 * @param string $message
 * @param array<string, string> $errors
 * @param int $statusCode
 * @return void
 */
function contact_error(string $message, array $errors = [], int $statusCode = 400): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'errors'  => $errors,
    ]);
    exit;
}

// Retrieve and sanitize inputs.
$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

$errors = [];

if ($name === '') {
    $errors['name'] = 'Le nom est requis.';
}

if ($email === '') {
    $errors['email'] = 'L\'adresse email est requise.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'L\'adresse email n\'est pas valide.';
}

if ($message === '') {
    $errors['message'] = 'Le message est requis.';
} elseif (mb_strlen($message) < 10) {
    $errors['message'] = 'Le message doit contenir au moins 10 caractères.';
}

if (!empty($errors)) {
    contact_error('Certains champs sont invalides.', $errors, 422);
}

// Link to a user if the visitor is logged in; otherwise keep NULL.
$userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

try {
    $pdo = getPDO();

    $stmt = $pdo->prepare('
        INSERT INTO contacts (user_id, name, email, message)
        VALUES (:user_id, :name, :email, :message)
    ');

    $stmt->execute([
        ':user_id' => $userId,
        ':name'    => $name,
        ':email'   => $email,
        ':message' => $message,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Votre message a été envoyé avec succès.',
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur interne est survenue lors de l\'envoi du message.',
    ]);
}

