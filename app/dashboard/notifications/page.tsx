import NotificationForm from "@/components/forms/notification-form";
import { AutoNotificationTest } from "@/components/forms/auto-notification-test";
import { FileUploadTest } from "@/components/file-upload-test";
import { FilenameDiagnostic } from "@/components/filename-diagnostic";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        {/*<h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Envoyez des notifications push aux utilisateurs de l'application
        </p>*/}
      </div>
      
      <NotificationForm />
      
      {/*<div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Test des Notifications Automatiques</h2>
        <p className="text-muted-foreground">
          Testez les notifications qui sont automatiquement envoyées lors de la création de packs ou d'articles
        </p>
        <AutoNotificationTest />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Test d'Upload de Fichiers</h2>
        <p className="text-muted-foreground">
          Testez l'upload de fichiers avec des noms contenant des espaces et caractères spéciaux
        </p>
        <FileUploadTest />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Diagnostic des Noms de Fichiers</h2>
        <p className="text-muted-foreground">
          Diagnostic spécifique pour le fichier qui a causé l'erreur
        </p>
        <FilenameDiagnostic />
      </div>/*/}
    </div>
  );
}
