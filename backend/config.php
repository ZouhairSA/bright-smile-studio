<?php
/**
 * Bright Smile Studio - Database configuration
 *
 * This file centralizes the PDO connection settings so that
 * all backend scripts reuse the same secure connection logic.
 *
 * Requirements:
 * - Compatible with XAMPP (MySQL + PHP 8.2)
 * - Uses PDO with exceptions and prepared statements
 */

// Database connection constants.
// Adjust these values if your local XAMPP configuration is different.
define('DB_HOST', 'localhost');
define('DB_NAME', 'bright_smile_studio');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default XAMPP password for root is empty.

/**
 * Returns a configured PDO instance connected to the MySQL database.
 *
 * Using a function (instead of a global variable) makes it easy to
 * reuse the connection logic and simplifies testing.
 *
 * @return PDO
 */
function getPDO(): PDO
{
    static $pdo = null;

    // Use a static variable so the connection is created only once per request.
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';

        $options = [
            // Throw exceptions on errors (easier to debug and handle).
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            // Fetch associative arrays by default.
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Use real prepared statements (important for SQL injection protection).
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // In production we should avoid displaying raw errors to the user.
            // For an academic project, we log a generic message.
            http_response_code(500);
            die('Erreur de connexion à la base de données. Veuillez réessayer plus tard.');
        }
    }

    return $pdo;
}

