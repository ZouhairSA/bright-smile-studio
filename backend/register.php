<?php
/**
 * User registration endpoint
 *
 * Responsibilities:
 * - Receive registration data via HTTP POST
 * - Validate and sanitize input on the server
 * - Hash the password securely using password_hash()
 * - Store the new user in the `users` table
 * - Return a JSON response describing the result
 *
 * This script does NOT start a session automatically after registration.
 * The user should log in explicitly via login.php.
 */

// Always return JSON for easier integration with modern front-ends (React, etc.).
header('Content-Type: application/json; charset=utf-8');

// Allow only POST requests to this endpoint.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Méthode HTTP non autorisée. Utilisez POST.'
    ]);
    exit;
}

require_once __DIR__ . '/config.php';

// Helper function: send a JSON error and stop script execution.
function send_error(string $message, int $statusCode = 400): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
    ]);
    exit;
}

// 1) Retrieve and sanitize input values.
// In a typical scenario, these fields would come from a form.
$firstName = isset($_POST['first_name']) ? trim($_POST['first_name']) : '';
$lastName  = isset($_POST['last_name']) ? trim($_POST['last_name']) : '';
$email     = isset($_POST['email']) ? trim($_POST['email']) : '';
$password  = isset($_POST['password']) ? (string)$_POST['password'] : '';

// 2) Server-side validation (never trust client-side validation alone).
$errors = [];

if ($firstName === '') {
    $errors['first_name'] = 'Le prénom est requis.';
}

if ($lastName === '') {
    $errors['last_name'] = 'Le nom est requis.';
}

if ($email === '') {
    $errors['email'] = 'L\'adresse email est requise.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'L\'adresse email n\'est pas valide.';
}

if ($password === '') {
    $errors['password'] = 'Le mot de passe est requis.';
} elseif (strlen($password) < 8) {
    $errors['password'] = 'Le mot de passe doit contenir au moins 8 caractères.';
}

// If there are validation errors, return them to the client.
if (!empty($errors)) {
    send_error('Certains champs sont invalides.', 422);
}

// 3) Build the full name from first + last names.
$fullName = $firstName . ' ' . $lastName;

try {
    $pdo = getPDO();

    // 4) Check if the email is already registered.
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);

    if ($stmt->fetch()) {
        send_error('Cette adresse email est déjà utilisée.', 409);
    }

    // 5) Hash the password (uses bcrypt by default in PHP 8.2).
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // 6) Insert the new user securely using a prepared statement.
    // Role is NOT supplied by the user for security reasons.
    // New users are always created with the default role = 'user'.
    $insert = $pdo->prepare('
        INSERT INTO users (full_name, email, password, role)
        VALUES (:full_name, :email, :password, :role)
    ');

    $insert->execute([
        ':full_name' => $fullName,
        ':email'     => $email,
        ':password'  => $passwordHash,
        ':role'      => 'user',
    ]);

    // 7) Return a success response.
    echo json_encode([
        'success' => true,
        'message' => 'Inscription réussie. Vous pouvez maintenant vous connecter.',
    ]);
} catch (PDOException $e) {
    // Generic error message – avoid exposing SQL details.
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur interne est survenue lors de l\'inscription.',
    ]);
}

