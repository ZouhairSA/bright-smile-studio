# Script PowerShell pour préparer le déploiement AWS
# Usage: .\scripts\prepare-aws-deploy.ps1

Write-Host "🚀 Préparation du déploiement AWS pour Bright Smile Studio" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Build du frontend
Write-Host "📦 Étape 1: Build du frontend React..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build du frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build du frontend terminé" -ForegroundColor Green
Write-Host ""

# Étape 2: Vérifier que le dossier dist existe
if (-not (Test-Path "dist")) {
    Write-Host "❌ Le dossier dist n'existe pas" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Dossier dist trouvé" -ForegroundColor Green
Write-Host ""

# Étape 3: Préparer le backend pour Elastic Beanstalk
Write-Host "📦 Étape 2: Préparation du backend..." -ForegroundColor Yellow

# Créer le dossier eb-deploy s'il n'existe pas
if (-not (Test-Path "eb-deploy")) {
    New-Item -ItemType Directory -Path "eb-deploy" | Out-Null
}

# Copier les fichiers backend
Write-Host "   Copie des fichiers backend..." -ForegroundColor Gray
Copy-Item -Path "backend\*" -Destination "eb-deploy\" -Recurse -Force

# Créer le fichier .htaccess
$htaccessContent = @"
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
"@
Set-Content -Path "eb-deploy\.htaccess" -Value $htaccessContent

# Créer le fichier index.php
$indexPhpContent = @"
<?php
header('Content-Type: application/json');
echo json_encode(['message' => 'Bright Smile Studio API', 'status' => 'ok']);
"@
Set-Content -Path "eb-deploy\index.php" -Value $indexPhpContent

Write-Host "✅ Backend préparé" -ForegroundColor Green
Write-Host ""

# Étape 4: Créer le ZIP du backend
Write-Host "📦 Étape 3: Création du ZIP du backend..." -ForegroundColor Yellow

if (Test-Path "backend-deploy.zip") {
    Remove-Item "backend-deploy.zip" -Force
}

Compress-Archive -Path "eb-deploy\*" -DestinationPath "backend-deploy.zip" -Force

if (Test-Path "backend-deploy.zip") {
    Write-Host "✅ ZIP créé: backend-deploy.zip" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de la création du ZIP" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Préparation terminée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Créer l'instance RDS MySQL dans AWS Console" -ForegroundColor White
Write-Host "   2. Importer le schéma SQL (database/bright_smile_studio.sql)" -ForegroundColor White
Write-Host "   3. Créer l'application Elastic Beanstalk et uploader backend-deploy.zip" -ForegroundColor White
Write-Host "   4. Créer le bucket S3 et uploader les fichiers du dossier dist/" -ForegroundColor White
Write-Host "   5. (Optionnel) Créer une distribution CloudFront" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consultez GUIDE_DEPLOIEMENT_AWS.md pour les instructions détaillées" -ForegroundColor Cyan
