import { useEffect, useState } from 'react';
import { LIVE_GLOBAL_KEY } from '../app/lib/live-config.ts';

export type LiveRoom = { server: string; roomId: string };

type LiveGlobal = { dev: boolean; server?: string; rooms?: Record<string, string> };

export { LIVE_GLOBAL_KEY };

function liveGlobal(): LiveGlobal | null {
  return (
    ((globalThis as Record<string, unknown>)[LIVE_GLOBAL_KEY] as LiveGlobal | undefined) ?? null
  );
}

/** True inside the dev workspace, where an unpublished deck has no room yet. */
export function isLiveDev(): boolean {
  return liveGlobal()?.dev ?? false;
}

function currentSlideId(): string | null {
  if (typeof location === 'undefined') return null;
  return location.pathname.match(/\/s\/([^/?#]+)/)?.[1] ?? null;
}

/**
 * The live room for the deck being viewed. Published builds carry it in the
 * config; the dev workspace asks the publish routes, so a deck that has been
 * published shows its real room while editing. `null` means no room yet.
 */
export function useLiveRoom(): LiveRoom | null {
  const [room, setRoom] = useState<LiveRoom | null>(() => {
    const g = liveGlobal();
    const slideId = currentSlideId();
    const roomId = slideId ? g?.rooms?.[slideId] : undefined;
    return g && !g.dev && g.server && roomId ? { server: g.server, roomId } : null;
  });

  useEffect(() => {
    const g = liveGlobal();
    const slideId = currentSlideId();
    if (!g?.dev || !slideId) return;
    let cancelled = false;
    fetch(`/__publish/live?slideId=${encodeURIComponent(slideId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { server?: string; roomId?: string } | null) => {
        if (!cancelled && body?.server && body.roomId) {
          setRoom({ server: body.server, roomId: body.roomId });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return room;
}

export function joinUrl(room: LiveRoom): string {
  return `${room.server.replace(/\/+$/, '')}/j/${room.roomId}`;
}

export function qrUrl(room: LiveRoom): string {
  return `${room.server.replace(/\/+$/, '')}/qr/${room.roomId}.svg`;
}
