<?php
require_once __DIR__ . '/common.php';
require_admin();

try {
    $pdo = getPDO();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query('
            SELECT 
                a.id,
                a.user_id,
                u.full_name AS user_full_name,
                u.email AS user_email,
                a.name,
                a.email,
                a.phone,
                a.appointment_date,
                a.message
            FROM appointments a
            LEFT JOIN users u ON u.id = a.user_id
            ORDER BY a.id DESC
        ');

        echo json_encode([
            'success'      => true,
            'appointments' => $stmt->fetchAll(),
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la récupération des rendez-vous.']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'create':
            $name    = trim($_POST['name'] ?? '');
            $email   = trim($_POST['email'] ?? '');
            $phone   = trim($_POST['phone'] ?? '');
            $date    = trim($_POST['appointment_date'] ?? '');
            $message = trim($_POST['message'] ?? '');

            if ($name === '' || $email === '' || $phone === '' || $date === '') {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Nom, email, téléphone et date sont requis.']);
                exit;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Email invalide.']);
                exit;
            }

            $normalizedDate = preg_replace('/^\s+|\s+$/', '', $date);
            if (strlen($normalizedDate) === 16) {
                $normalizedDate .= ':00';
            }
            $dt = DateTime::createFromFormat('Y-m-d H:i:s', $normalizedDate);
            if (!$dt || $dt->format('Y-m-d H:i:s') !== $normalizedDate) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Format de date/heure invalide (attendu: YYYY-MM-DD HH:MM).']);
                exit;
            }

            try {
                $stmt = $pdo->prepare('
                    INSERT INTO appointments (name, email, phone, appointment_date, message)
                    VALUES (:name, :email, :phone, :appointment_date, :message)
                ');
                $stmt->execute([
                    ':name'             => $name,
                    ':email'            => $email,
                    ':phone'            => $phone,
                    ':appointment_date' => $normalizedDate,
                    ':message'          => $message,
                ]);

                echo json_encode(['success' => true, 'message' => 'Rendez-vous créé avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la création du rendez-vous.']);
            }
            exit;

        case 'update':
            $id      = isset($_POST['id']) ? (int)$_POST['id'] : 0;
            $name    = trim($_POST['name'] ?? '');
            $email   = trim($_POST['email'] ?? '');
            $phone   = trim($_POST['phone'] ?? '');
            $date    = trim($_POST['appointment_date'] ?? '');
            $message = trim($_POST['message'] ?? '');

            if ($id <= 0) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'ID de rendez-vous invalide.']);
                exit;
            }

            if ($name === '' || $email === '' || $phone === '' || $date === '') {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Nom, email, téléphone et date sont requis.']);
                exit;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Email invalide.']);
                exit;
            }

            $normalizedDate = preg_replace('/^\s+|\s+$/', '', $date);
            if (strlen($normalizedDate) === 16) {
                $normalizedDate .= ':00';
            }
            $dt = DateTime::createFromFormat('Y-m-d H:i:s', $normalizedDate);
            if (!$dt || $dt->format('Y-m-d H:i:s') !== $normalizedDate) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Format de date/heure invalide (attendu: YYYY-MM-DD HH:MM).']);
                exit;
            }

            try {
                $stmt = $pdo->prepare('
                    UPDATE appointments
                    SET name = :name,
                        email = :email,
                        phone = :phone,
                        appointment_date = :appointment_date,
                        message = :message
                    WHERE id = :id
                ');
                $stmt->execute([
                    ':name'             => $name,
                    ':email'            => $email,
                    ':phone'            => $phone,
                    ':appointment_date' => $normalizedDate,
                    ':message'          => $message,
                    ':id'               => $id,
                ]);

                echo json_encode(['success' => true, 'message' => 'Rendez-vous mis à jour avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la mise à jour du rendez-vous.']);
            }
            exit;

        case 'delete':
            $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

            if ($id <= 0) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'ID de rendez-vous invalide.']);
                exit;
            }

            try {
                $stmt = $pdo->prepare('DELETE FROM appointments WHERE id = :id');
                $stmt->execute([':id' => $id]);

                echo json_encode(['success' => true, 'message' => 'Rendez-vous supprimé avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la suppression du rendez-vous.']);
            }
            exit;

        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Action invalide.']);
            exit;
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Méthode HTTP non autorisée.']);
