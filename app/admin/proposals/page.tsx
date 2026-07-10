import React from "react";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ConversionRepository } from "@/services/repositories/ConversionRepository";
import { FileSpreadsheet } from "lucide-react";
import { ProposalsClient } from "./ProposalsClient";

export const dynamic = "force-dynamic";

export default async function ProposalsAdminPage() {
  const proposals = await ConversionRepository.getProposalRequests();

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-border/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
            [ Sales Control ]
          </span>
          <Heading level={1} className="text-3xl font-black mt-2 tracking-tightest uppercase font-mono flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-primary" /> RFP Proposal desk
          </Heading>
          <Text className="text-muted/60 text-xs">
            Review client scope documents, budget allocations, target durations, and update proposal review status.
          </Text>
        </div>
      </div>

      {/* Proposals Client table */}
      <ProposalsClient initialProposals={proposals} />
    </div>
  );
}
