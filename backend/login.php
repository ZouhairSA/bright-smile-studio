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

function login_error(string $message, int $statusCode = 400): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
    ]);
    exit;
}

$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? (string)$_POST['password'] : '';

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    login_error('Veuillez fournir une adresse email valide.', 422);
}

if ($password === '') {
    login_error('Le mot de passe est requis.', 422);
}

try {
    $pdo = getPDO();

    $stmt = $pdo->prepare('SELECT id, full_name, email, password, role FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);

    $user = $stmt->fetch();

    if (!$user) {
        login_error('Identifiants incorrects.', 401);
    }

    if (!password_verify($password, $user['password'])) {
        login_error('Identifiants incorrects.', 401);
    }

    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $_SESSION['user_id']    = (int)$user['id'];
    $_SESSION['full_name']  = $user['full_name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['role']       = $user['role'] ?? 'user';

    session_regenerate_id(true);

    echo json_encode([
        'success' => true,
        'message' => 'Connexion réussie.',
        'user'    => [
            'id'        => (int)$user['id'],
            'full_name' => $user['full_name'],
            'email'     => $user['email'],
            'role'      => $user['role'] ?? 'user',
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur interne est survenue lors de la connexion.',
    ]);
}

