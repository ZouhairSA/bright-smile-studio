<?php
/**
 * Admin common helpers
 *
 * This file centralizes access control for admin endpoints.
 * All admin endpoints must include this file and call require_admin().
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config.php';

/**
 * Ensure a PHP session is active.
 *
 * @return void
 */
function ensure_session(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

/**
 * Require that the current user is authenticated and has role=admin.
 *
 * @return void
 */
function require_admin(): void
{
    ensure_session();

    $role = $_SESSION['role'] ?? 'user';
    if ($role !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Accès refusé. Administrateur requis.',
        ]);
        exit;
    }
}

