![Chatbot](https://i.ibb.co/rpNwsG1/image.png)

# Simple Chatbot

Il s'agit d'une application de chatbot simple qui interagit avec les utilisateurs via des commandes textuelles. Le chatbot prend en charge diverses commandes pour saluer, donner des mises à jour météorologiques, des blagues aléatoires, des actualités et des informations d'aide.

## Table des matières

1. [Fonctionnalités](#fonctionnalités)
2. [Commandes](#commandes)
3. [Aperçu du Code](#aperçu-du-code)
4. [Dépendances](#dépendances)
5. [Installation et Configuration](#installation-et-configuration)

## Fonctionnalités

- Répond aux salutations des utilisateurs.
- Fournit les prévisions météorologiques pour des villes spécifiques (paris/cannes/nice/lyon/marseille/toulouse/londres).
- Raconte des blagues aléatoires (en anglais).
- Récupère les derniers titres d'actualités.
- Fournit des informations d'aide.
- Maintient un historique du chat.

## Commandes
Le chatbot reconnaît les commandes suivantes en français et en anglais :

- **Salutation :**
  - Mots-clés : `salut`, `hi`, `hello`, `bonjour`, `bonsoir`
  - Exemple : "salut"

- **Météo :**
  - Mots-clés : `meteo`, `weather`, `prevision`
  - Exemple : "meteo Paris"

- **Blague :**
  - Mots-clés : `blague`, `joke`
  - Exemple : "raconte-moi une blague"

- **Actualités :**
  - Mots-clés : `actualites`, `news`
  - Exemple : "actualites FR"

- **Aide :**
  - Mots-clés : `aide`, `help`
  - Exemple : "aide"

## Aperçu du Code

### Fichiers Principaux et Répertoires

- `main.js` : Point d'entrée de l'application. Initialise le chat.
- `src/bot/chat.js` : Contient la logique principale de gestion du chat.
- `src/utils/utils.js` : Fonctions utilitaires pour l'heure, la création de messages et l'affichage du chat.
- `src/bot/bots.js` : Définitions des bots et actions pour gérer différentes commandes.
- `index.html` : Structure HTML de l'interface du chatbot.
- `style.css` : Styles CSS pour l'interface du chatbot.

### Fonctions Clés

- **Fonctions Pures :**
  - `obtenirHeureActuelle()` 
  - `creerMessageHTML(message, expediteur)` 
  - `ajouterMessageAuChat(message, expediteur)`
- **Fonctions d'Ordre Supérieur et Callbacks :**
  - `initierChat()` 
  - `actionBot(bot, message)`
- **Fonction Récursive :**
  - `afficherHistoriqueMessagesRecursivement(messages, index)`
- **Fonctions map, filter & reduce :**
  - `trouverCleAction(actions, message)`
  - `extraireParametre(cleAction, message)`

## Dépendances

- Ce projet utilise ViteJS.
- Ce projet utilise principalement JavaScript pur et CSS.
- APIs externes utilisées :
  - API OpenWeatherMap pour les prévisions météorologiques.
  - Official Joke API pour les blagues.
  - NewsAPI pour les titres d'actualités.

## Installation et Configuration

### Prérequis

- Node.js installé sur votre machine.
- Un compte et une clé API pour [NewsAPI](https://newsapi.org/).
- Un compte et une clé API pour [OpenWeatherMap](https://api.openweathermap.org/).

### Étapes d'Installation

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/minunn/Simple-Chatbot.git
    cd Simple-Chatbot
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```

3. Ajoutez les clés API dans un fichier `apiKeys.json` à la racine du projet :
    ```json
    {
      "newsApiKey": "your_newsapi_key",
      "openWeatherMapApiKey": "your_openweathermap_key"
    }
    ```

4. Démarrez le serveur de développement :
    ```bash
    npm run dev
    ```

5. Ouvrez votre navigateur et accédez à [http://localhost:5173](http://localhost:5173/) pour voir l'application en action.
