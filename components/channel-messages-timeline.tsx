"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  LucideChevronsUpDown,
  Reply,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import IsLoading from "./ui/is-loading";

type ChannelMessagesTimelineProps = {
  messages: any[];
  channel?: any;
};

type Message = any;

export function ChannelMessagesTimeline({
  channel,
  messages,
}: ChannelMessagesTimelineProps) {
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    trpc.forumChannels.deleteChannelMessage.useMutation({
      onSuccess: () => {
        utils.forumChannels.getChannel.invalidate({ id: channel?.id });
        setIsDeleteDialogOpen(false);
        setMessageToDelete(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDeleteMessage = () => {
    if (messageToDelete) {
      deleteMessage({ id: messageToDelete.id });
    }
  };

  const confirmDelete = (message: Message) => {
    setMessageToDelete(message);
    setIsDeleteDialogOpen(true);
  };

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };

  const getParentMessage = (replyToId: string) => {
    return messages.find((msg) => msg.id === replyToId);
  };

  const isEdited = (message: Message) => {
    return message.created_at !== message.updated_at;
  };

  if (messages.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Aucun messages</h3>
          <p className="text-sm text-muted-foreground">
            Ce groupe ne contient aucun message pour l&apos;instant.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Chronologie des messages du groupe{" "}
            <span className="text-primary font-semibold">{channel?.name}</span>
          </h2>
          <p className="text-muted-foreground">
            {channel?.message_count} messages dans l&apos;ordre chronologique
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-12"></div>

        <div className="space-y-6">
          {messages.map((message, index) => {
            const isReply = message.reply_to_id !== null;

            const isDeleted = message.is_deleted === true;

            const parentMessage = isReply
              ? getParentMessage(message.reply_to_id!)
              : null;
            const isExpanded = expandedMessage === message.id;

            return (
              <div key={message.id} className="relative">
                {/* Timeline dot */}
                <div
                  className={cn(
                    `absolute left-6 top-6 h-4 w-4 rounded-full border-4 border-background md:left-10 bg-primary`,
                    {
                      "bg-muted-foreground": isReply,
                      "bg-destructive": isDeleted,
                    }
                  )}
                ></div>

                <div
                  className={cn("ml-16 md:ml-24", {
                    "ml-20 md:ml-32": isReply,
                  })}
                >
                  <Card
                    className={cn(`transition-all duration-200`, {
                      "border-l-4 border-l-muted-foreground bg-muted/30":
                        isReply,
                      "bg-zinc-300": isDeleted,
                    })}
                  >
                    <CardContent className="p-4">
                      {/* Reply indicator */}
                      {isReply && parentMessage && (
                        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <Reply className="h-3 w-3" />
                          <span>Réponse à</span>
                          <Badge variant="outline">
                            {parentMessage.users?.name}
                          </Badge>
                          <span className="truncate max-w-xs">
                            "{parentMessage.text.slice(0, 50)}..."
                          </span>
                        </div>
                      )}

                      {/* Message header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge>{message.users?.name}</Badge>
                              {isDeleted && (
                                <Badge variant="destructive" className="">
                                  Supprimé
                                </Badge>
                              )}
                              {isEdited(message) && (
                                <Badge variant="outline" className="">
                                  Modifié
                                </Badge>
                              )}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {format(
                                new Date(message.created_at || ""),
                                "MMM d, yyyy 'à' h:mm a",
                                { locale: fr }
                              )}
                              <span className="ml-2">
                                (
                                {formatDistanceToNow(
                                  new Date(message.created_at || ""),
                                  { locale: fr, addSuffix: true }
                                )}
                                )
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => toggleMessageExpansion(message.id)}
                            disabled={isDeletingMessage}
                          >
                            <LucideChevronsUpDown />
                          </Button>

                          {!isDeleted && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="size-7"
                              onClick={() => confirmDelete(message)}
                              disabled={isDeletingMessage}
                            >
                              <Trash2 />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Message content */}
                      <div className="mt-3">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {isDeleted
                            ? "Ce message a été supprimé..."
                            : message.text}
                        </p>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3 border-t pt-4">
                          <div className="grid gap-3 text-xs md:grid-cols-2">
                            <div>
                              <span className="font-medium text-muted-foreground">
                                ID Message:
                              </span>
                              <p className="font-mono">{message.id}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                ID Channel:
                              </span>
                              <p className="font-mono">{message.channel_id}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                ID Utilisateur:
                              </span>
                              <p className="font-mono">{message.users?.id}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Créé le:
                              </span>
                              <p>
                                {format(
                                  new Date(message.created_at || ""),
                                  "PPpp",
                                  { locale: fr }
                                )}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Modifié le:
                              </span>
                              <p>
                                {format(
                                  new Date(message.updated_at || ""),
                                  "PPpp",
                                  { locale: fr }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le message</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action ne
              pourra pas être annulée.
            </DialogDescription>
          </DialogHeader>
          {messageToDelete && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium">Aperçu du message :</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {messageToDelete.text}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDeleteMessage}
              disabled={isDeletingMessage}
            >
              {isDeletingMessage ? <IsLoading /> : "Supprimer le message"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeletingMessage}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
