import { useEffect, useRef, useState } from 'react';
import { useIsActivePage } from '../app/lib/step-context.tsx';
import type { LiveRoom } from './room.ts';

export type LiveQuestion = {
  id: number;
  text: string;
  name: string | null;
  votes: number;
  answered: boolean;
};

export type LiveDisplayState = {
  title: string;
  online: number;
  joined: number;
  settings: { qaOpen: boolean; feedbackOpen: boolean };
  rating: { avg: number | null; count: number; dist: number[] };
  reactions: Record<string, number>;
  questions: LiveQuestion[];
};

export type LiveStatus = 'connecting' | 'online' | 'offline' | 'closed';

type Listener = {
  onState: (state: LiveDisplayState) => void;
  onStatus: (status: LiveStatus, message?: string) => void;
  onReaction?: (emoji: string) => void;
};

type Channel = {
  listeners: Set<Listener>;
  ws: WebSocket | null;
  state: LiveDisplayState | null;
  status: LiveStatus;
  message?: string;
  retry: ReturnType<typeof setTimeout> | null;
  tries: number;
};

// One display socket per room, shared by every live block on the page.
const channels = new Map<string, Channel>();

function socketUrl(room: LiveRoom): string {
  return `${room.server.replace(/\/+$/, '').replace(/^http/, 'ws')}/ws/${room.roomId}?role=display`;
}

function open(key: string, room: LiveRoom, ch: Channel): void {
  const emit = (status: LiveStatus, message?: string) => {
    ch.status = status;
    ch.message = message;
    for (const l of ch.listeners) l.onStatus(status, message);
  };
  emit(ch.state ? 'offline' : 'connecting');
  let ws: WebSocket;
  try {
    ws = new WebSocket(socketUrl(room));
  } catch {
    emit('closed', '互動服務網址不正確。');
    return;
  }
  ch.ws = ws;
  ws.onopen = () => {
    ch.tries = 0;
    ws.send(JSON.stringify({ t: 'hello' }));
  };
  ws.onmessage = (e) => {
    const msg = JSON.parse(String(e.data)) as { t: string; emoji?: string; message?: string };
    if (msg.t === 'state') {
      ch.state = msg as unknown as LiveDisplayState;
      if (ch.status !== 'online') emit('online');
      for (const l of ch.listeners) l.onState(ch.state);
    } else if (msg.t === 'react' && msg.emoji) {
      for (const l of ch.listeners) l.onReaction?.(msg.emoji);
    } else if (msg.t === 'error') {
      emit('closed', msg.message);
    }
  };
  ws.onclose = (e) => {
    ch.ws = null;
    // 44xx are the room's own refusals (missing, disabled); retrying won't help.
    if (e.code >= 4400 || ch.listeners.size === 0) {
      if (e.code >= 4400) emit('closed', ch.message);
      return;
    }
    emit('offline');
    ch.retry = setTimeout(() => open(key, room, ch), Math.min(15_000, 1000 * 2 ** ch.tries++));
  };
}

function subscribe(room: LiveRoom, listener: Listener): () => void {
  const key = `${room.server}|${room.roomId}`;
  let ch = channels.get(key);
  if (!ch) {
    ch = {
      listeners: new Set(),
      ws: null,
      state: null,
      status: 'connecting',
      retry: null,
      tries: 0,
    };
    channels.set(key, ch);
  }
  ch.listeners.add(listener);
  if (ch.state) listener.onState(ch.state);
  listener.onStatus(ch.status, ch.message);
  if (!ch.ws && !ch.retry && ch.status !== 'closed') open(key, room, ch);
  const channel = ch;
  return () => {
    channel.listeners.delete(listener);
    if (channel.listeners.size > 0) return;
    if (channel.retry) clearTimeout(channel.retry);
    channel.ws?.close();
    channels.delete(key);
  };
}

/**
 * Live state for the slide on screen. Only the page the audience is watching
 * connects; thumbnails, the overview grid and exports render the static
 * fallback instead of opening a socket each.
 */
export function useLiveDisplay(
  room: LiveRoom | null,
  onReaction?: (emoji: string) => void,
): { state: LiveDisplayState | null; status: LiveStatus; message?: string } {
  const active = useIsActivePage();
  const [state, setState] = useState<LiveDisplayState | null>(null);
  const [status, setStatus] = useState<{ status: LiveStatus; message?: string }>({
    status: 'connecting',
  });
  const onReactionRef = useRef(onReaction);
  onReactionRef.current = onReaction;
  const server = room?.server;
  const roomId = room?.roomId;

  useEffect(() => {
    if (!server || !roomId || !active) return;
    return subscribe(
      { server, roomId },
      {
        onState: setState,
        onStatus: (s, message) => setStatus({ status: s, message }),
        onReaction: (emoji) => onReactionRef.current?.(emoji),
      },
    );
  }, [server, roomId, active]);

  return { state, ...status };
}
