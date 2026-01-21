# 🚀 Guide de Démarrage - Commandes Pas à Pas

Ce guide vous montre **exactement** quelles commandes exécuter, **une par une**, pour démarrer le projet Bright Smile Studio.

---

## 📋 ÉTAPE 1 : Vérifier les Prérequis

### Commande 1.1 : Vérifier Node.js
```bash
node --version
```
**Résultat attendu :** `v18.x.x` ou supérieur

### Commande 1.2 : Vérifier npm
```bash
npm --version
```
**Résultat attendu :** `9.x.x` ou supérieur

### Commande 1.3 : Vérifier que XAMPP est installé
- Ouvrez le **Panneau de Contrôle XAMPP**
- Vérifiez que **Apache** et **MySQL** sont disponibles

---

## 📂 ÉTAPE 2 : Se Placer dans le Dossier du Projet

### Commande 2.1 : Naviguer vers le dossier du projet
```bash
cd C:\xampp\htdocs\bright-smile-studio
```

### Commande 2.2 : Vérifier que vous êtes au bon endroit
```bash
dir
```
**Vous devriez voir :** `package.json`, `src/`, `backend/`, etc.

---

## 📦 ÉTAPE 3 : Installer les Dépendances

### Commande 3.1 : Installer toutes les dépendances Node.js
```bash
npm install
```

**⏱️ Temps d'exécution :** 2-5 minutes

**Ce que fait cette commande :**
- Télécharge et installe toutes les dépendances listées dans `package.json`
- Crée le dossier `node_modules/`
- Crée le fichier `package-lock.json`

**✅ Succès si vous voyez :** `added XXX packages`

---

## 🗄️ ÉTAPE 4 : Configurer la Base de Données

### Commande 4.1 : Démarrer XAMPP
1. Ouvrez le **Panneau de Contrôle XAMPP**
2. Cliquez sur **Start** pour **Apache**
3. Cliquez sur **Start** pour **MySQL**

**✅ Succès si :** Les boutons deviennent verts

### Commande 4.2 : Ouvrir phpMyAdmin
- Ouvrez votre navigateur
- Allez sur : `http://localhost/phpmyadmin`

### Commande 4.3 : Créer la base de données (via phpMyAdmin)
1. Cliquez sur **"Nouvelle base de données"** (ou "New")
2. Nom de la base : `bright_smile_studio`
3. Interclassement : `utf8mb4_unicode_ci`
4. Cliquez sur **"Créer"** (ou "Create")

### Commande 4.4 : Importer le schéma SQL
1. Dans phpMyAdmin, sélectionnez la base `bright_smile_studio`
2. Cliquez sur l'onglet **"Importer"** (ou "Import")
3. Cliquez sur **"Choisir un fichier"** (ou "Choose File")
4. Sélectionnez : `C:\xampp\htdocs\bright-smile-studio\database\bright_smile_studio.sql`
5. Cliquez sur **"Exécuter"** (ou "Go")

**✅ Succès si vous voyez :** "Import réussi" avec les tables créées

---

## ⚙️ ÉTAPE 5 : Vérifier la Configuration

### Commande 5.1 : Vérifier le fichier de configuration PHP
Ouvrez le fichier : `C:\xampp\htdocs\bright-smile-studio\backend\config.php`

**Vérifiez que les valeurs sont :**
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'bright_smile_studio');
define('DB_USER', 'root');
define('DB_PASS', '');
```

Si votre MySQL a un mot de passe, modifiez `DB_PASS`.

---

## 🚀 ÉTAPE 6 : Démarrer le Serveur de Développement

### Commande 6.1 : Démarrer Vite (serveur de développement)
```bash
npm run dev
```

**⏱️ Temps d'exécution :** 10-30 secondes

**✅ Succès si vous voyez :**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/bright-smile-studio/
  ➜  Network: use --host to expose
```

### Commande 6.2 : Ouvrir l'application dans le navigateur
- Ouvrez votre navigateur
- Allez sur : `http://localhost:8080/bright-smile-studio/`

**✅ L'application devrait s'afficher !**

---

## 🎯 ÉTAPE 7 : Tester l'Application

### Test 7.1 : Vérifier la page d'accueil
- Vous devriez voir la page d'accueil avec le hero et les services

### Test 7.2 : Tester la navigation
- Cliquez sur "À propos", "Services", "Contact", etc.
- Les pages devraient se charger sans rechargement complet

### Test 7.3 : Tester le formulaire de contact
- Allez sur `/contact`
- Remplissez le formulaire
- Envoyez-le
- Vérifiez dans phpMyAdmin que le message est dans la table `contacts`

---

## 👤 ÉTAPE 8 : Créer un Utilisateur (Optionnel)

### Commande 8.1 : Créer un utilisateur via le navigateur
- Allez sur : `http://localhost/bright-smile-studio/backend/tools/create_user.php`
- Suivez les instructions à l'écran

### Commande 8.2 : Créer un utilisateur via la ligne de commande
```bash
php backend/tools/create_user.php
```

---

## 🛑 ÉTAPE 9 : Arrêter le Serveur de Développement

### Commande 9.1 : Arrêter Vite
Dans le terminal où `npm run dev` tourne :
- Appuyez sur **`Ctrl + C`**

---

## 📝 RÉCAPITULATIF DES COMMANDES ESSENTIELLES

### Pour démarrer le projet :
```bash
# 1. Aller dans le dossier
cd C:\xampp\htdocs\bright-smile-studio

# 2. Installer les dépendances (une seule fois)
npm install

# 3. Démarrer XAMPP (Apache + MySQL)

# 4. Créer la base de données via phpMyAdmin

# 5. Démarrer le serveur de développement
npm run dev
```

### Pour arrêter le projet :
```bash
# Dans le terminal : Ctrl + C
```

### Pour reconstruire après des modifications :
```bash
npm run build
```

---

## 🔧 COMMANDES UTILES

### Vérifier les erreurs de code
```bash
npm run lint
```

### Exécuter les tests
```bash
npm test
```

### Construire pour la production
```bash
npm run build
```

### Prévisualiser le build de production
```bash
npm run build
npm run preview
```

---

## ❓ PROBLÈMES COURANTS

### Problème : `npm install` échoue
**Solution :**
```bash
# Supprimer node_modules et package-lock.json
rmdir /s node_modules
del package-lock.json

# Réinstaller
npm install
```

### Problème : Le port 8080 est déjà utilisé
**Solution :**
- Modifiez le port dans `vite.config.ts` (ligne 20)
- Changez `port: 8080` en `port: 3000` (ou autre)

### Problème : Erreur de connexion à la base de données
**Solution :**
1. Vérifiez que MySQL est démarré dans XAMPP
2. Vérifiez `backend/config.php`
3. Testez la connexion dans phpMyAdmin

### Problème : Les routes ne fonctionnent pas
**Solution :**
- Vérifiez que `.htaccess` existe dans le dossier racine
- Vérifiez que `mod_rewrite` est activé dans Apache

---

## ✅ CHECKLIST DE DÉMARRAGE

- [ ] Node.js installé et vérifié
- [ ] npm installé et vérifié
- [ ] XAMPP installé
- [ ] Projet dans `C:\xampp\htdocs\bright-smile-studio`
- [ ] `npm install` exécuté avec succès
- [ ] Apache démarré dans XAMPP
- [ ] MySQL démarré dans XAMPP
- [ ] Base de données `bright_smile_studio` créée
- [ ] Fichier SQL importé
- [ ] `npm run dev` exécuté avec succès
- [ ] Application accessible sur `http://localhost:8080/bright-smile-studio/`

---

**🎉 Félicitations ! Votre projet est maintenant démarré !**
