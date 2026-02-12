# CV - Raphaël Auberlet

Curriculum Vitae statique HTML construit avec Astro, Tailwind CSS et TypeScript.

## 🚀 Fonctionnalités

- ✅ Astro + Tailwind CSS + TypeScript
- ✅ Données CV dans `src/content/resume.json` (format JSON Resume)
- ✅ Génération automatique de PDF avec Playwright
- ✅ CI/CD avec GitHub Actions et déploiement sur GitHub Pages
- ✅ CSS d'impression optimisé avec `@media print`
- ✅ Devcontainer avec Node.js LTS, pnpm et support Podman

## 📦 Installation

```bash
# Avec npm
npm install

# Ou avec pnpm
pnpm install
```

## 🛠️ Commandes

| Commande              | Action                                      |
|-----------------------|---------------------------------------------|
| `npm run dev`         | Démarre le serveur de développement         |
| `npm run build`       | Construit le site pour la production        |
| `npm run preview`     | Prévisualise le site construit              |
| `npm run gen-pdf`     | Génère le PDF du CV dans `public/cv.pdf`    |

## 📝 Personnalisation

Modifiez le fichier `src/content/resume.json` avec vos informations personnelles. Le format suit le schéma [JSON Resume](https://jsonresume.org/).

## 🐳 Devcontainer

Le projet inclut une configuration devcontainer avec :
- Node.js LTS
- pnpm
- Support Podman rootless
- Extensions VS Code recommandées

## 🚀 Déploiement

Le projet est configuré pour se déployer automatiquement sur GitHub Pages via GitHub Actions lors d'un push sur la branche `main`.

## 📄 Licence

MIT
