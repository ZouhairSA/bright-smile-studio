# Bright Smile Studio

Application web complète pour la gestion d'un cabinet dentaire, développée avec React/TypeScript pour le frontend et PHP/MySQL pour le backend.

## 📋 Description du Projet

Bright Smile Studio est une application web moderne permettant aux patients de :
- Consulter les services du cabinet dentaire
- Prendre rendez-vous en ligne
- Contacter le cabinet
- S'inscrire et se connecter pour gérer leurs rendez-vous
- Accéder à un tableau de bord personnel

Les administrateurs peuvent :
- Gérer les rendez-vous
- Gérer les contacts
- Gérer les utilisateurs
- Accéder à un tableau de bord administratif complet

## 🛠️ Technologies Utilisées

### Frontend
- **React 18.3.1** - Bibliothèque JavaScript pour l'interface utilisateur
- **TypeScript 5.8.3** - Typage statique pour JavaScript
- **Vite 5.4.19** - Build tool et serveur de développement
- **React Router DOM 6.30.1** - Routage côté client
- **Tailwind CSS 3.4.17** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI modernes basés sur Radix UI
- **React Hook Form 7.61.1** - Gestion de formulaires
- **Zod 3.25.76** - Validation de schémas
- **TanStack Query 5.83.0** - Gestion d'état serveur
- **Lucide React** - Bibliothèque d'icônes

### Backend
- **PHP 8.2+** - Langage de programmation serveur
- **PDO** - Interface d'accès aux données
- **MySQL** - Base de données relationnelle

### Outils de Développement
- **Vitest 3.2.4** - Framework de tests
- **ESLint 9.32.0** - Linter JavaScript/TypeScript
- **PostCSS** - Traitement CSS
- **Autoprefixer** - Préfixes CSS automatiques

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 18 ou supérieure)
   - Télécharger depuis : https://nodejs.org/
   - Vérifier l'installation : `node --version`
   - Vérifier npm : `npm --version`

2. **XAMPP** (ou équivalent avec Apache + MySQL + PHP)
   - Télécharger depuis : https://www.apachefriends.org/
   - Inclut : Apache, MySQL, PHP, phpMyAdmin

3. **Git** (optionnel, pour cloner le projet)
   - Télécharger depuis : https://git-scm.com/

## 🚀 Installation

### Étape 1 : Cloner le projet (ou télécharger)

```bash
# Si vous utilisez Git
git clone <URL_DU_REPO>
cd bright-smile-studio

# Sinon, téléchargez et extrayez le projet dans C:\xampp\htdocs\bright-smile-studio
```

### Étape 2 : Installer les dépendances Node.js

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# Installation de toutes les dépendances
npm install

# Ou avec npm ci pour une installation propre (recommandé en production)
npm ci
```

Cette commande installera toutes les dépendances listées dans `package.json`.

### Étape 3 : Configurer la base de données

1. **Démarrer XAMPP**
   - Ouvrez le panneau de contrôle XAMPP
   - Démarrez **Apache** et **MySQL**

2. **Créer la base de données**
   
   **Option A : Via phpMyAdmin (recommandé)**
   - Ouvrez votre navigateur et allez sur : `http://localhost/phpmyadmin`
   - Cliquez sur "Nouvelle base de données"
   - Nom : `bright_smile_studio`
   - Interclassement : `utf8mb4_unicode_ci`
   - Cliquez sur "Créer"
   - Sélectionnez la base de données créée
   - Cliquez sur l'onglet "Importer"
   - Choisissez le fichier : `database/bright_smile_studio.sql`
   - Cliquez sur "Exécuter"

   **Option B : Via la ligne de commande MySQL**
   ```bash
   # Se connecter à MySQL (mot de passe par défaut XAMPP : vide)
   mysql -u root -p
   
   # Exécuter le script SQL
   source C:/xampp/htdocs/bright-smile-studio/database/bright_smile_studio.sql
   
   # Ou directement
   mysql -u root < database/bright_smile_studio.sql
   ```

3. **Vérifier la configuration de la base de données**

   Ouvrez `backend/config.php` et vérifiez les paramètres :
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'bright_smile_studio');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Vide par défaut sur XAMPP
   ```

   Si votre configuration MySQL est différente, modifiez ces valeurs.

### Étape 4 : Créer un utilisateur administrateur (optionnel)

Un script utilitaire est disponible pour créer un utilisateur :

```bash
# Via navigateur
http://localhost/bright-smile-studio/backend/tools/create_user.php

# Ou via ligne de commande PHP
php backend/tools/create_user.php
```

## 🏃 Commandes de Développement

### Démarrer le serveur de développement

```bash
npm run dev
```

Cette commande :
- Démarre le serveur Vite sur `http://localhost:8080`
- Active le rechargement automatique (Hot Module Replacement)
- Configure un proxy pour les requêtes `/backend/*` vers Apache

**Accès à l'application :**
- Frontend : `http://localhost:8080/bright-smile-studio/`
- Backend API : `http://localhost/bright-smile-studio/backend/`

### Lancer les tests

```bash
# Exécuter les tests une fois
npm test

# Exécuter les tests en mode watch (surveillance)
npm run test:watch
```

### Vérifier le code (Linter)

```bash
npm run lint
```

## 🏗️ Build de Production

### Construire l'application pour la production

```bash
# Build de production optimisé
npm run build

# Build en mode développement (non optimisé, pour debug)
npm run build:dev
```

Les fichiers compilés seront générés dans le dossier `dist/` :
- `dist/index.html` - Point d'entrée HTML
- `dist/assets/` - Fichiers JavaScript et CSS minifiés

### Prévisualiser le build de production

```bash
npm run preview
```

Cette commande sert les fichiers du dossier `dist/` pour tester le build avant le déploiement.

## 📁 Structure du Projet

```
bright-smile-studio/
├── backend/                 # API PHP
│   ├── admin/              # Pages d'administration
│   │   ├── appointments.php
│   │   ├── contacts.php
│   │   ├── users.php
│   │   └── common.php
│   ├── tools/              # Outils utilitaires
│   │   └── create_user.php
│   ├── appointment.php     # Endpoint création rendez-vous
│   ├── contact.php         # Endpoint contact
│   ├── login.php           # Endpoint connexion
│   ├── logout.php          # Endpoint déconnexion
│   ├── register.php        # Endpoint inscription
│   └── config.php          # Configuration base de données
│
├── database/               # Scripts SQL
│   └── bright_smile_studio.sql
│
├── public/                 # Fichiers statiques publics
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/                    # Code source React/TypeScript
│   ├── components/         # Composants réutilisables
│   │   ├── ui/            # Composants UI (shadcn/ui)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── NavLink.tsx
│   ├── hooks/             # Hooks React personnalisés
│   ├── lib/               # Utilitaires
│   ├── pages/             # Pages de l'application
│   │   ├── Index.tsx      # Page d'accueil
│   │   ├── About.tsx      # À propos
│   │   ├── Services.tsx   # Services
│   │   ├── Appointment.tsx # Prise de rendez-vous
│   │   ├── Contact.tsx    # Contact
│   │   ├── Login.tsx      # Connexion
│   │   ├── Register.tsx   # Inscription
│   │   ├── Dashboard.tsx  # Tableau de bord utilisateur
│   │   ├── AdminDashboard.tsx # Tableau de bord admin
│   │   └── NotFound.tsx   # Page 404
│   ├── App.tsx            # Composant racine
│   ├── main.tsx           # Point d'entrée
│   └── index.css          # Styles globaux
│
├── assets/                # Assets compilés (générés)
├── dist/                  # Build de production (généré)
├── node_modules/          # Dépendances (généré)
│
├── .htaccess             # Configuration Apache
├── index.html            # HTML pour Apache
├── index.vite.html       # HTML pour Vite
├── package.json          # Dépendances et scripts npm
├── vite.config.ts        # Configuration Vite
├── tailwind.config.ts    # Configuration Tailwind CSS
├── tsconfig.json         # Configuration TypeScript
└── README.md             # Ce fichier
```

## 🔌 API Endpoints

Tous les endpoints sont situés dans `backend/` et retournent du JSON.

### Authentification

- **POST** `/backend/login.php`
  - Body : `email`, `password`
  - Retourne : `{ success, message, user }`

- **POST** `/backend/register.php`
  - Body : `full_name`, `email`, `password`
  - Retourne : `{ success, message }`

- **GET** `/backend/logout.php`
  - Déconnecte l'utilisateur et détruit la session

### Rendez-vous

- **POST** `/backend/appointment.php`
  - Body : `name`, `email`, `phone`, `date`, `time`, `message`
  - Retourne : `{ success, message, errors? }`
  - Nécessite une session active (optionnel)

### Contact

- **POST** `/backend/contact.php`
  - Body : `name`, `email`, `message`
  - Retourne : `{ success, message }`

### Administration (nécessite rôle admin)

- **GET** `/backend/admin/appointments.php`
- **GET** `/backend/admin/contacts.php`
- **GET** `/backend/admin/users.php`

## ⚙️ Configuration

### Configuration Vite (`vite.config.ts`)

Le projet est configuré pour fonctionner sous un sous-dossier Apache :
- Base URL : `/bright-smile-studio/`
- Port de développement : `8080`
- Proxy backend : `/backend/*` → `http://localhost/bright-smile-studio/backend/`

### Configuration Apache (`.htaccess`)

Le fichier `.htaccess` configure :
- Réécriture d'URL pour React Router
- Redirection des requêtes vers `index.html` pour le routage côté client

### Configuration Base de Données (`backend/config.php`)

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'bright_smile_studio');
define('DB_USER', 'root');
define('DB_PASS', ''); // Modifier si nécessaire
```

## 🗄️ Schéma de Base de Données

### Table `users`
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `full_name` (VARCHAR 150)
- `email` (VARCHAR 255, UNIQUE)
- `password` (VARCHAR 255, hashé avec `password_hash()`)
- `role` (ENUM: 'user', 'admin')
- `created_at` (TIMESTAMP)

### Table `appointments`
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY → users.id, NULLABLE)
- `name` (VARCHAR 150)
- `email` (VARCHAR 255)
- `phone` (VARCHAR 30)
- `appointment_date` (DATETIME)
- `message` (TEXT, NULLABLE)

### Table `contacts`
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY → users.id, NULLABLE)
- `name` (VARCHAR 150)
- `email` (VARCHAR 255)
- `message` (TEXT)
- `created_at` (TIMESTAMP)

## 🚀 Déploiement

### Déploiement sur XAMPP (Local)

1. Copiez le projet dans `C:\xampp\htdocs\bright-smile-studio\`
2. Exécutez `npm install`
3. Exécutez `npm run build`
4. Configurez la base de données MySQL
5. Accédez à `http://localhost/bright-smile-studio/`

### Déploiement sur Serveur Apache

1. Transférez les fichiers via FTP/SFTP
2. Installez les dépendances : `npm install`
3. Construisez l'application : `npm run build`
4. Copiez le contenu de `dist/` vers le serveur web
5. Copiez le dossier `backend/` vers le serveur
6. Configurez la base de données MySQL sur le serveur
7. Modifiez `backend/config.php` avec les identifiants du serveur

## 🐛 Dépannage

### Problème : Le serveur de développement ne démarre pas

```bash
# Vérifier que le port 8080 n'est pas utilisé
netstat -ano | findstr :8080

# Changer le port dans vite.config.ts si nécessaire
```

### Problème : Erreur de connexion à la base de données

- Vérifiez que MySQL est démarré dans XAMPP
- Vérifiez les identifiants dans `backend/config.php`
- Vérifiez que la base de données existe : `bright_smile_studio`

### Problème : Les routes React ne fonctionnent pas

- Vérifiez que `.htaccess` est présent et correctement configuré
- Vérifiez que `mod_rewrite` est activé dans Apache
- Vérifiez la configuration `base` dans `vite.config.ts`

### Problème : Erreurs CORS

- En développement, le proxy Vite devrait gérer cela automatiquement
- Vérifiez que le proxy est configuré dans `vite.config.ts`
- En production, configurez les en-têtes CORS dans Apache

## 📝 Scripts NPM Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Construit l'application pour la production |
| `npm run build:dev` | Construit l'application en mode développement |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm test` | Exécute les tests avec Vitest |
| `npm run test:watch` | Exécute les tests en mode watch |

## 📄 Licence

Ce projet est développé pour un usage éducatif/académique.

## 👥 Support

Pour toute question ou problème :
1. Vérifiez la section Dépannage ci-dessus
2. Consultez la documentation des technologies utilisées
3. Vérifiez les logs d'erreur dans la console du navigateur et les logs PHP

---

**Développé avec ❤️ pour Bright Smile Studio**
