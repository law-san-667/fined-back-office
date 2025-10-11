"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cleanFileName, isValidFileName } from "@/lib/file-utils";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export function FileUploadTest() {
  const [testFileName, setTestFileName] = React.useState("Mon Image Avec Espaces.jpg");
  
  const uploadProps = useSupabaseUpload({
    bucketName: "test-uploads",
    path: "test",
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1024 * 1024 * 10, // 10MB
    upsert: true,
    preserveOriginalName: false, // Utiliser le nettoyage par défaut
  });

  const { files, onUpload, loading, errors, successes, isSuccess } = uploadProps;

  const handleTestFileName = () => {
    const cleaned = cleanFileName(testFileName);
    const isValid = isValidFileName(testFileName);
    
    toast.info("Test du nom de fichier", {
      description: `Original: "${testFileName}"\nNettoyé: "${cleaned}"\nValide: ${isValid ? "Oui" : "Non"}`,
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Aucun fichier à uploader");
      return;
    }

    try {
      await onUpload();
      if (isSuccess) {
        toast.success("Upload réussi !");
      }
    } catch (error) {
      toast.error("Erreur lors de l'upload");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test de Nettoyage des Noms de Fichiers
          </CardTitle>
          <CardDescription>
            Testez comment les noms de fichiers avec espaces sont nettoyés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de fichier de test</label>
              <input
                type="text"
                value={testFileName}
                onChange={(e) => setTestFileName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Mon Fichier Avec Espaces.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Résultat du nettoyage</label>
              <div className="px-3 py-2 bg-gray-100 rounded-md font-mono text-sm">
                {cleanFileName(testFileName)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={handleTestFileName} variant="outline">
              Tester le nettoyage
            </Button>
            <div className="flex items-center gap-2 text-sm">
              {isValidFileName(testFileName) ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Nom valide</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">Nom invalide</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Test d'Upload avec Noms Nettoyés
          </CardTitle>
          <CardDescription>
            Testez l'upload de fichiers avec des noms contenant des espaces
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...uploadProps.getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          >
            <input {...uploadProps.getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              Glissez-déposez vos fichiers ici, ou cliquez pour sélectionner
            </p>
            <p className="text-sm text-gray-500">
              Images seulement • Max 10MB
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Fichiers sélectionnés :</h4>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Nettoyé : {cleanFileName(file.name)}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Erreurs :</h4>
              {errors.map((error, index) => (
                <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error.name}: {error.message}
                </div>
              ))}
            </div>
          )}

          {successes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Uploads réussis :</h4>
              {successes.map((success, index) => (
                <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                  {success.name} → {success.path}
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Uploader les fichiers
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
