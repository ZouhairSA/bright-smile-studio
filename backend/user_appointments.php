<?php
header('Content-Type: application/json; charset=utf-8');

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode HTTP non autorisée. Utilisez GET.'
    ]);
    exit;
}

$email = isset($_GET['email']) ? trim($_GET['email']) : '';

if ($email === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'L\'adresse email est requise.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'L\'adresse email n\'est pas valide.'
    ]);
    exit;
}

try {
    $pdo = getPDO();

    $stmt = $pdo->prepare('
        SELECT 
            id,
            name,
            email,
            phone,
            appointment_date,
            message
        FROM appointments
        WHERE email = :email
        ORDER BY appointment_date DESC
    ');

    $stmt->execute([':email' => $email]);

    $appointments = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'appointments' => $appointments,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur interne est survenue lors de la récupération des rendez-vous.',
    ]);
}
