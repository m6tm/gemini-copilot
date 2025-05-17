# Conventions de Codage - Gemini Copilot

## 1. Principes Généraux

Le code de Gemini Copilot doit être clair, lisible, maintenable et performant. Nous suivons les principes de codage standard pour TypeScript et JavaScript, complétés par les règles spécifiques définies ici.

## 2. Formatage du Code

Nous utilisons ESLint et Prettier pour assurer un formatage de code cohérent. Les configurations par défaut (potentiellement basées sur des règles recommandées comme Airbnb ou Google) seront utilisées, sauf indication contraire.

- Indentation : 2 espaces
- Guillemets : Simples (`'`)
- Points-virgules : Toujours présents
- Longueur de ligne : Maximum 120 caractères (indicatif)

## 3. Conventions de Nommage

- Variables et fonctions : `camelCase`
- Classes et interfaces : `PascalCase`
- Constantes globales : `UPPER_CASE_SNAKE_CASE`
- Fichiers : `kebab-case` pour les modules utilitaires, `PascalCase` pour les composants/classes principales.

## 4. Structure du Code

- Organiser le code en modules logiques et en fichiers distincts.
- Limiter la taille des fonctions et des classes pour une meilleure lisibilité et maintenabilité.
- Utiliser les fonctionnalités modernes de TypeScript/JavaScript (async/await, promesses, déstructuration, etc.).

## 5. Commentaires et Documentation

- Écrire des commentaires clairs pour expliquer les parties complexes du code, les décisions de conception non évidentes et les contournements.
- Utiliser JSDoc ou TSDoc pour documenter les fonctions, classes, interfaces, paramètres et valeurs de retour (voir Section 9.4 du PRD).

## 6. Gestion des Erreurs

- Utiliser des mécanismes de gestion des erreurs appropriés (try...catch, gestion des promesses rejetées).
- Fournir des messages d'erreur clairs et informatifs, à la fois pour les développeurs (dans les logs) et potentiellement pour les utilisateurs (dans l'interface de l'extension si pertinent).

## 7. Performance

- Écrire du code performant, en évitant les opérations bloquantes dans le thread principal de l'extension VS Code.
- Optimiser les interactions avec l'API Gemini et le backend (si présent) pour minimiser la latence.

## 8. Sécurité

- Appliquer les bonnes pratiques de sécurité, notamment dans la gestion des clés API et des données utilisateur.
- Éviter d'exposer des informations sensibles côté client.

## 9. Tests

- Écrire des tests unitaires et d'intégration pour le code (voir Section 6 du PRD).
- S'assurer que le code respecte les critères de vérification des NFRs (Section 4.10 du PRD).

## 10. Dépendances

- Gérer les dépendances avec npm ou yarn.
- Garder les dépendances à jour et être attentif aux vulnérabilités de sécurité.

## 11. Conventions Spécifiques aux Extensions VS Code

- Utiliser les APIs de VS Code de manière appropriée et idiomatique.
- Gérer le cycle de vie de l'extension (activation, désactivation).
- Utiliser les mécanismes de stockage de VS Code (Memento) pour les données persistantes légères si nécessaire.
