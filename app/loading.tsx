import React from "react";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";

export default function Loading() {
  return (
    <Container className="flex h-screen items-center justify-center">
      <Stack gap={4} align="center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-primary/20 border border-primary/40" />
        <span className="font-display text-sm uppercase tracking-widest text-muted">
          Loading
        </span>
      </Stack>
    </Container>
  );
}
