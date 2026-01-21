# 🚀 Guide de Déploiement AWS - Bright Smile Studio

Ce guide vous explique comment déployer votre application Bright Smile Studio sur AWS en utilisant votre compte AWS Academy.

---

## 📋 Architecture AWS Recommandée

```
┌─────────────────┐
│   CloudFront    │  ← CDN pour le frontend React
└────────┬────────┘
         │
    ┌────▼────┐
    │   S3    │  ← Stockage du frontend React (build)
    └─────────┘
         │
    ┌────▼────────────┐
    │ Elastic Beanstalk│  ← Backend PHP
    └────┬────────────┘
         │
    ┌────▼────┐
    │   RDS   │  ← Base de données MySQL
    └─────────┘
```

---

## 🎯 ÉTAPE 1 : Préparer le Projet Localement

### 1.1 : Build du Frontend React

```bash
# Aller dans le dossier du projet
cd C:\xampp\htdocs\bright-smile-studio

# Installer les dépendances (si pas déjà fait)
npm install

# Créer le build de production
npm run build
```

**Résultat :** Un dossier `dist/` sera créé avec les fichiers statiques.

### 1.2 : Vérifier le Build

```bash
# Vérifier que le dossier dist existe
dir dist
```

Vous devriez voir : `index.html`, `assets/`, etc.

---

## 🗄️ ÉTAPE 2 : Créer la Base de Données RDS MySQL

### 2.1 : Se Connecter à AWS Console

1. Allez sur : https://console.aws.amazon.com
2. Connectez-vous avec vos identifiants AWS Academy
3. Sélectionnez la région : **Europe (Paris) eu-west-3** (ou celle de votre choix)

### 2.2 : Créer une Instance RDS MySQL

1. Dans la barre de recherche, tapez : **RDS**
2. Cliquez sur **"Créer une base de données"** (Create database)

**Configuration :**

- **Moteur de base de données :** MySQL
- **Version :** MySQL 8.0.x (ou la plus récente)
- **Modèle :** **db.t3.micro** (Free Tier éligible)
- **Identifiant de l'instance :** `bright-smile-db`
- **Identifiant de connexion principale :** `admin`
- **Mot de passe principal :** Créez un mot de passe fort (notez-le !)
- **Type de stockage :** SSD gp3
- **Allocation de stockage :** 20 GB
- **VPC :** Créer un nouveau VPC (ou utiliser le défaut)
- **Sous-réseau :** Par défaut
- **Sécurité publique :** **Oui** (pour simplifier, sinon configurez le Security Group)
- **Groupe de sécurité :** Créer nouveau
  - Nom : `bright-smile-db-sg`
  - Règle entrante : MySQL/Aurora (port 3306) depuis votre IP ou 0.0.0.0/0 (temporairement)
- **Nom de la base de données initiale :** `bright_smile_studio`
- **Sauvegarde automatique :** Activée
- **Monitoring :** Désactivé (pour économiser)

3. Cliquez sur **"Créer une base de données"**

**⏱️ Temps d'attente :** 5-10 minutes

### 2.3 : Noter les Informations de Connexion

Une fois créée, notez :
- **Endpoint :** `bright-smile-db.xxxxx.eu-west-3.rds.amazonaws.com`
- **Port :** `3306`
- **Nom d'utilisateur :** `admin`
- **Mot de passe :** (celui que vous avez créé)
- **Nom de la base :** `bright_smile_studio`

### 2.4 : Importer le Schéma SQL

**Option A : Via MySQL Workbench (recommandé)**

1. Téléchargez MySQL Workbench : https://dev.mysql.com/downloads/workbench/
2. Créez une nouvelle connexion :
   - Hostname : L'endpoint RDS
   - Port : 3306
   - Username : admin
   - Password : Votre mot de passe
3. Connectez-vous
4. Ouvrez le fichier : `database/bright_smile_studio.sql`
5. Exécutez le script SQL

**Option B : Via phpMyAdmin sur votre machine locale**

1. Modifiez temporairement `backend/config.php` pour pointer vers RDS
2. Utilisez un outil de migration SQL

**Option C : Via AWS CLI (avancé)**

```bash
mysql -h bright-smile-db.xxxxx.eu-west-3.rds.amazonaws.com -u admin -p bright_smile_studio < database/bright_smile_studio.sql
```

---

## ☁️ ÉTAPE 3 : Déployer le Backend PHP sur Elastic Beanstalk

### 3.1 : Préparer le Backend

Créez un fichier `.ebextensions/01-php.config` dans le dossier `backend/` :

```yaml
option_settings:
  aws:elasticbeanstalk:container:php:
    document_root: /public
  aws:elasticbeanstalk:application:environment:
    COMPOSER_HOME: /root
```

### 3.2 : Créer un Fichier de Configuration pour RDS

Créez un fichier `backend/config.aws.php` :

```php
<?php
define('DB_HOST', getenv('RDS_HOSTNAME') ?: 'localhost');
define('DB_NAME', getenv('RDS_DB_NAME') ?: 'bright_smile_studio');
define('DB_USER', getenv('RDS_USERNAME') ?: 'admin');
define('DB_PASS', getenv('RDS_PASSWORD') ?: '');
```

Modifiez `backend/config.php` pour utiliser `config.aws.php` si disponible :

```php
<?php
if (file_exists(__DIR__ . '/config.aws.php')) {
    require_once __DIR__ . '/config.aws.php';
} else {
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'bright_smile_studio');
    define('DB_USER', 'root');
    define('DB_PASS', '');
}
```

### 3.3 : Créer un Package ZIP pour Elastic Beanstalk

1. Créez un dossier `eb-deploy/`
2. Copiez tout le contenu de `backend/` dans `eb-deploy/`
3. Créez un fichier `eb-deploy/.htaccess` :

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

4. Créez un fichier `eb-deploy/index.php` (point d'entrée) :

```php
<?php
// Ce fichier redirige vers les endpoints appropriés
header('Content-Type: application/json');
echo json_encode(['message' => 'Bright Smile Studio API']);
```

5. Compressez le dossier `eb-deploy/` en ZIP : `backend-deploy.zip`

### 3.4 : Créer une Application Elastic Beanstalk

1. Dans AWS Console, cherchez **Elastic Beanstalk**
2. Cliquez sur **"Créer une application"** (Create application)

**Configuration :**

- **Nom de l'application :** `bright-smile-studio`
- **Plateforme :** PHP
- **Version de la plateforme :** PHP 8.2 (ou la plus récente)
- **Version de l'application :** Charger votre code
  - Cliquez sur **"Choisir un fichier"**
  - Sélectionnez `backend-deploy.zip`
- **Nom de l'environnement :** `bright-smile-backend-prod`
- **Domaine :** (laissez vide ou créez-en un)
- **Description :** Backend PHP pour Bright Smile Studio

**Configuration avancée :**

- **Capacité :**
  - Type d'environnement : Charge équilibrée automatique
  - Type d'instance : t3.micro (Free Tier)
  - Nombre d'instances : 1
- **Réseau :**
  - VPC : Même VPC que RDS
  - Sous-réseaux : Sélectionnez les sous-réseaux publics
- **Base de données :**
  - Créer une base de données RDS : **Non** (on l'a déjà créée)
  - Mais configurez les variables d'environnement :
    - `RDS_HOSTNAME` : L'endpoint RDS
    - `RDS_DB_NAME` : `bright_smile_studio`
    - `RDS_USERNAME` : `admin`
    - `RDS_PASSWORD` : Votre mot de passe RDS

3. Cliquez sur **"Créer un environnement"**

**⏱️ Temps d'attente :** 5-10 minutes

### 3.5 : Noter l'URL du Backend

Une fois déployé, notez l'URL : `http://bright-smile-backend-prod.xxxxx.eu-west-3.elasticbeanstalk.com`

---

## 📦 ÉTAPE 4 : Déployer le Frontend React sur S3 + CloudFront

### 4.1 : Créer un Bucket S3

1. Dans AWS Console, cherchez **S3**
2. Cliquez sur **"Créer un compartiment"** (Create bucket)

**Configuration :**

- **Nom du compartiment :** `bright-smile-studio-frontend` (doit être unique globalement)
- **Région :** Europe (Paris) eu-west-3
- **Paramètres du compartiment :**
  - Bloquer tout l'accès public : **Désactivé** (on va le configurer après)
  - Versioning : Désactivé
  - Chiffrement : Activé (SSE-S3)
- **Propriétés du compartiment :**
  - Hébergement de site web statique : **Activé**
    - Document d'index : `index.html`
    - Document d'erreur : `index.html` (pour React Router)
- **Permissions :**
  - Politique de compartiment : Ajoutez cette politique :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bright-smile-studio-frontend/*"
    }
  ]
}
```

3. Cliquez sur **"Créer un compartiment"**

### 4.2 : Uploader les Fichiers du Build

1. Ouvrez le bucket `bright-smile-studio-frontend`
2. Cliquez sur **"Téléverser"** (Upload)
3. Sélectionnez TOUS les fichiers du dossier `dist/`
4. Cliquez sur **"Téléverser"**

**Important :** Assurez-vous que `index.html` est à la racine.

### 4.3 : Configurer le Site Web Statique

1. Dans les propriétés du bucket, allez dans **"Hébergement de site web statique"**
2. Activez-le si ce n'est pas déjà fait
3. Notez l'URL du site web : `http://bright-smile-studio-frontend.s3-website.eu-west-3.amazonaws.com`

### 4.4 : Créer une Distribution CloudFront (Optionnel mais Recommandé)

1. Dans AWS Console, cherchez **CloudFront**
2. Cliquez sur **"Créer une distribution"** (Create distribution)

**Configuration :**

- **Origine :**
  - Nom du domaine d'origine : Sélectionnez votre bucket S3
  - Nom : `bright-smile-studio-s3`
- **Comportements par défaut :**
  - Viewer Protocol Policy : **Redirect HTTP to HTTPS**
  - Allowed HTTP Methods : **GET, HEAD, OPTIONS**
  - Cache Policy : **CachingOptimized**
- **Paramètres :**
  - Prix : Utilisez tous les emplacements Edge (meilleures performances)
  - Nom de domaine alternatif (CNAME) : (optionnel, pour un domaine personnalisé)
  - Certificat SSL : (optionnel, pour HTTPS avec domaine personnalisé)

3. Cliquez sur **"Créer une distribution"**

**⏱️ Temps d'attente :** 10-15 minutes pour la propagation

4. Notez l'URL CloudFront : `https://xxxxx.cloudfront.net`

---

## ⚙️ ÉTAPE 5 : Configurer le Frontend pour le Backend AWS

### 5.1 : Modifier la Configuration Vite

Modifiez `vite.config.ts` pour la production :

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const backendUrl = isProduction 
    ? 'https://bright-smile-backend-prod.xxxxx.eu-west-3.elasticbeanstalk.com'
    : 'http://localhost';

  return {
    base: "/",
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, "index.vite.html"),
      },
    },
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/backend": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/backend/, "/bright-smile-studio/backend"),
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl),
    },
  };
});
```

### 5.2 : Créer un Fichier de Configuration pour l'API

Créez `src/config/api.ts` :

```typescript
const getBackendUrl = (): string => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_BACKEND_URL || 'https://bright-smile-backend-prod.xxxxx.eu-west-3.elasticbeanstalk.com';
  }
  return import.meta.env.BASE_URL || '';
};

export const API_BASE_URL = getBackendUrl();
```

### 5.3 : Modifier les Appels API

Dans tous vos fichiers qui font des appels API (Dashboard.tsx, Login.tsx, etc.), remplacez :

```typescript
// Avant
const response = await fetch(`${apiBase}backend/login.php`, ...);

// Après
import { API_BASE_URL } from '@/config/api';
const response = await fetch(`${API_BASE_URL}/bright-smile-studio/backend/login.php`, ...);
```

### 5.4 : Rebuild le Frontend

```bash
npm run build
```

### 5.5 : Re-uploader sur S3

Supprimez les anciens fichiers et uploadez les nouveaux du dossier `dist/`.

---

## 🔒 ÉTAPE 6 : Sécuriser les Accès

### 6.1 : Configurer le Security Group de RDS

1. Allez dans **EC2** → **Security Groups**
2. Trouvez le groupe de sécurité de votre RDS
3. Modifiez les règles entrantes :
   - Autorisez MySQL (port 3306) uniquement depuis le Security Group d'Elastic Beanstalk
   - Supprimez l'accès 0.0.0.0/0

### 6.2 : Configurer CORS (si nécessaire)

Dans Elastic Beanstalk, créez un fichier `.ebextensions/cors.config` :

```yaml
files:
  "/etc/httpd/conf.d/cors.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      Header set Access-Control-Allow-Origin "*"
      Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
      Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

---

## ✅ ÉTAPE 7 : Tester le Déploiement

### 7.1 : Tester le Frontend

1. Allez sur l'URL CloudFront ou S3
2. Vérifiez que la page d'accueil s'affiche

### 7.2 : Tester le Backend

1. Testez l'endpoint : `https://bright-smile-backend-prod.xxxxx.elasticbeanstalk.com/bright-smile-studio/backend/login.php`
2. Vérifiez les logs dans Elastic Beanstalk → Logs

### 7.3 : Tester la Connexion à la Base de Données

1. Créez un utilisateur via l'interface
2. Vérifiez dans RDS que les données sont bien enregistrées

---

## 📊 ÉTAPE 8 : Monitoring et Logs

### 8.1 : Activer les Logs CloudWatch

Dans Elastic Beanstalk :
1. Allez dans **Configuration** → **Logs**
2. Activez **Log streaming to CloudWatch Logs**
3. Retention : 7 jours

### 8.2 : Surveiller les Coûts

1. Allez dans **AWS Cost Explorer**
2. Surveillez votre utilisation quotidienne
3. Configurez des alertes de budget si nécessaire

---

## 💰 Estimation des Coûts (AWS Free Tier)

- **RDS db.t3.micro :** Gratuit pendant 12 mois (750 heures/mois)
- **EC2 t3.micro (Elastic Beanstalk) :** Gratuit pendant 12 mois (750 heures/mois)
- **S3 :** 5 GB de stockage gratuit
- **CloudFront :** 50 GB de transfert de données sortantes gratuit
- **Transfert de données :** 15 GB gratuit entre services AWS

**Total estimé :** $0-5/mois (si vous restez dans les limites Free Tier)

---

## 🔧 Commandes Utiles

### Rebuild et Redéployer le Frontend

```bash
npm run build
# Puis re-uploader sur S3
```

### Redéployer le Backend

1. Modifiez les fichiers dans `backend/`
2. Recréez le ZIP : `backend-deploy.zip`
3. Dans Elastic Beanstalk → **Upload and Deploy**

### Voir les Logs du Backend

```bash
# Via AWS CLI
aws elasticbeanstalk request-environment-info \
  --environment-name bright-smile-backend-prod \
  --info-type tail
```

---

## ❓ Problèmes Courants

### Problème : Le frontend ne charge pas les assets

**Solution :**
- Vérifiez que `base: "/"` dans `vite.config.ts`
- Vérifiez que tous les fichiers sont uploadés sur S3
- Videz le cache CloudFront

### Problème : Erreur CORS

**Solution :**
- Configurez CORS dans Elastic Beanstalk (voir étape 6.2)
- Vérifiez que les headers sont corrects

### Problème : Connexion à la base de données échoue

**Solution :**
- Vérifiez que RDS et Elastic Beanstalk sont dans le même VPC
- Vérifiez le Security Group de RDS
- Vérifiez les variables d'environnement dans Elastic Beanstalk

### Problème : Les routes React ne fonctionnent pas

**Solution :**
- Configurez le document d'erreur S3 sur `index.html`
- Configurez CloudFront pour rediriger toutes les erreurs vers `index.html`

---

## 📝 Checklist de Déploiement

- [ ] Build du frontend créé (`npm run build`)
- [ ] Instance RDS MySQL créée et configurée
- [ ] Schéma SQL importé dans RDS
- [ ] Backend ZIP créé et déployé sur Elastic Beanstalk
- [ ] Variables d'environnement RDS configurées dans Elastic Beanstalk
- [ ] Bucket S3 créé et configuré pour hébergement statique
- [ ] Fichiers frontend uploadés sur S3
- [ ] Distribution CloudFront créée (optionnel)
- [ ] Security Groups configurés correctement
- [ ] Frontend testé et fonctionnel
- [ ] Backend testé et fonctionnel
- [ ] Connexion à la base de données testée
- [ ] Logs CloudWatch activés

---

## 🎉 Félicitations !

Votre application Bright Smile Studio est maintenant déployée sur AWS !

**URLs à noter :**
- Frontend (S3) : `http://bright-smile-studio-frontend.s3-website.eu-west-3.amazonaws.com`
- Frontend (CloudFront) : `https://xxxxx.cloudfront.net`
- Backend : `https://bright-smile-backend-prod.xxxxx.elasticbeanstalk.com`

---

## 📚 Ressources Supplémentaires

- [Documentation AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Documentation AWS RDS](https://docs.aws.amazon.com/rds/)
- [Documentation AWS S3](https://docs.aws.amazon.com/s3/)
- [Documentation AWS CloudFront](https://docs.aws.amazon.com/cloudfront/)

---

**Note :** Ce guide utilise AWS Free Tier. Surveillez votre utilisation pour éviter des frais inattendus.
