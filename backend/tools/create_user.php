<?php
require_once __DIR__ . '/../config.php';

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "Forbidden: this script is CLI only.\n";
    exit(1);
}

$fullName = $argv[1] ?? '';
$email    = $argv[2] ?? '';
$password = $argv[3] ?? '';
$role     = $argv[4] ?? 'user';

$fullName = trim((string)$fullName);
$email    = trim((string)$email);
$password = (string)$password;
$role     = strtolower(trim((string)$role));

if ($fullName === '' || $email === '' || $password === '') {
    echo "Usage:\n";
    echo "  php backend/tools/create_user.php \"Full Name\" \"email@example.com\" \"password\"\n";
    exit(1);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Error: invalid email format.\n";
    exit(1);
}

if (!in_array($role, ['user', 'admin'], true)) {
    echo "Error: role must be 'user' or 'admin'.\n";
    exit(1);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

try {
    $pdo = getPDO();

    $check = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $check->execute([':email' => $email]);
    if ($check->fetch()) {
        echo "Error: a user with this email already exists.\n";
        exit(1);
    }

    $stmt = $pdo->prepare('
        INSERT INTO users (full_name, email, password, role)
        VALUES (:full_name, :email, :password, :role)
    ');
    $stmt->execute([
        ':full_name' => $fullName,
        ':email'     => $email,
        ':password'  => $passwordHash,
        ':role'      => $role,
    ]);

    echo "OK: user created successfully.\n";
} catch (PDOException $e) {
    echo "Error: database operation failed.\n";
    exit(1);
}

