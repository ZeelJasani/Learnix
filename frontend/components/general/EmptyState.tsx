import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  href?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  href = "/",
}) => {
  return (
    <div className="flex w-full min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in">
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mb-6 mt-2 max-w-prose text-center text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {buttonText ? (
        <Link href={href} className={buttonVariants()}>
          <PlusCircle className="mr-2 size-4" />
          {buttonText}
        </Link>
      ) : null}
    </div>
  );
};




