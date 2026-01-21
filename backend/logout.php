<?php
/**
 * User logout endpoint
 *
 * Responsibilities:
 * - Destroy the current session (if any)
 * - Clear session data and cookie
 * - Return a simple JSON confirmation
 */

header('Content-Type: application/json; charset=utf-8');

// This endpoint can be called via GET or POST, but only affects the current session.
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Remove all session variables.
$_SESSION = [];

// Delete the session cookie if it exists.
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}

// Finally, destroy the session.
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Déconnexion réussie.',
]);

