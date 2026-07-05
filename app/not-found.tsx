import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

export default function NotFound() {
  return (
    <Container className="flex h-screen items-center justify-center">
      <Stack gap={6} align="center" className="text-center">
        <Heading level={1} className="text-6xl md:text-8xl">
          404
        </Heading>
        <Text className="text-muted max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </Text>
        <Link
          href="/"
          className="group inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          Return Home
        </Link>
      </Stack>
    </Container>
  );
}
