"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cleanFileName, generateUniqueFileName } from "@/lib/file-utils";
import { PROBLEMATIC_FILE_EXAMPLES, simulateFileMigration, logMigrationResults } from "@/lib/filename-migration";
import { Bug, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export function FilenameDiagnostic() {
  const testFileName = "Capture d'écran 2025-05-06 235124.png";
  
  const [testResults, setTestResults] = React.useState<{
    original: string;
    cleaned: string;
    unique: string;
    issues: string[];
  } | null>(null);

  const runDiagnostic = () => {
    const cleaned = cleanFileName(testFileName);
    const unique = generateUniqueFileName(testFileName);
    
    const issues: string[] = [];
    
    // Vérifier les problèmes potentiels
    if (testFileName.includes(" ")) {
      issues.push("Contient des espaces");
    }
    if (testFileName.includes("'")) {
      issues.push("Contient des apostrophes");
    }
    if (testFileName.includes(":")) {
      issues.push("Contient des deux-points");
    }
    if (testFileName.length > 255) {
      issues.push("Nom trop long (>255 caractères)");
    }
    
    setTestResults({
      original: testFileName,
      cleaned,
      unique,
      issues,
    });

    toast.success("Diagnostic terminé", {
      description: `Nom nettoyé: ${cleaned}`,
    });
  };

  const testUpload = async () => {
    try {
      // Simuler l'upload avec le nom problématique
      const cleanedName = cleanFileName(testFileName);
      const uploadPath = `thumbnail/${cleanedName}`;
      
      toast.info("Test d'upload simulé", {
        description: `Chemin: ${uploadPath}`,
      });
    } catch (error) {
      toast.error("Erreur lors du test", {
        description: String(error),
      });
    }
  };

  const testMigration = () => {
    const migrationResults = simulateFileMigration(PROBLEMATIC_FILE_EXAMPLES);
    const successful = migrationResults.filter(r => r.success).length;
    const failed = migrationResults.filter(r => !r.success).length;
    
    toast.success("Test de migration terminé", {
      description: `${successful} succès, ${failed} échecs`,
    });
    
    // Log dans la console pour debug
    logMigrationResults(migrationResults);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Diagnostic des Noms de Fichiers
        </CardTitle>
        <CardDescription>
          Testez le nom de fichier problématique que vous avez rencontré
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Nom de fichier problématique :</h4>
          <code className="text-sm bg-white p-2 rounded border block">
            {testFileName}
          </code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={runDiagnostic} className="w-full">
            <Bug className="h-4 w-4 mr-2" />
            Lancer le Diagnostic
          </Button>
          <Button onClick={testUpload} variant="outline" className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Tester l'Upload
          </Button>
          <Button onClick={testMigration} variant="secondary" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Migration
          </Button>
        </div>

        {testResults && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Nom Original</h4>
                <code className="text-sm text-blue-600 break-all">
                  {testResults.original}
                </code>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Nom Nettoyé</h4>
                <code className="text-sm text-green-600 break-all">
                  {testResults.cleaned}
                </code>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Nom Unique</h4>
              <code className="text-sm text-purple-600 break-all">
                {testResults.unique}
              </code>
            </div>

            {testResults.issues.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Problèmes Détectés
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {testResults.issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Chemin d'Upload Simulé</h4>
              <code className="text-sm text-gray-600 break-all">
                thumbnail/{testResults.cleaned}
              </code>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Solutions appliquées :</p>
          <ul className="space-y-1 ml-4">
            <li>• Espaces remplacés par des underscores</li>
            <li>• Caractères spéciaux supprimés</li>
            <li>• Timestamp ajouté pour l'unicité</li>
            <li>• Validation des noms de fichiers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
