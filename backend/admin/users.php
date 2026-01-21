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
            SELECT id, full_name, email, role, created_at
            FROM users
            ORDER BY id DESC
        ');

        echo json_encode([
            'success' => true,
            'users'   => $stmt->fetchAll(),
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la récupération des utilisateurs.']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'create':
            $fullName = trim($_POST['full_name'] ?? '');
            $email    = trim($_POST['email'] ?? '');
            $password = (string)($_POST['password'] ?? '');
            $role     = $_POST['role'] ?? 'user';

            if ($fullName === '' || $email === '' || $password === '') {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Nom, email et mot de passe sont requis.']);
                exit;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Email invalide.']);
                exit;
            }

            if (!in_array($role, ['user', 'admin'], true)) {
                $role = 'user';
            }

            try {
                $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
                $stmt->execute([':email' => $email]);
                if ($stmt->fetch()) {
                    http_response_code(409);
                    echo json_encode(['success' => false, 'message' => 'Cette adresse email est déjà utilisée.']);
                    exit;
                }

                $hash = password_hash($password, PASSWORD_DEFAULT);

                $insert = $pdo->prepare('
                    INSERT INTO users (full_name, email, password, role)
                    VALUES (:full_name, :email, :password, :role)
                ');
                $insert->execute([
                    ':full_name' => $fullName,
                    ':email'     => $email,
                    ':password'  => $hash,
                    ':role'      => $role,
                ]);

                echo json_encode(['success' => true, 'message' => 'Utilisateur créé avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la création de l\'utilisateur.']);
            }
            exit;

        case 'update':
            $id       = isset($_POST['id']) ? (int)$_POST['id'] : 0;
            $fullName = trim($_POST['full_name'] ?? '');
            $email    = trim($_POST['email'] ?? '');
            $role     = $_POST['role'] ?? 'user';

            if ($id <= 0) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'ID utilisateur invalide.']);
                exit;
            }

            if ($fullName === '' || $email === '') {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Nom et email sont requis.']);
                exit;
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'Email invalide.']);
                exit;
            }

            if (!in_array($role, ['user', 'admin'], true)) {
                $role = 'user';
            }

            try {
                $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email AND id <> :id LIMIT 1');
                $stmt->execute([':email' => $email, ':id' => $id]);
                if ($stmt->fetch()) {
                    http_response_code(409);
                    echo json_encode(['success' => false, 'message' => 'Cette adresse email est déjà utilisée.']);
                    exit;
                }

                $update = $pdo->prepare('
                    UPDATE users
                    SET full_name = :full_name, email = :email, role = :role
                    WHERE id = :id
                ');
                $update->execute([
                    ':full_name' => $fullName,
                    ':email'     => $email,
                    ':role'      => $role,
                    ':id'        => $id,
                ]);

                echo json_encode(['success' => true, 'message' => 'Utilisateur mis à jour avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la mise à jour de l\'utilisateur.']);
            }
            exit;

        case 'delete':
            $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

            if ($id <= 0) {
                http_response_code(422);
                echo json_encode(['success' => false, 'message' => 'ID utilisateur invalide.']);
                exit;
            }

            if (isset($_SESSION['user_id']) && (int)$_SESSION['user_id'] === $id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Vous ne pouvez pas supprimer votre propre compte administrateur.']);
                exit;
            }

            try {
                $delete = $pdo->prepare('DELETE FROM users WHERE id = :id');
                $delete->execute([':id' => $id]);

                echo json_encode(['success' => true, 'message' => 'Utilisateur supprimé avec succès.']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la suppression de l\'utilisateur.']);
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
