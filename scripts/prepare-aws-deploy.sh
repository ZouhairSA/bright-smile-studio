#!/bin/bash
# Script Bash pour préparer le déploiement AWS
# Usage: ./scripts/prepare-aws-deploy.sh

echo "🚀 Préparation du déploiement AWS pour Bright Smile Studio"
echo ""

# Étape 1: Build du frontend
echo "📦 Étape 1: Build du frontend React..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build du frontend"
    exit 1
fi

echo "✅ Build du frontend terminé"
echo ""

# Étape 2: Vérifier que le dossier dist existe
if [ ! -d "dist" ]; then
    echo "❌ Le dossier dist n'existe pas"
    exit 1
fi

echo "📁 Dossier dist trouvé"
echo ""

# Étape 3: Préparer le backend pour Elastic Beanstalk
echo "📦 Étape 2: Préparation du backend..."

# Créer le dossier eb-deploy s'il n'existe pas
if [ ! -d "eb-deploy" ]; then
    mkdir -p eb-deploy
fi

# Copier les fichiers backend
echo "   Copie des fichiers backend..."
cp -r backend/* eb-deploy/

# Créer le fichier .htaccess
cat > eb-deploy/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
EOF

# Créer le fichier index.php
cat > eb-deploy/index.php << 'EOF'
<?php
header('Content-Type: application/json');
echo json_encode(['message' => 'Bright Smile Studio API', 'status' => 'ok']);
EOF

echo "✅ Backend préparé"
echo ""

# Étape 4: Créer le ZIP du backend
echo "📦 Étape 3: Création du ZIP du backend..."

if [ -f "backend-deploy.zip" ]; then
    rm backend-deploy.zip
fi

cd eb-deploy
zip -r ../backend-deploy.zip .
cd ..

if [ -f "backend-deploy.zip" ]; then
    echo "✅ ZIP créé: backend-deploy.zip"
else
    echo "❌ Erreur lors de la création du ZIP"
    exit 1
fi

echo ""
echo "✅ Préparation terminée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Créer l'instance RDS MySQL dans AWS Console"
echo "   2. Importer le schéma SQL (database/bright_smile_studio.sql)"
echo "   3. Créer l'application Elastic Beanstalk et uploader backend-deploy.zip"
echo "   4. Créer le bucket S3 et uploader les fichiers du dossier dist/"
echo "   5. (Optionnel) Créer une distribution CloudFront"
echo ""
echo "📖 Consultez GUIDE_DEPLOIEMENT_AWS.md pour les instructions détaillées"
