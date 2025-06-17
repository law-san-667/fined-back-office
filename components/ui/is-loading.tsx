import { Loader2 } from "lucide-react";
import { FC } from "react";
import { cn } from "@/lib/utils";

type IsLoadingProps = {
  className?: string;
};

const IsLoading: FC<IsLoadingProps> = ({ className }) => {
  return (
    <Loader2 className={cn("text-text h-4 w-4 animate-spin", className)} />
  );
};

export default IsLoading;
