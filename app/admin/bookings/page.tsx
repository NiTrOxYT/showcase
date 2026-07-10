import React from "react";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { Calendar } from "lucide-react";
import { BookingsClient } from "./BookingsClient";

export const dynamic = "force-dynamic";

export default async function BookingsAdminPage() {
  const bookings = await ConversionRepository.getBookings();

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Sales Control ]
          </span>
          <Heading level={1} className="text-3xl font-black mt-2 tracking-tightest uppercase font-mono flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" /> Consultation Calendar
          </Heading>
          <Text className="text-muted/60 text-xs">
            Manage upcoming discovery calls, strategic workshops, and update booking pipeline stages.
          </Text>
        </div>
      </div>

      {/* Bookings List Client */}
      <BookingsClient initialBookings={bookings} />
    </div>
  );
}
