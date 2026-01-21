<?php
/**
 * User login endpoint
 *
 * Responsibilities:
 * - Receive login credentials via HTTP POST
 * - Validate and sanitize email/password
 * - Verify user exists and password is correct
 * - Start a secure PHP session and store user data
 * - Return a JSON response describing the result
 */

header('Content-Type: application/json; charset=utf-8');

// Allow only POST requests.
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
 * Simple helper to send an error response and stop execution.
 *
 * @param string $message
 * @param int    $statusCode
 * @return void
 */
function login_error(string $message, int $statusCode = 400): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
    ]);
    exit;
}

// 1) Retrieve input values.
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? (string)$_POST['password'] : '';

// 2) Basic server-side validation.
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    login_error('Veuillez fournir une adresse email valide.', 422);
}

if ($password === '') {
    login_error('Le mot de passe est requis.', 422);
}

try {
    $pdo = getPDO();

    // 3) Fetch the user by email using a prepared statement (avoids SQL injection).
    $stmt = $pdo->prepare('SELECT id, full_name, email, password, role FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);

    $user = $stmt->fetch();

    if (!$user) {
        // We do not reveal whether the email exists, for security reasons.
        login_error('Identifiants incorrects.', 401);
    }

    // 4) Verify the password against the stored hash.
    if (!password_verify($password, $user['password'])) {
        login_error('Identifiants incorrects.', 401);
    }

    // 5) Start a secure session and store minimal user data.
    if (session_status() !== PHP_SESSION_ACTIVE) {
        // It is important that no output is sent before session_start().
        session_start();
    }

    $_SESSION['user_id']    = (int)$user['id'];
    $_SESSION['full_name']  = $user['full_name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['role']       = $user['role'] ?? 'user';

    // Optional: regenerate the session ID to prevent fixation attacks.
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

