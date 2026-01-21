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
                c.id,
                c.user_id,
                u.full_name AS user_full_name,
                u.email AS user_email,
                c.name,
                c.email,
                c.message,
                c.created_at
            FROM contacts c
            LEFT JOIN users u ON u.id = c.user_id
            ORDER BY c.id DESC
        ');

        echo json_encode([
            'success'  => true,
            'contacts' => $stmt->fetchAll(),
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la récupération des messages.']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'create':
            $name    = trim($_POST['name'] ?? '');
            $email   = trim($_POST['email'] ?? '');
            $message = trim($_POST['message'] ?? '');

            if ($name === '' || $email === '' || $message === '') {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Nom, email et message sont requis.']);
                exit;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Email invalide.']);
                exit;
            }

            try {
                $stmt = $pdo->prepare('
                    INSERT INTO contacts (name, email, message)
                    VALUES (:name, :email, :message)
                ');
                $stmt->execute([
                    ':name'    => $name,
                    ':email'   => $email,
                    ':message' => $message,
                ]);

                echo json_encode(['success' => true, 'message' => 'Message créé avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la création du message.']);
            }
            exit;

        case 'update':
            $id      = isset($_POST['id']) ? (int)$_POST['id'] : 0;
            $name    = trim($_POST['name'] ?? '');
            $email   = trim($_POST['email'] ?? '');
            $message = trim($_POST['message'] ?? '');

            if ($id <= 0) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'ID de message invalide.']);
                exit;
            }

            if ($name === '' || $email === '' || $message === '') {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Nom, email et message sont requis.']);
                exit;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Email invalide.']);
                exit;
            }

            try {
                $stmt = $pdo->prepare('
                    UPDATE contacts
                    SET name = :name,
                        email = :email,
                        message = :message
                    WHERE id = :id
                ');
                $stmt->execute([
                    ':name'    => $name,
                    ':email'   => $email,
                    ':message' => $message,
                    ':id'      => $id,
                ]);

                echo json_encode(['success' => true, 'message' => 'Message mis à jour avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la mise à jour du message.']);
            }
            exit;

        case 'delete':
            $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

            if ($id <= 0) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'ID de message invalide.']);
                exit;
            }

            try {
                $stmt = $pdo->prepare('DELETE FROM contacts WHERE id = :id');
                $stmt->execute([':id' => $id]);

                echo json_encode(['success' => true, 'message' => 'Message supprimé avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la suppression du message.']);
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
