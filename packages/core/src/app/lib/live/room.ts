import { useEffect, useState } from 'react';
import { LIVE_GLOBAL_KEY } from './config.ts';

export type LiveRoom = { server: string; roomId: string };

type LiveGlobal = { dev: boolean; server?: string; rooms?: Record<string, string> };

export { LIVE_GLOBAL_KEY };

/** Fired on window after the publish dialog turns a deck's live room on or off. */
export const LIVE_CHANGED_EVENT = 'open-slide:live-changed';

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
 * The live room of a deck (the one being viewed unless `slideId` is given).
 * Published builds carry it in the config; the dev workspace asks the publish
 * routes, which answer only while the deck is published with live
 * interaction on. `null` means no room.
 */
export function useLiveRoom(slideId?: string): LiveRoom | null {
  const id = slideId ?? currentSlideId();
  const [room, setRoom] = useState<LiveRoom | null>(() => {
    const g = liveGlobal();
    const roomId = id ? g?.rooms?.[id] : undefined;
    return g && !g.dev && g.server && roomId ? { server: g.server, roomId } : null;
  });

  useEffect(() => {
    if (!liveGlobal()?.dev || !id) return;
    let cancelled = false;
    const load = () =>
      fetch(`/__publish/live?slideId=${encodeURIComponent(id)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((body: { server?: string; roomId?: string } | null) => {
          if (cancelled) return;
          const server = body?.server;
          const roomId = body?.roomId;
          setRoom((prev) => {
            if (!server || !roomId) return null;
            return prev?.server === server && prev.roomId === roomId ? prev : { server, roomId };
          });
        })
        .catch(() => {});
    void load();
    window.addEventListener(LIVE_CHANGED_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(LIVE_CHANGED_EVENT, load);
    };
  }, [id]);

  return room;
}

export function joinUrl(room: LiveRoom): string {
  return `${room.server.replace(/\/+$/, '')}/j/${room.roomId}`;
}

export function qrUrl(room: LiveRoom): string {
  return `${room.server.replace(/\/+$/, '')}/qr/${room.roomId}.svg`;
}
