import { useCallback, useEffect, useRef, useState } from 'react';
import type { LiveRoom } from './room.ts';
import type { LiveDisplayState, LiveQuestion, LiveStatus } from './socket.ts';

export type LiveAdminQuestion = LiveQuestion & {
  approved: boolean;
  hidden: boolean;
  createdAt: number;
};

export type LiveSettings = {
  qaOpen: boolean;
  feedbackOpen: boolean;
  anonymity: 'anonymous' | 'optional' | 'required';
  moderation: 'post' | 'pre';
};

export type LiveAdminState = Omit<LiveDisplayState, 'questions' | 'settings'> & {
  cap: number;
  settings: LiveSettings;
  questions: LiveAdminQuestion[];
  comments: { id: number; text: string; createdAt: number }[];
};

export type LiveAdminAccess = LiveRoom & { adminKey: string };

export type LiveAdminCommand =
  | { t: 'question'; id: number; approved?: boolean; answered?: boolean; hidden?: boolean }
  | { t: 'spotlight'; id: number | null }
  | { t: 'settings'; patch: Partial<LiveSettings> }
  | { t: 'reset-reactions' };

/**
 * The presenter's side of a live room. The admin key never leaves this
 * machine: the workspace reads it from the publish routes and proves it to
 * the room over the socket.
 */
export function useLiveAdmin(access: LiveAdminAccess | null): {
  state: LiveAdminState | null;
  status: LiveStatus;
  message?: string;
  send: (cmd: LiveAdminCommand) => void;
} {
  const [state, setState] = useState<LiveAdminState | null>(null);
  const [status, setStatus] = useState<{ status: LiveStatus; message?: string }>({
    status: 'connecting',
  });
  const wsRef = useRef<WebSocket | null>(null);
  const server = access?.server;
  const roomId = access?.roomId;
  const adminKey = access?.adminKey;

  useEffect(() => {
    if (!server || !roomId || !adminKey) return;
    let stopped = false;
    let tries = 0;
    let retry: ReturnType<typeof setTimeout> | null = null;
    const url = `${server.replace(/\/+$/, '').replace(/^http/, 'ws')}/ws/${roomId}?role=admin`;
    const open = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => {
        tries = 0;
        ws.send(JSON.stringify({ t: 'hello', key: adminKey }));
      };
      ws.onmessage = (e) => {
        const msg = JSON.parse(String(e.data)) as { t: string; message?: string };
        if (msg.t === 'state') {
          setState(msg as unknown as LiveAdminState);
          setStatus({ status: 'online' });
        } else if (msg.t === 'error') {
          setStatus({ status: 'closed', message: msg.message });
        }
      };
      ws.onclose = (e) => {
        if (wsRef.current === ws) wsRef.current = null;
        if (stopped) return;
        if (e.code >= 4400) {
          setStatus((s) => (s.status === 'closed' ? s : { status: 'closed' }));
          return;
        }
        setStatus({ status: 'offline' });
        retry = setTimeout(open, Math.min(15_000, 1000 * 2 ** tries++));
      };
    };
    open();
    return () => {
      stopped = true;
      if (retry) clearTimeout(retry);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [server, roomId, adminKey]);

  const send = useCallback((cmd: LiveAdminCommand) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(cmd));
  }, []);

  return { state, ...status, send };
}

/** Download the room's questions, comments and ratings as CSV. */
export async function exportLiveCsv(access: LiveAdminAccess): Promise<Blob> {
  const res = await fetch(
    `${access.server.replace(/\/+$/, '')}/api/rooms/${access.roomId}/export.csv`,
    { headers: { authorization: `Bearer ${access.adminKey}` } },
  );
  if (!res.ok) throw new Error(`export failed (${res.status})`);
  return res.blob();
}
