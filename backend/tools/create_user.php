<?php
/**
 * CLI tool: create a user in the database
 *
 * Academic helper script to quickly seed a test user.
 * This script is intended to be executed from the command line:
 *
 *   C:\xampp\php\php.exe backend/tools/create_user.php "zohair" "zouhair@gmail.com" "zohairpass"
 *   C:\xampp\php\php.exe backend/tools/create_user.php "Jihane" "Jihane@gmail.com" "Jihane@jh" "admin"
 *
 * It uses the same security practice as register.php:
 * - password_hash() for storing passwords
 * - PDO prepared statements for SQL injection protection
 */

require_once __DIR__ . '/../config.php';

// Ensure this script runs from CLI only (not from the browser).
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "Forbidden: this script is CLI only.\n";
    exit(1);
}

// Read arguments.
// $argv[0] = script name
$fullName = $argv[1] ?? '';
$email    = $argv[2] ?? '';
$password = $argv[3] ?? '';
$role     = $argv[4] ?? 'user';

$fullName = trim((string)$fullName);
$email    = trim((string)$email);
$password = (string)$password;
$role     = strtolower(trim((string)$role));

// Basic validation.
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

// Hash password (bcrypt/argon depending on PHP defaults; safe for PHP 8.2).
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

try {
    $pdo = getPDO();

    // Prevent duplicates.
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

