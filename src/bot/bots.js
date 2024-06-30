import apiKeys from '../../apiKeys.json';

// Fonctions de haut niveau et Callbacks : 
const villes = [
  { nom: 'paris', lat: 48.8566, lon: 2.3522 },
  { nom: 'cannes', lat: 43.5528, lon: 7.0174 },
  { nom: 'nice', lat: 43.7102, lon: 7.2620 },
  { nom: 'lyon', lat: 45.75, lon: 4.85 },
  { nom: 'marseille', lat: 43.2965, lon: 5.3698 },
  { nom: 'toulouse', lat: 43.6045, lon: 1.4442 },
  { nom: 'londres', lat: 51.5074, lon: -0.1278 },
];

const actionsBot = {
    salutation: (nomBot) => () => `Bonjour je suis ${nomBot}, comment puis-je vous aider aujourd'hui ?`,
  meteo: (nomVille) => {
    const cleAPI = apiKeys.weatherAPI;
    const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    const ville = villes.find(v => v.nom === nomVille) || { nom: 'Cannes', lat: 43.5528, lon: 7.0174 };
    const { lat, lon } = ville;

    return fetch(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${cleAPI}`)
      .then(reponse => reponse.ok ? reponse.json() : Promise.reject(`Erreur lors de la récupération des prévisions météo: ${reponse.status}`))
      .then(donnees => {
        const aujourdHui = new Date();
        const demain = new Date(aujourdHui);
        demain.setDate(demain.getDate() + 1);

        // Utilisation de filter et map (Fonctions de haut niveau) pour filtrer les données et les formater
        const donneesFiltrees = donnees.list.filter(item => {
          const datePrevision = new Date(item.dt_txt);
          return [aujourdHui.getDate(), demain.getDate()].includes(datePrevision.getDate());
        });

        return donneesFiltrees.map(item => {
          const tempCelsius = item.main.temp - 273.15;
          return `Météo à ${ville.nom} le ${item.dt_txt.substr(0, 10)} à ${item.dt_txt.substr(11, 5)} le temps est ${item.weather[0].main} avec une température de ${tempCelsius.toFixed(1)}°C<br>`;
        }).join('');
      })
      .catch(erreur => `Désolé, je ne peux pas récupérer les prévisions météo pour le moment. Erreur: ${erreur}`);
  },
  blague: () => fetch('https://official-joke-api.appspot.com/random_joke')
    .then(reponse => reponse.json())
    .then(donnees => `${donnees.setup} ${donnees.punchline}`)
    .catch(() => 'Désolé, je ne peux pas récupérer une blague pour le moment.'),
    actualites: (codePays = 'fr') => fetch(`https://newsapi.org/v2/top-headlines?country=${codePays}&apiKey=${apiKeys.newsAPI}`)
    .then(reponse => {
      if (!reponse.ok) {
        throw new Error(`HTTP error ${reponse.status}`);
      }
      return reponse.json();
    })
    .then(donnees => {
      if (donnees.articles.length > 0) {
        return donnees.articles.slice(0, 5).map((article, index) => `${index + 1}. ${article.title}<br>`).join('');
      }
      return 'Pas d\'actualités disponibles pour le moment.';
    })
    .catch(erreur => {
      console.error('Erreur lors de la récupération des actualités:', erreur);
      return 'Désolé, je ne peux pas récupérer les actualités pour le moment.';
    }),
  aide: (nomBot) => () => `Commandes disponibles : - (salut,bonsoir,bonjour,hi,hello) - ${nomBot === 'Bot Météo' ? 'meteo/weather nomdelaville (par défaut Cannes)' : nomBot === 'Bot Blague' ? 'blague/joke' : 'actualites/news [code pays]'} - aide/help `,
};

// Les bots disponibles avec leurs actions
export const bots = {
  'Bot Météo': { nom: 'Bot Météo', actions: { salutation: actionsBot.salutation('Bot Météo'), meteo: actionsBot.meteo, aide: actionsBot.aide('Bot Météo') } },
  'Bot Blague': { nom: 'Bot Blague', actions: { salutation: actionsBot.salutation('Bot Blague'), blague: actionsBot.blague, aide: actionsBot.aide('Bot Blague') } },
  'Bot Actualités': { nom: 'Bot Actualités', actions: { salutation: actionsBot.salutation('Bot Actualités'), actualites: actionsBot.actualites, aide: actionsBot.aide('Bot Actualités') } }
};
