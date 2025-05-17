# Project Idea Pre-Writing Template

_For initializing the PRD "Streamlined Agentic AI Workflow" with the Agentic Agent_

**Creation Date:** 17/05/2025
**Idea Author:** Utilisateur

## SECTION A: THE CORE IDEA

_Purpose: Capture the essence of the project for Sections 1.2 and 3.1 of the PRD_

### 1. Project Working Title

```
Gemini Copilot
```

**Example:** "Neighborhood Carpooling App"

### 2. The Idea in a Few Words (Pitch/Central Concept)

```
Une extension VS Code pour assister les développeurs en fournissant des fonctionnalités de complétion, génération, explication et documentation de code basées sur l'IA.
```

**Example:** "A mobile application to facilitate spontaneous and local carpooling between neighbors for short trips (school, shopping, activities)."

### 3. Main Problem this Project Solves

```
L'assistance au codage actuelle dans VS Code est limitée. Les développeurs ont besoin d'outils plus puissants pour accélérer leur flux de travail, mieux comprendre le code existant et générer de la documentation.
```

**Example:** "Difficulty organizing small shared trips without the complexity of national platforms, lack of trust for carpooling with strangers over short distances, waste of empty seats in cars for recurring neighborhood trips."

### 4. Proposed Solution (How the Project Solves the Problem)

```
En intégrant des capacités avancées d'IA (basées sur Gemini) directement dans l'environnement VS Code, offrant une assistance contextuelle pour la complétion, la génération, l'explication et la documentation du code.
```

**Example:** "By creating a trust network based on locality, with a simple interface to offer/search for trips instantly, and verified profiles (optional) within a neighborhood community."

## SECTION B: KEY FEATURES (INITIAL MVP)

_Purpose: Feed Section 3.1 of the PRD_

### 1. Essential Feature #1

- **Name:** Complétion de Code Intelligente
- **Description (what the user can do):** L'utilisateur reçoit des suggestions de code pertinentes et contextuelles pendant qu'il tape.
- **Key Result for the User:** Accélérer l'écriture du code et réduire les erreurs de syntaxe.
- **Desired "Vibe"/Experience (Optional):** Fluide, rapide, non intrusive.

**Example:**

- **Name:** Neighborhood Registration & Profile
- **Description:** Create an account, define your neighborhood of residence, add a photo.
- **Result:** Be identified and able to interact with neighbors.
- **Vibe:** Simple, quick, reassuring.

### 2. Essential Feature #2

- **Name:** Génération de Code
- **Description:** L'utilisateur peut demander à l'IA de générer des blocs de code, des fonctions ou des classes basés sur une description en langage naturel ou un contexte existant.
- **Key Result for the User:** Gagner du temps sur l'écriture de code répétitif ou complexe.
- **Desired "Vibe"/Experience (Optional):** Puissant, précis, facile à utiliser.

### 3. Essential Feature #3

- **Name:** Explication de Code
- **Description:** L'utilisateur peut sélectionner un morceau de code et demander à l'IA de l'expliquer en langage naturel.
- **Key Result for the User:** Mieux comprendre le code existant, y compris le code hérité ou inconnu.
- **Desired "Vibe"/Experience (Optional):** Clair, concis, pédagogique.

### 4. Essential Feature #4

- **Name:** Documentation de Code
- **Description:** L'utilisateur peut demander à l'IA de générer automatiquement de la documentation (commentaires, JSDoc, etc.) pour des fonctions, classes ou fichiers.
- **Key Result for the User:** Maintenir une documentation à jour et cohérente avec moins d'effort manuel.
- **Desired "Vibe"/Experience (Optional):** Efficace, standardisé.

## SECTION C: INITIAL DESIGN & TECHNOLOGY PREFERENCES

_Purpose: Guide AI proposals for Sections 1.10, 5.1, 5.2, 5.4 of the PRD_

### 1. General "Vibe" and Desired Aesthetics

```
L'extension doit s'intégrer nativement dans l'interface de VS Code, en respectant les thèmes et conventions de l'IDE. L'expérience utilisateur doit être fluide et non distrayante. L'esthétique doit être professionnelle et moderne.
```

**Example:** "I want something very simple, intuitive, with a modern and reassuring design. Soft colors. Inspiration: a mix between the 'Nextdoor' app for the local aspect and 'BlaBlaCar' for the simplicity of trip proposals."

### 2. Primary Target Audience (First Intuition)

```
Développeurs utilisant VS Code, des débutants aux experts, travaillant sur divers langages et types de projets.
```

**Example:** "Residents of the same neighborhood or small town, especially families for school/activity trips, and people looking to save money or reduce their ecological footprint for local errands."

### 3. Technology Stack (If you have strong preferences or constraints)

The Agentic PRD suggests as a default: Next.js, Supabase, Tailwind CSS. However, the final technology choices can be adapted by the user.

```
TypeScript pour le développement de l'extension VS Code. Utilisation des APIs de VS Code pour l'intégration.
```

**Example:** "The default stack works perfectly for me. Perhaps explore using [Library X] for mapping if needed."

### 4. Anticipated Third-Party Integrations / MCPs (If clear ideas already exist)

```
Intégration avec l'API de Google Gemini pour les capacités d'IA. Potentiellement d'autres services pour des fonctionnalités futures (ex: gestion des abonnements).
```

**Example:** "Probably a mapping service to visualize trips (e.g., Mapbox or Google Maps via MCP). Push notifications for new trip proposals."

## SECTION D: INITIAL QUESTIONS FOR YOURSELF (AND FOR ROO LATER)

_Purpose: Anticipate points to explore further_

### 1. What are the biggest risks or uncertainties for this project at this stage?

```
Performance de l'IA en temps réel dans l'IDE, coût des appels API Gemini, adoption par les utilisateurs face à la concurrence existante.
```

### 2. How could this project generate value (for users, for you/the company)?

```
Pour les utilisateurs : Gain de temps, amélioration de la qualité du code, apprentissage accéléré. Pour l'entreprise : Revenus d'abonnement, acquisition d'utilisateurs, positionnement sur le marché des outils de développement IA.
```

### 3. Are there any direct or indirect competitors that you already know of?

```
GitHub Copilot, CodeWhisperer, extensions similaires basées sur d'autres modèles d'IA.
```

### 4. On a scale of 1 to 10, how clear is this idea to you (1=very vague, 10=very clear)? Which aspects are the most unclear?

```
8/10. Les aspects les moins clairs concernent l'implémentation technique précise de l'intégration de l'IA dans VS Code et l'optimisation des performances.
```

## Instructions for the Next Step

### Saving Your Output

Once you've completed this document:

1. Save it as `idea_document.md` in your project directory
2. This file will serve as the foundation for the next phase of the workflow

### Moving to Market Research

To proceed with market research:

1. Open the prompt file in `01_AI-RUN/` that corresponds to the `02_Market_Research.md` logical step. (Ensure `00_AutoPilot.md` or your manual process calls the correct actual filename for market research).
2. Share it with your AI agent.
3. When prompted for your idea, reference this completed `idea_document.md`.

```
@MarketMaster Pro

Please analyze the market potential for my project idea. You can find the complete idea document at: `idea_document.md`

The core concept is: Une extension VS Code pour assister les développeurs en fournissant des fonctionnalités de complétion, génération, explication et documentation de code basées sur l'IA.
```

### What to Expect Next

In the Market Research phase, the AI will:

1. Analyze your idea for market viability
2. Research competitors and market trends
3. Identify target user segments
4. Provide pricing and go-to-market strategies
5. Deliver a comprehensive market analysis report

This market validation is crucial before proceeding to refine your core concept in the next phase.
