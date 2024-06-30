import { obtenirHeureActuelle, creerMessageHTML, ajouterMessageAuChat } from '../utils/utils';
import { bots } from './bots';

// je gère l'interaction utilisateur
export function initierChat() {
  const champSaisie = document.getElementById('champ-message');
  const boutonEnvoyer = document.getElementById('bouton-envoyer');
  const boutonEffacer = document.getElementById('bouton-effacer');
  const messagesChat = document.getElementById('messages-chat');

  // on récup les infos du local storage
  let historiqueMessages = JSON.parse(localStorage.getItem('historiqueMessages')) || [];

  // La fonction récursive pour afficher les messages dans le chat
  const afficherHistoriqueMessagesRecursivement = (messages, index = 0) => {
    if (index < messages.length) {
      const message = messages[index];
      const expediteur = message.expediteur === 'utilisateur' ? 'utilisateur' : 'recu';
      messagesChat.innerHTML += creerMessageHTML(message, expediteur);
      afficherHistoriqueMessagesRecursivement(messages, index + 1);
    } else {
      messagesChat.scrollTop = messagesChat.scrollHeight;  // pour avoir toujours le dernier message visible
    }
  };

  afficherHistoriqueMessagesRecursivement(historiqueMessages);

  // ici on écoute l'envoi du message par l'utilisateur et on le traite
  boutonEnvoyer.addEventListener('click', () => envoyerMessage());
  champSaisie.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') envoyerMessage();
  });
  // ici on écoute le click sur le bouton effacer
  boutonEffacer.addEventListener('click', () => effacerChat());

  // maintenant on gère l'envoi du message par l'utilisateur
  const envoyerMessage = () => {
    const texteMessage = champSaisie.value.trim();
    if (!texteMessage) return;

    const heureActuelle = obtenirHeureActuelle();
    const messageUtilisateur = { expediteur: 'utilisateur', heure: heureActuelle, contenu: texteMessage };

    historiqueMessages = [...historiqueMessages, messageUtilisateur];
    localStorage.setItem('historiqueMessages', JSON.stringify(historiqueMessages));
    ajouterMessageAuChat(messageUtilisateur, 'utilisateur');
    traiterMessage(texteMessage);
    champSaisie.value = '';
  };

  // Une fonction pour traiter le message de l'utilisateur / fonction de haut niveau 
  const traiterMessage = (message) => {
    // on Utilise Object.values et reduce (Fonctions de haut niveau)
    const reponsesBots = Object.values(bots).reduce((reponses, bot) => {
      const reponseBot = actionBot(bot, message);
      return reponseBot ? [...reponses, reponseBot] : reponses;
    }, []);

    // j'utilise Promise.all pour traiter toutes les réponses des bots en parallèle (Fonction de haut niveau)
    Promise.all(reponsesBots)
      .then(resultats => {
        resultats.forEach(resultat => {
          if (resultat) {
            const heureActuelle = obtenirHeureActuelle();
            const messageBot = { expediteur: 'recu', heure: heureActuelle, contenu: resultat.contenu, nomBot: resultat.nomBot };
            historiqueMessages = [...historiqueMessages, messageBot];
            localStorage.setItem('historiqueMessages', JSON.stringify(historiqueMessages));
            ajouterMessageAuChat(messageBot, 'recu');
          }
        });
      })
      .catch(erreur => console.error('Erreur lors du traitement du message:', erreur));
  };

  const actionBot = (bot, message) => {
    const cleAction = trouverCleAction(bot.actions, message);
    if (cleAction) {
      const resultatAction = bot.actions[cleAction](extraireParametre(cleAction, message));
      return Promise.resolve(resultatAction).then(reponse => ({
        contenu: reponse,
        nomBot: bot.nom
      }));
    }
    return null;
  };  

  const effacerChat = () => {
    historiqueMessages = [];
    localStorage.removeItem('historiqueMessages');
    messagesChat.innerHTML = '';
  };
}

// uci on trouve la clé de l'action à partir du message de l'utilisateur et on la retourne 
const trouverCleAction = (actions, message) => {
  const modelesAction = {
    salutation: /\b(salut|hi|hello|bonjour|bonsoir)\b/i,
    meteo: /\b(meteo|météo|weather)\b|\bprevisions\b/i,
    blague: /\b(blague|joke)\b/i,
    actualites: /\b(actualites|news|actualités)\b/i,
    aide: /\b(aide|help)\b/i
  };

  return Object.keys(actions).find(cle => modelesAction[cle].test(message));
};

// pareil ici on extrait le paramètre de l'action à partir du message de l'utilisateur
const extraireParametre = (cleAction, message) => {
  const modelesParametre = {
    meteo: /\b(meteo|météo|weather)\s+(\w+)\b/i,
    actualites: /\b(actualites|news|actualités)\s+(\w+)\b/i
  };

  const correspondance = modelesParametre[cleAction]?.exec(message);
  return correspondance ? correspondance[2].toLowerCase() : undefined; 
};
