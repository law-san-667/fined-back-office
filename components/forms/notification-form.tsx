"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Send, Users } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const generalNotificationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  body: z.string().min(1, "Le corps du message est requis"),
  data: z.string().optional(),
  sound: z.enum(["default", "none"]).optional(),
  badge: z.number().min(0).max(99).optional(),
  priority: z.enum(["default", "normal", "high"]).optional(),
  ttl: z.number().min(0).optional(),
  channelId: z.string().optional(),
});

const specificNotificationSchema = generalNotificationSchema.extend({
  token: z.string().min(1, "Le token Expo est requis"),
});

type GeneralNotificationForm = z.infer<typeof generalNotificationSchema>;
type SpecificNotificationForm = z.infer<typeof specificNotificationSchema>;

const NotificationForm: React.FC = () => {
  const [isAdvanced, setIsAdvanced] = React.useState(false);

  const generalForm = useForm<GeneralNotificationForm>({
    resolver: zodResolver(generalNotificationSchema),
    defaultValues: {
      title: "",
      body: "",
      sound: "default",
      priority: "default",
    },
  });

  const specificForm = useForm<SpecificNotificationForm>({
    resolver: zodResolver(specificNotificationSchema),
    defaultValues: {
      title: "",
      body: "",
      token: "",
      sound: "default",
      priority: "default",
    },
  });

  const utils = trpc.useUtils();

  const { mutate: sendGeneralNotification, isPending: isSendingGeneral } =
    trpc.notifications.sendGeneralNotification.useMutation({
      onSuccess: (data) => {
        toast.success("Notification envoyée avec succès !", {
          description: `${data.totalRecipients} utilisateurs ont reçu la notification.`,
        });
        generalForm.reset();
      },
      onError: (error) => {
        toast.error("Erreur lors de l'envoi", {
          description: error.message,
        });
      },
    });

  const { mutate: sendSpecificNotification, isPending: isSendingSpecific } =
    trpc.notifications.sendSpecificNotification.useMutation({
      onSuccess: () => {
        toast.success("Notification envoyée avec succès !");
        specificForm.reset();
      },
      onError: (error) => {
        toast.error("Erreur lors de l'envoi", {
          description: error.message,
        });
      },
    });

  const onGeneralSubmit = (values: GeneralNotificationForm) => {
    const payload = {
      ...values,
      data: values.data ? JSON.parse(values.data) : undefined,
      badge: values.badge || undefined,
      ttl: values.ttl || undefined,
      channelId: values.channelId || undefined,
    };

    sendGeneralNotification(payload);
  };

  const onSpecificSubmit = (values: SpecificNotificationForm) => {
    const payload = {
      ...values,
      data: values.data ? JSON.parse(values.data) : undefined,
      badge: values.badge || undefined,
      ttl: values.ttl || undefined,
      channelId: values.channelId || undefined,
    };

    sendSpecificNotification(payload);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 w-full">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bell className="h-5 w-5" />
            Envoyer une Notification
          </CardTitle>
          <CardDescription>
            Envoyez des notifications push aux utilisateurs de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger value="general" className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                Notification Générale
              </TabsTrigger>
              <TabsTrigger value="specific" className="flex items-center gap-2 text-sm">
                <Send className="h-4 w-4" />
                Notification Ciblée
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de la notification *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Nouveau contenu disponible"
                              className="py-2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="sound"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Son</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un son" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="default">Son par défaut</SelectItem>
                              <SelectItem value="none">Aucun son</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez le contenu de votre notification..."
                            className="min-h-[100px] py-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="advanced-general"
                      checked={isAdvanced}
                      onCheckedChange={setIsAdvanced}
                    />
                    <label htmlFor="advanced-general" className="text-sm font-medium">
                      Options avancées
                    </label>
                  </div>

                  {isAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/50">
                      <FormField
                        control={generalForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priorité</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner la priorité" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">Normale</SelectItem>
                                <SelectItem value="normal">Normale</SelectItem>
                                <SelectItem value="high">Haute</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="badge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Badge (0-99)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="99"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="ttl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TTL (secondes)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="3600"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="channelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Canal de notification</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="channel-id"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="data"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Données personnalisées (JSON)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='{"type": "news", "id": "123"}'
                                className="min-h-[80px] font-mono text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSendingGeneral}
                    className="w-full py-3"
                    size="lg"
                  >
                    {isSendingGeneral ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Envoyer à tous les utilisateurs
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="specific" className="space-y-4 mt-4">
              <Form {...specificForm}>
                <form onSubmit={specificForm.handleSubmit(onSpecificSubmit)} className="space-y-4">
                  <FormField
                    control={specificForm.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Expo *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
                            className="py-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      control={specificForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de la notification *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Paiement confirmé"
                              className="py-2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={specificForm.control}
                      name="sound"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Son</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un son" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="default">Son par défaut</SelectItem>
                              <SelectItem value="none">Aucun son</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={specificForm.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez le contenu de votre notification..."
                            className="min-h-[100px] py-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="advanced-specific"
                      checked={isAdvanced}
                      onCheckedChange={setIsAdvanced}
                    />
                    <label htmlFor="advanced-specific" className="text-sm font-medium">
                      Options avancées
                    </label>
                  </div>

                  {isAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/50">
                      <FormField
                        control={specificForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priorité</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner la priorité" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="default">Normale</SelectItem>
                                <SelectItem value="normal">Normale</SelectItem>
                                <SelectItem value="high">Haute</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={specificForm.control}
                        name="badge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Badge (0-99)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="99"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={specificForm.control}
                        name="ttl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TTL (secondes)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="3600"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={specificForm.control}
                        name="channelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Canal de notification</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="channel-id"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={specificForm.control}
                        name="data"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Données personnalisées (JSON)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='{"type": "payment", "amount": "5000"}'
                                className="min-h-[80px] font-mono text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSendingSpecific}
                    className="w-full py-3"
                    size="lg"
                  >
                    {isSendingSpecific ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer la notification
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationForm;
