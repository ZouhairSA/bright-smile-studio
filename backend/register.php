<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode HTTP non autorisée. Utilisez POST.'
    ]);
    exit;
}

require_once __DIR__ . '/config.php';

function send_error(string $message, int $statusCode = 400): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
    ]);
    exit;
}

$firstName = isset($_POST['first_name']) ? trim($_POST['first_name']) : '';
$lastName  = isset($_POST['last_name']) ? trim($_POST['last_name']) : '';
$email     = isset($_POST['email']) ? trim($_POST['email']) : '';
$password  = isset($_POST['password']) ? (string)$_POST['password'] : '';

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

if (!empty($errors)) {
    send_error('Certains champs sont invalides.', 422);
}

$fullName = $firstName . ' ' . $lastName;

try {
    $pdo = getPDO();

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);

    if ($stmt->fetch()) {
        send_error('Cette adresse email est déjà utilisée.', 409);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

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

    echo json_encode([
        'success' => true,
        'message' => 'Inscription réussie. Vous pouvez maintenant vous connecter.',
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur interne est survenue lors de l\'inscription.',
    ]);
}

