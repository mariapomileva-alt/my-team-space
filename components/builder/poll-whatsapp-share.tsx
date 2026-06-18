"use client";

import { WhatsAppShareButton } from "@/components/shared/whatsapp-share-button";
import { buildPollShareMessage } from "@/lib/whatsapp-summaries";
import { useCallback, useState } from "react";

type VoteRow = { voter_name: string; choice: string; created_at: string };

export function PollWhatsAppShare({
  teamId,
  teamSlug,
  teamName,
  blockId,
  question,
  optionYes,
  optionNo,
}: {
  teamId: string;
  teamSlug: string;
  teamName: string;
  blockId: string;
  question: string;
  optionYes: string;
  optionNo: string;
}) {
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const sharePoll = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setHint(null);
    try {
      const res = await fetch(`/api/admin/teams/${teamId}/poll-votes?blockId=${encodeURIComponent(blockId)}`);
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as { votes?: VoteRow[] };
      const publicUrl =
        typeof window !== "undefined" ? `${window.location.origin}/${teamSlug}` : undefined;
      const message = buildPollShareMessage({
        teamName,
        publicUrl,
        question,
        optionYes,
        optionNo,
        votes: data.votes ?? [],
      });
      if (!message) setHint("No votes yet — share after parents answer.");
      return message;
    } catch {
      setHint("Could not load votes. Try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [blockId, optionNo, optionYes, question, teamId, teamName, teamSlug]);

  return (
    <WhatsAppShareButton
      className="mt-3"
      onShare={sharePoll}
      label="Share poll in WhatsApp"
      loading={loading}
      disabledReason={hint ?? undefined}
      size="compact"
    />
  );
}
