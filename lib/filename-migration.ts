/**
 * Script de migration pour nettoyer les noms de fichiers existants
 * dans Supabase Storage qui pourraient causer des problèmes
 */

import { cleanFileName } from "./file-utils";

export interface FileMigrationResult {
  originalPath: string;
  newPath: string;
  success: boolean;
  error?: string;
}

/**
 * Nettoie un chemin de fichier existant
 */
export function cleanFilePath(originalPath: string): string {
  const pathParts = originalPath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const directory = pathParts.slice(0, -1).join('/');
  
  const cleanedFileName = cleanFileName(fileName);
  
  return directory ? `${directory}/${cleanedFileName}` : cleanedFileName;
}

/**
 * Vérifie si un chemin de fichier a besoin d'être nettoyé
 */
export function needsCleaning(filePath: string): boolean {
  const fileName = filePath.split('/').pop() || '';
  
  // Vérifier les caractères problématiques
  const problematicChars = /[\s'":<>|?*]/;
  return problematicChars.test(fileName);
}

/**
 * Génère une liste de fichiers qui nécessitent un nettoyage
 */
export function getFilesToClean(filePaths: string[]): string[] {
  return filePaths.filter(needsCleaning);
}

/**
 * Simule la migration d'une liste de fichiers
 */
export function simulateFileMigration(filePaths: string[]): FileMigrationResult[] {
  return filePaths.map(filePath => {
    try {
      const newPath = cleanFilePath(filePath);
      return {
        originalPath: filePath,
        newPath,
        success: true,
      };
    } catch (error) {
      return {
        originalPath: filePath,
        newPath: '',
        success: false,
        error: String(error),
      };
    }
  });
}

/**
 * Exemples de fichiers problématiques courants
 */
export const PROBLEMATIC_FILE_EXAMPLES = [
  "Capture d'écran 2025-05-06 235124.png",
  "Mon Image Avec Espaces.jpg",
  "Fichier@#$%.png",
  "Test (1).jpg",
  "Photo:2025-01-01.png",
  "Document|Important.pdf",
  "File?with?questions.jpg",
  "Image*with*asterisks.png",
  "File<with>brackets.jpg",
  "Document>important.pdf",
];

/**
 * Teste la fonction de nettoyage avec des exemples
 */
export function testFileNameCleaning(): void {
  console.log("🧪 Test du nettoyage des noms de fichiers :\n");
  
  PROBLEMATIC_FILE_EXAMPLES.forEach(example => {
    const cleaned = cleanFileName(example);
    const needsClean = needsCleaning(example);
    
    console.log(`Original: "${example}"`);
    console.log(`Nettoyé:  "${cleaned}"`);
    console.log(`Nécessite nettoyage: ${needsClean ? "OUI" : "NON"}`);
    console.log("---");
  });
}

/**
 * Fonction utilitaire pour logger les résultats de migration
 */
export function logMigrationResults(results: FileMigrationResult[]): void {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`📊 Résultats de migration :`);
  console.log(`✅ Succès: ${successful.length}`);
  console.log(`❌ Échecs: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log("\n❌ Échecs :");
    failed.forEach(result => {
      console.log(`- ${result.originalPath}: ${result.error}`);
    });
  }
  
  if (successful.length > 0) {
    console.log("\n✅ Migrations réussies :");
    successful.forEach(result => {
      console.log(`- ${result.originalPath} → ${result.newPath}`);
    });
  }
}
