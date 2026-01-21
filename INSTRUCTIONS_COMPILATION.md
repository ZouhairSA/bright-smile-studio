# Instructions pour Compiler le Rapport LaTeX

## Prérequis

Pour compiler le rapport, vous devez avoir installé :

1. **LaTeX Distribution** :
   - **Windows** : MiKTeX ou TeX Live
   - **macOS** : MacTeX
   - **Linux** : TeX Live

2. **Éditeur LaTeX** (optionnel mais recommandé) :
   - TeXstudio
   - Overleaf (en ligne)
   - VS Code avec extension LaTeX Workshop

## Compilation

### Méthode 1 : Ligne de commande

```bash
# Compilation standard (2 passes pour la table des matières)
pdflatex rapport_bright_smile_studio.tex
pdflatex rapport_bright_smile_studio.tex

# Ou avec BibTeX si vous ajoutez des références
pdflatex rapport_bright_smile_studio.tex
bibtex rapport_bright_smile_studio
pdflatex rapport_bright_smile_studio.tex
pdflatex rapport_bright_smile_studio.tex
```

### Méthode 2 : Avec Overleaf (Recommandé)

1. Créer un compte sur [Overleaf](https://www.overleaf.com)
2. Créer un nouveau projet
3. Copier le contenu de `rapport_bright_smile_studio.tex`
4. Cliquer sur "Recompile"

### Méthode 3 : Avec TeXstudio

1. Ouvrir `rapport_bright_smile_studio.tex` dans TeXstudio
2. Cliquer sur "Build & View" (F5)
3. Le PDF sera généré automatiquement

## Personnalisation

### Ajouter des Captures d'Écran

1. Créer un dossier `captures/` dans le même répertoire que le fichier `.tex`
2. Placer vos captures d'écran dans ce dossier
3. Décommenter et modifier les lignes `\includegraphics{}` dans la section "Captures d'Écran"

Exemple :
```latex
\includegraphics[width=0.8\textwidth]{captures/dashboard.png}
```

### Ajouter un Logo

1. Placer votre logo dans le même répertoire (format PNG, JPG ou PDF)
2. Décommenter et modifier la ligne dans la page de titre :

```latex
\includegraphics[width=0.3\textwidth]{logo.png}
```

### Modifier les Informations

Modifier les sections suivantes dans le fichier `.tex` :
- Page de titre : Nom, date, université
- Introduction : Contexte et objectifs
- Conclusion : Perspectives personnalisées

## Packages Requis

Le document utilise les packages suivants (généralement inclus dans les distributions LaTeX modernes) :

- `geometry` : Marges de page
- `graphicx` : Images
- `hyperref` : Liens hypertexte
- `listings` : Code source
- `xcolor` : Couleurs
- `booktabs` : Tableaux professionnels
- `fancyhdr` : En-têtes et pieds de page
- `babel` : Support du français

Si un package manque, votre distribution LaTeX l'installera automatiquement.

## Résolution de Problèmes

### Erreur "File not found"

- Vérifier que tous les fichiers référencés existent
- Vérifier les chemins relatifs

### Erreur de compilation

- Compiler deux fois pour générer la table des matières
- Vérifier que tous les packages sont installés

### Caractères spéciaux

- Le document utilise `utf8` et `babel[french]` pour le support du français
- Vérifier que votre éditeur sauvegarde en UTF-8

## Structure du Document

Le rapport contient :
1. Page de titre
2. Table des matières
3. Liste des figures
4. Liste des tableaux
5. Introduction
6. Architecture de la base de données
7. Fonctionnalités principales
8. Interfaces utilisateur
9. Exemples de code
10. Captures d'écran et schémas
11. Sécurité et bonnes pratiques
12. Conclusion et perspectives

## Format de Sortie

Le document génère un PDF A4 avec :
- Marges de 2.5cm
- Police 12pt
- Numérotation automatique des pages
- Liens hypertexte cliquables
- Code source avec coloration syntaxique
