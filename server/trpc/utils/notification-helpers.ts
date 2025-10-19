import api from "@/server/api";

/**
 * Envoie une notification générale automatique lors de la création de contenu
 */
export async function sendAutoNotification(
  type: "pack" | "news",
  title: string,
  description?: string
) {
  try {
    let notificationTitle: string;
    let notificationBody: string;
    let data: Record<string, any> = {};

    if (type === "pack") {
      notificationTitle = "📚 Nouveau Pack Disponible !";
      notificationBody = `Découvrez notre nouveau pack éducatif : "${title}"`;
      data = {
        type: "new_pack",
        pack_title: title,
        timestamp: new Date().toISOString(),
      };
    } else if (type === "news") {
      notificationTitle = "📰 Nouvel Article Publié !";
      notificationBody = `Lisez notre nouvel article : "${title}"`;
      data = {
        type: "new_news",
        news_title: title,
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error("Type de notification non supporté");
    }

    // Si une description est fournie, l'ajouter au corps de la notification
    if (description && description.length > 0) {
      // Tronquer la description si elle est trop longue
      const shortDescription = description.length > 100 
        ? description.substring(0, 100) + "..." 
        : description;
      
      notificationBody += `\n\n${shortDescription}`;
    }

    const response = await api.post("/notifications/general", {
      title: notificationTitle,
      body: notificationBody,
      data,
      sound: "default",
      priority: "normal",
      ttl: 86400, // 24 heures
    });

    if (response.data.error) {
      console.error("Erreur lors de l'envoi de la notification automatique:", response.data.error);
      return { success: false, error: response.data.error };
    }

    console.log(`Notification automatique envoyée avec succès pour ${type}:`, title);
    return { success: true, data: response.data.data };

  } catch (error: any) {
    console.error("Erreur lors de l'envoi de la notification automatique:", error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message || "Erreur inconnue" 
    };
  }
}

/**
 * Messages de notification prédéfinis
 */
export const NOTIFICATION_TEMPLATES = {
  PACK_CREATED: {
    title: "📚 Nouveau Pack Disponible !",
    body: (packTitle: string, description?: string) => {
      let body = `Découvrez notre nouveau pack éducatif : "${packTitle}"`;
      if (description) {
        const shortDesc = description.length > 100 
          ? description.substring(0, 100) + "..." 
          : description;
        body += `\n\n${shortDesc}`;
      }
      return body;
    },
    data: (packTitle: string) => ({
      type: "new_pack",
      pack_title: packTitle,
      timestamp: new Date().toISOString(),
    })
  },
  
  NEWS_CREATED: {
    title: "📰 Nouvel Article Publié !",
    body: (newsTitle: string, content?: string) => {
      let body = `Lisez notre nouvel article : "${newsTitle}"`;
      if (content) {
        // Extraire un extrait du contenu (en supprimant les balises HTML)
        const plainText = content.replace(/<[^>]*>/g, '');
        const shortContent = plainText.length > 100 
          ? plainText.substring(0, 100) + "..." 
          : plainText;
        body += `\n\n${shortContent}`;
      }
      return body;
    },
    data: (newsTitle: string) => ({
      type: "new_news",
      news_title: newsTitle,
      timestamp: new Date().toISOString(),
    })
  }
};

