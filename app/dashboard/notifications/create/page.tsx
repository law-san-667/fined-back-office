import NotificationForm from "@/components/forms/notification-form";

export default function CreateNotificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Créer une Notification</h1>
        <p className="text-muted-foreground">
          Envoyez une nouvelle notification push aux utilisateurs
        </p>
      </div>
      
      <NotificationForm />
    </div>
  );
}

