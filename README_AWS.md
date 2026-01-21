# 🚀 Déploiement AWS - Guide Rapide

## Prérequis

- Compte AWS Academy actif
- AWS CLI installé (optionnel mais recommandé)
- Node.js et npm installés

## Déploiement en 5 Étapes

### 1️⃣ Préparer le Projet

**Windows (PowerShell):**
```powershell
.\scripts\prepare-aws-deploy.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/prepare-aws-deploy.sh
./scripts/prepare-aws-deploy.sh
```

Cette commande va :
- ✅ Build le frontend React (`npm run build`)
- ✅ Préparer le backend pour Elastic Beanstalk
- ✅ Créer le fichier ZIP `backend-deploy.zip`

### 2️⃣ Créer la Base de Données RDS

1. Allez sur [AWS Console](https://console.aws.amazon.com)
2. Cherchez **RDS** → **Créer une base de données**
3. Configuration :
   - Moteur : **MySQL 8.0**
   - Modèle : **db.t3.micro** (Free Tier)
   - Identifiant : `bright-smile-db`
   - Utilisateur : `admin`
   - Mot de passe : (créez-en un fort)
   - Nom de la base : `bright_smile_studio`
   - Sécurité publique : **Oui** (temporairement)
4. Notez l'**Endpoint RDS** (ex: `bright-smile-db.xxxxx.rds.amazonaws.com`)

### 3️⃣ Importer le Schéma SQL

**Option A : Via MySQL Workbench**
1. Téléchargez [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
2. Connectez-vous à votre RDS avec l'endpoint
3. Ouvrez `database/bright_smile_studio.sql`
4. Exécutez le script

**Option B : Via phpMyAdmin local**
1. Modifiez temporairement `backend/config.php` pour pointer vers RDS
2. Importez via phpMyAdmin

### 4️⃣ Déployer le Backend (Elastic Beanstalk)

1. AWS Console → **Elastic Beanstalk** → **Créer une application**
2. Configuration :
   - Nom : `bright-smile-studio`
   - Plateforme : **PHP 8.2**
   - Upload : Sélectionnez `backend-deploy.zip`
   - Environnement : `bright-smile-backend-prod`
3. Variables d'environnement :
   - `RDS_HOSTNAME` : Votre endpoint RDS
   - `RDS_DB_NAME` : `bright_smile_studio`
   - `RDS_USERNAME` : `admin`
   - `RDS_PASSWORD` : Votre mot de passe RDS
4. Notez l'URL : `https://bright-smile-backend-prod.xxxxx.elasticbeanstalk.com`

### 5️⃣ Déployer le Frontend (S3 + CloudFront)

#### 5.1 Créer le Bucket S3

1. AWS Console → **S3** → **Créer un compartiment**
2. Nom : `bright-smile-studio-frontend` (unique globalement)
3. Région : `eu-west-3` (Paris)
4. **Désactiver** "Bloquer tout l'accès public"
5. **Activer** "Hébergement de site web statique"
   - Document d'index : `index.html`
   - Document d'erreur : `index.html`

#### 5.2 Uploader les Fichiers

1. Ouvrez le bucket
2. **Téléverser** → Sélectionnez TOUS les fichiers du dossier `dist/`
3. Upload

#### 5.3 Configurer les Permissions

1. Onglet **Permissions** → **Politique de compartiment**
2. Ajoutez cette politique :

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

#### 5.4 (Optionnel) Créer CloudFront

1. AWS Console → **CloudFront** → **Créer une distribution**
2. Origine : Votre bucket S3
3. Viewer Protocol Policy : **Redirect HTTP to HTTPS**
4. Créez la distribution (10-15 min de propagation)

## 🔧 Configuration du Frontend pour AWS

Avant de rebuild, modifiez `vite.config.ts` pour pointer vers votre backend AWS :

```typescript
const backendUrl = import.meta.env.PROD 
  ? 'https://bright-smile-backend-prod.xxxxx.elasticbeanstalk.com'
  : 'http://localhost';
```

Puis rebuild :
```bash
npm run build
```

Et re-uploader sur S3.

## ✅ Vérification

1. **Frontend** : `http://bright-smile-studio-frontend.s3-website.eu-west-3.amazonaws.com`
2. **Backend** : `https://bright-smile-backend-prod.xxxxx.elasticbeanstalk.com/bright-smile-studio/backend/login.php`
3. **Test** : Créez un compte et vérifiez dans RDS que les données sont enregistrées

## 📊 Coûts Estimés (Free Tier)

- **RDS db.t3.micro** : Gratuit (750h/mois pendant 12 mois)
- **EC2 t3.micro** : Gratuit (750h/mois pendant 12 mois)
- **S3** : Gratuit (5 GB)
- **CloudFront** : Gratuit (50 GB transfert/mois)

**Total : ~$0-5/mois** si vous restez dans les limites Free Tier

## 📖 Documentation Complète

Consultez [GUIDE_DEPLOIEMENT_AWS.md](./GUIDE_DEPLOIEMENT_AWS.md) pour le guide détaillé avec toutes les options et dépannage.

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs CloudWatch dans Elastic Beanstalk
2. Vérifiez les Security Groups de RDS
3. Vérifiez que les variables d'environnement sont correctes
4. Consultez la section "Problèmes Courants" dans le guide complet

---

**Bon déploiement ! 🚀**
