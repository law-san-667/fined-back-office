/**
 * Nettoie un nom de fichier pour l'upload en supprimant les caractères problématiques
 * et en remplaçant les espaces par des underscores
 */
export function cleanFileName(fileName: string): string {
  // Séparer le nom et l'extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';

  // Nettoyer le nom du fichier
  const cleanedName = name
    // Remplacer les espaces par des underscores
    .replace(/\s+/g, '_')
    // Supprimer les caractères spéciaux problématiques
    .replace(/[^a-zA-Z0-9._-]/g, '')
    // Supprimer les points multiples consécutifs
    .replace(/\.{2,}/g, '.')
    // Supprimer les underscores multiples consécutifs
    .replace(/_{2,}/g, '_')
    // Supprimer les underscores au début et à la fin
    .replace(/^_+|_+$/g, '')
    // S'assurer que le nom n'est pas vide
    .replace(/^$/, 'untitled');

  // Ajouter un timestamp pour éviter les collisions
  const timestamp = Date.now();
  const finalName = `${cleanedName}_${timestamp}${extension}`;

  return finalName;
}

/**
 * Génère un nom de fichier unique avec timestamp et hash
 */
export function generateUniqueFileName(originalName: string): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
  const extension = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : '';

  // Créer un hash simple basé sur le nom original
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en entier 32-bit
  }
  
  const timestamp = Date.now();
  const shortHash = Math.abs(hash).toString(36).substring(0, 8);
  
  return `file_${timestamp}_${shortHash}${extension}`;
}

/**
 * Valide si un nom de fichier est acceptable
 */
export function isValidFileName(fileName: string): boolean {
  // Vérifier la longueur
  if (fileName.length === 0 || fileName.length > 255) {
    return false;
  }

  // Vérifier les caractères interdits
  const forbiddenChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (forbiddenChars.test(fileName)) {
    return false;
  }

  // Vérifier les noms réservés (Windows)
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i;
  if (reservedNames.test(fileName)) {
    return false;
  }

  return true;
}

/**
 * Obtient l'extension d'un fichier
 */
export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.substring(lastDotIndex).toLowerCase() : '';
}

/**
 * Obtient le nom du fichier sans extension
 */
export function getFileNameWithoutExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
}



