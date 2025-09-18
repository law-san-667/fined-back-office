"use client";

import { format, formatDistanceToNow } from "date-fns";
import { LucideChevronsUpDown, Reply, Trash2, User } from "lucide-react";
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
import { trpc } from "@/server/trpc/client";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface ForumPostAnswerThreadProps {
  answers: any[];
}

type Answer = any;

export function ForumPostAnswerThread({ answers }: ForumPostAnswerThreadProps) {
  const [answerToDelete, setAnswerToDelete] = useState<Answer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(
    new Set()
  );

  const utils = trpc.useUtils();

  const { mutate: deletePostAnswer, isPending: isDeletingAnswer } =
    trpc.forumPosts.deletePostAnswer.useMutation({
      onSuccess: () => {
        utils.forumPosts.getPost.invalidate({
          id: answerToDelete?.question_id || undefined,
        });
        setIsDeleteDialogOpen(false);
        setAnswerToDelete(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDeleteAnswer = () => {
    if (answerToDelete) {
      deletePostAnswer({ id: answerToDelete.id });
    }
  };

  const confirmDelete = (answer: Answer) => {
    setAnswerToDelete(answer);
    setIsDeleteDialogOpen(true);
  };

  const toggleAnswerExpansion = (answerId: string) => {
    const newExpanded = new Set(expandedAnswers);
    if (newExpanded.has(answerId)) {
      newExpanded.delete(answerId);
    } else {
      newExpanded.add(answerId);
    }
    setExpandedAnswers(newExpanded);
  };

  // Build the threaded structure
  const buildThreadedAnswers = (
    answers: Answer[]
  ): (Answer & { replies: Answer[] })[] => {
    const answerMap = new Map<string, Answer & { replies: Answer[] }>();
    const topLevel: (Answer & { replies: Answer[] })[] = [];

    // First pass: create all answer objects with empty replies
    answers.forEach((answer) => {
      answerMap.set(answer.id, { ...answer, replies: [] });
    });

    // Second pass: build the hierarchy
    answers.forEach((answer) => {
      const answerWithReplies = answerMap.get(answer.id)!;

      if (answer.reply_to_id) {
        const parent = answerMap.get(answer.reply_to_id);
        if (parent) {
          parent.replies.push(answerWithReplies);
        }
      } else {
        topLevel.push(answerWithReplies);
      }
    });

    return topLevel;
  };

  const renderAnswer = (answer: Answer & { replies: Answer[] }, depth = 0) => {
    const isExpanded = expandedAnswers.has(answer.id);
    const maxDepth = 5; // Limit nesting depth for readability

    return (
      <div
        key={answer.id}
        className={`${depth > 0 ? "ml-6 border-l-2 border-muted pl-4" : ""}`}
      >
        <Card className={`mb-4 ${depth > 0 ? "bg-muted/30" : ""}`}>
          <CardContent className="p-4">
            {/* Answer header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 py-2">
                    <Badge>{answer.users?.name}</Badge>
                    {depth > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Reply className="h-3 w-3" />
                        <span>Réponse</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      answer.created_at || "",
                      "MMM d, yyyy 'at' h:mm a",
                      {
                        locale: fr,
                      }
                    )}
                    <span className="ml-2">
                      (
                      {formatDistanceToNow(answer.created_at || "", {
                        addSuffix: true,
                        locale: fr,
                      })}
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
                  onClick={() => toggleAnswerExpansion(answer.id)}
                  disabled={isDeletingAnswer}
                >
                  <LucideChevronsUpDown />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  className="size-7"
                  onClick={() => confirmDelete(answer)}
                  disabled={isDeletingAnswer}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            {/* Answer content */}
            <div className="mt-3">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {answer.text}
                </pre>
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-4 space-y-3 border-t pt-4">
                <div className="grid gap-3 text-xs md:grid-cols-2">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Answer ID:
                    </span>
                    <p className="font-mono">{answer.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Post ID:
                    </span>
                    <p className="font-mono">{answer.question_id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Created:
                    </span>
                    <p>
                      {format(answer.created_at || "", "PPpp", { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Updated:
                    </span>
                    <p>
                      {format(answer.updated_at || "", "PPpp", { locale: fr })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reply count indicator */}
            {answer.replies.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Reply className="h-3 w-3" />
                <span>
                  {answer.replies.length}{" "}
                  {answer.replies.length === 1 ? "reply" : "replies"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Render replies */}
        {answer.replies.length > 0 && depth < maxDepth && (
          <div className="space-y-2">
            {answer.replies
              .sort(
                (a: any, b: any) =>
                  new Date(a.created_at || "").getTime() -
                  new Date(b.created_at || "").getTime()
              )
              .map((reply: any) =>
                renderAnswer(
                  {
                    ...reply,
                    replies: [],
                  },
                  depth + 1
                )
              )}
          </div>
        )}

        {/* Show collapsed indicator if max depth reached */}
        {answer.replies.length > 0 && depth >= maxDepth && (
          <div className="ml-6 mb-4">
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground">
                  {answer.replies.length} more{" "}
                  {answer.replies.length === 1 ? "reply" : "replies"} (max
                  nesting reached)
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const threadedAnswers = buildThreadedAnswers(answers);

  return (
    <div className="space-y-4">
      {threadedAnswers
        .sort(
          (a: any, b: any) =>
            new Date(a.created_at || "").getTime() -
            new Date(b.created_at || "").getTime()
        )
        .map((answer) => renderAnswer(answer))}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Answer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this answer? This action cannot be
              undone and will also remove all replies to this answer.
            </DialogDescription>
          </DialogHeader>
          {answerToDelete && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium">Answer preview:</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                {answerToDelete.text}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAnswer}>
              Delete Answer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
