<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config.php';

function ensure_session(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

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

