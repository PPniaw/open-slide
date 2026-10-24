import { useCallback, useEffect, useState } from 'react';
import { LIVE_CHANGED_EVENT } from '../live/room';

export type PublishedDeck = { url: string; publishedAt: string; live: boolean };

/** Fired on window whenever a deck is published or unpublished from the workspace. */
export const PUBLISHED_CHANGED_EVENT = 'open-slide:published-changed';

/** Sidebar view that lists the decks currently online. */
export const PUBLISHED_ID = '__published__';

/** Decks that are online right now, keyed by deck id. Empty outside the dev workspace. */
export function usePublishedDecks(): Record<string, PublishedDeck> {
  const [decks, setDecks] = useState<Record<string, PublishedDeck>>({});
  const load = useCallback(() => {
    if (!import.meta.env.DEV) return;
    fetch('/__publish/list')
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { decks?: Record<string, PublishedDeck> } | null) => {
        if (body?.decks) setDecks(body.decks);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    window.addEventListener(PUBLISHED_CHANGED_EVENT, load);
    return () => window.removeEventListener(PUBLISHED_CHANGED_EVENT, load);
  }, [load]);

  return decks;
}

export async function unpublishDeck(slideId: string): Promise<void> {
  const res = await fetch('/__publish/unpublish', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slideId }),
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  window.dispatchEvent(new Event(PUBLISHED_CHANGED_EVENT));
  window.dispatchEvent(new Event(LIVE_CHANGED_EVENT));
}
