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
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/server/trpc/client";
import { Bell, BookOpen, FileText } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export function AutoNotificationTest() {
  const [testPackTitle, setTestPackTitle] = React.useState("Pack de Test");
  const [testPackDescription, setTestPackDescription] = React.useState("Description du pack de test pour les notifications automatiques");
  const [testNewsTitle, setTestNewsTitle] = React.useState("Article de Test");
  const [testNewsContent, setTestNewsContent] = React.useState("Contenu de l'article de test pour les notifications automatiques");

  const { mutate: sendPackNotification, isPending: isSendingPack } =
    trpc.notifications.sendGeneralNotification.useMutation({
      onSuccess: (data) => {
        toast.success("Notification de pack envoyée !", {
          description: `${data.totalRecipients} utilisateurs ont reçu la notification.`,
        });
      },
      onError: (error) => {
        toast.error("Erreur lors de l'envoi", {
          description: error.message,
        });
      },
    });

  const { mutate: sendNewsNotification, isPending: isSendingNews } =
    trpc.notifications.sendGeneralNotification.useMutation({
      onSuccess: (data) => {
        toast.success("Notification de news envoyée !", {
          description: `${data.totalRecipients} utilisateurs ont reçu la notification.`,
        });
      },
      onError: (error) => {
        toast.error("Erreur lors de l'envoi", {
          description: error.message,
        });
      },
    });

  const handleTestPackNotification = () => {
    const shortDescription = testPackDescription.length > 100 
      ? testPackDescription.substring(0, 100) + "..." 
      : testPackDescription;

    sendPackNotification({
      title: "📚 Nouveau Pack Disponible !",
      body: `Découvrez notre nouveau pack éducatif : "${testPackTitle}"\n\n${shortDescription}`,
      data: {
        type: "new_pack",
        pack_title: testPackTitle,
        timestamp: new Date().toISOString(),
      },
      sound: "default",
      priority: "normal",
      ttl: 86400,
    });
  };

  const handleTestNewsNotification = () => {
    const plainText = testNewsContent.replace(/<[^>]*>/g, '');
    const shortContent = plainText.length > 100 
      ? plainText.substring(0, 100) + "..." 
      : plainText;

    sendNewsNotification({
      title: "📰 Nouvel Article Publié !",
      body: `Lisez notre nouvel article : "${testNewsTitle}"\n\n${shortContent}`,
      data: {
        type: "new_news",
        news_title: testNewsTitle,
        timestamp: new Date().toISOString(),
      },
      sound: "default",
      priority: "normal",
      ttl: 86400,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Test Notification Pack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Test Notification Pack
          </CardTitle>
          <CardDescription>
            Testez la notification automatique lors de la création d'un pack
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pack-title">Titre du pack</Label>
            <Input
              id="pack-title"
              value={testPackTitle}
              onChange={(e) => setTestPackTitle(e.target.value)}
              placeholder="Titre du pack"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pack-description">Description</Label>
            <Textarea
              id="pack-description"
              value={testPackDescription}
              onChange={(e) => setTestPackDescription(e.target.value)}
              placeholder="Description du pack"
              className="min-h-[80px]"
            />
          </div>
          
          <Button
            onClick={handleTestPackNotification}
            disabled={isSendingPack || !testPackTitle.trim()}
            className="w-full"
          >
            {isSendingPack ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Tester la notification Pack
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Test Notification News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Notification News
          </CardTitle>
          <CardDescription>
            Testez la notification automatique lors de la création d'un article
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="news-title">Titre de l'article</Label>
            <Input
              id="news-title"
              value={testNewsTitle}
              onChange={(e) => setTestNewsTitle(e.target.value)}
              placeholder="Titre de l'article"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="news-content">Contenu</Label>
            <Textarea
              id="news-content"
              value={testNewsContent}
              onChange={(e) => setTestNewsContent(e.target.value)}
              placeholder="Contenu de l'article"
              className="min-h-[80px]"
            />
          </div>
          
          <Button
            onClick={handleTestNewsNotification}
            disabled={isSendingNews || !testNewsTitle.trim()}
            className="w-full"
          >
            {isSendingNews ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Tester la notification News
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
