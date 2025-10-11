"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/server/trpc/client";
import { Bell, Send, Users } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export function NotificationTestCard() {
  const [testToken, setTestToken] = React.useState("");

  const { mutate: sendTestNotification, isPending } =
    trpc.notifications.sendSpecificNotification.useMutation({
      onSuccess: () => {
        toast.success("Notification de test envoyée !");
        setTestToken("");
      },
      onError: (error) => {
        toast.error("Erreur lors de l'envoi du test", {
          description: error.message,
        });
      },
    });

  /*const handleTestNotification = () => {
    if (!testToken.trim()) {
      toast.error("Veuillez entrer un token Expo valide");
      return;
    }

    sendTestNotification({
      token: testToken,
      title: "Test de notification",
      body: "Ceci est un message de test depuis le dashboard admin",
      data: JSON.stringify({
        type: "test",
        timestamp: new Date().toISOString(),
      }),
    });
  };*/

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Test de Notification
        </CardTitle>
        <CardDescription>
          Testez l'envoi de notifications avec un token Expo spécifique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-token">Token Expo de test</Label>
          <Input
            id="test-token"
            placeholder="ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
            value={testToken}
            onChange={(e) => setTestToken(e.target.value)}
          />
        </div>
        
        <Button
          //onClick={handleTestNotification}
          disabled={isPending || !testToken.trim()}
          className="w-full"
        >
          {isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Test en cours...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Envoyer un test
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground">
          <p>💡 <strong>Comment obtenir un token :</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Ouvrez l'application mobile FinEd</li>
            <li>Allez dans les paramètres</li>
            <li>Copiez votre token Expo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
