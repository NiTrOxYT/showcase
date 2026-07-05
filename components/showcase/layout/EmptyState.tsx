import React from "react";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 md:p-24 rounded-2xl border border-dashed border-border/60 bg-surface/5 max-w-lg mx-auto my-12">
      <span className="font-mono text-xs text-primary uppercase tracking-widest mb-4">[ Empty State ]</span>
      <Heading level={3} className="text-2xl font-bold tracking-tightest mb-2">
        {title}
      </Heading>
      <Text className="text-muted/80 text-sm mb-6 leading-relaxed">
        {message}
      </Text>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="font-mono text-xs uppercase tracking-widest px-6 py-2.5 rounded-full border border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
