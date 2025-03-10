// Fonction pour faire défiler en douceur vers une ancre
export const scrollToAnchor = (anchorId) => {
  const element = document.getElementById(anchorId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}; 