<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'bright_smile_studio');
define('DB_USER', 'root');
define('DB_PASS', '');

function getPDO(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            die('Erreur de connexion à la base de données. Veuillez réessayer plus tard.');
        }
    }

    return $pdo;
}

