"use client";

import { trpc } from "@/server/trpc/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MessageSquare, Tag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { ForumPostAnswerThread } from "./forum-post-answer-thread";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import IsLoading from "./ui/is-loading";

type ForumPostViewProps = {
  answers: any[];
  post: any;
};

const ForumPostView: React.FC<ForumPostViewProps> = ({ post, answers }) => {
  const router = useRouter();

  const topLevelAnswers = answers.filter(
    (answer) => !answer.reply_to_id
  ).length;
  const replies = (post.answer_count || 0) - topLevelAnswers;

  const utils = trpc.useUtils();

  const { mutate: deletePost, isPending: isDeleting } =
    trpc.forumPosts.deletePost.useMutation({
      onSuccess: () => {
        toast.success("La question a été supprimée avec succès");
        utils.forumPosts.getPosts.invalidate();
        router.push("/dashboard/forum/posts");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="space-y-6">
      <div className="w-full flex items-center justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={isDeleting} variant={"destructive"}>
              Supprimer la question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer la question</DialogTitle>
              <DialogDescription>
                Vous êtes sur le point de supprimer la question{" "}
                <span className="text-primary">"{post.title}". </span>
                Cette action sera appliquée à tout le système.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={isDeleting}
                  variant={"destructive"}
                  onClick={async () => {
                    deletePost({ id: post.id });
                  }}
                >
                  {isDeleting ? <IsLoading /> : "Supprimer"}
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button disabled={isDeleting} variant={"outline"}>
                  Annuler
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* Forum Post Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl leading-tight">
                {post.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.users?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(post.created_at || "", "MMM d, yyyy 'à' h:mm", {
                      locale: fr,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.answer_count} réponses</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {post.description}
              </p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: any) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Réponse(s) ({post.answer_count})
          </CardTitle>
          {(post.answer_count || 0) > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{topLevelAnswers} réponses directes</span>
              {replies > 0 && <span>{replies} threads</span>}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {answers.length > 0 ? (
            <ForumPostAnswerThread answers={answers} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucune réponse</h3>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumPostView;
