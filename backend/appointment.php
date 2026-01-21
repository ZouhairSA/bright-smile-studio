<?php
/**
 * Appointment creation endpoint
 *
 * Responsibilities:
 * - Receive appointment data via HTTP POST
 * - Validate and sanitize the input
 * - Convert date/time fields to a DATETIME value
 * - Insert the appointment into the `appointments` table
 * - Return a JSON response describing the result
 */

header('Content-Type: application/json; charset=utf-8');

// Start session so we can optionally link the appointment to a logged-in user.
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
 * Helper to send an error response for appointment submission.
 *
 * @param string $message
 * @param array<string, string> $errors
 * @param int $statusCode
 * @return void
 */
function appointment_error(string $message, array $errors = [], int $statusCode = 400): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'errors'  => $errors,
    ]);
    exit;
}

// Retrieve and sanitize input fields.
$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone   = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$date    = isset($_POST['date']) ? trim($_POST['date']) : '';
$time    = isset($_POST['time']) ? trim($_POST['time']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

$errors = [];

// Basic validation rules.
if ($name === '') {
    $errors['name'] = 'Le nom est requis.';
}

if ($email === '') {
    $errors['email'] = 'L\'adresse email est requise.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'L\'adresse email n\'est pas valide.';
}

if ($phone === '') {
    $errors['phone'] = 'Le numéro de téléphone est requis.';
}

if ($date === '') {
    $errors['date'] = 'La date du rendez-vous est requise.';
}

// If we already have errors, we can return early.
if (!empty($errors)) {
    appointment_error('Certains champs sont invalides.', $errors, 422);
}

// Build a DATETIME string from date and optional time.
// Expected formats: date => YYYY-MM-DD, time => HH:MM (24h)
if ($time !== '') {
    $appointmentDateTime = $date . ' ' . $time . ':00';
} else {
    // If no time is provided, default to 09:00.
    $appointmentDateTime = $date . ' 09:00:00';
}

// Very simple check that the resulting string is a valid datetime.
$dt = DateTime::createFromFormat('Y-m-d H:i:s', $appointmentDateTime);
if (!$dt || $dt->format('Y-m-d H:i:s') !== $appointmentDateTime) {
    $errors['date'] = 'La date/heure du rendez-vous est invalide.';
}

if (!empty($errors)) {
    appointment_error('Certains champs sont invalides.', $errors, 422);
}

// Link to a user if the visitor is logged in; otherwise keep NULL.
$userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

try {
    $pdo = getPDO();

    // Insert appointment using a prepared statement.
    $stmt = $pdo->prepare('
        INSERT INTO appointments (user_id, name, email, phone, appointment_date, message)
        VALUES (:user_id, :name, :email, :phone, :appointment_date, :message)
    ');

    $stmt->execute([
        ':user_id'          => $userId,
        ':name'             => $name,
        ':email'            => $email,
        ':phone'            => $phone,
        ':appointment_date' => $appointmentDateTime,
        ':message'          => $message,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Votre demande de rendez-vous a été enregistrée avec succès.',
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur interne est survenue lors de l\'enregistrement du rendez-vous.',
    ]);
}

