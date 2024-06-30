// Les Fonctions pures
export const obtenirHeureActuelle = () => {
  const maintenant = new Date();
  return maintenant.toLocaleTimeString('fr-FR', { hour12: false });
};

export const creerMessageHTML = (message, expediteur) => `
  <div class="message ${expediteur === 'utilisateur' ? 'envoye' : 'recu'}">
    <div class="info-message">
      <span class="expediteur-message">${expediteur === 'utilisateur' ? 'Vous' : message.nomBot}</span>
      <span class="heure-message">${message.heure}</span>
    </div>
    <div class="contenu-message">
      ${message.contenu}
    </div>
  </div>
`;

export const ajouterMessageAuChat = (message, expediteur) => {
  const messagesChat = document.getElementById('messages-chat');
  const messageHTML = creerMessageHTML(message, expediteur);
  messagesChat.innerHTML += messageHTML;
  messagesChat.scrollTop = messagesChat.scrollHeight; 
};
