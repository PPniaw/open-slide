import { useCallback, useEffect, useRef, useState } from 'react';
import { hasModifier, isTypingTarget } from '@/lib/keys';
import { joinUrl, qrUrl, useLiveRoom } from '@/lib/live/room';
import { useLiveDisplay } from '@/lib/live/socket';
import { useIsMobile } from '@/lib/use-is-mobile';

type Burst = { id: number; emoji: string; left: number };

const BURST_CSS = `@keyframes osd-live-rise { from { transform: translateY(0) scale(.8); opacity: 0 }
  15% { opacity: 1 } to { transform: translateY(-38vh) scale(1.2); opacity: 0 } }
@media (prefers-reduced-motion: reduce) { [data-live-burst] { display: none } }`;

/**
 * What a deck published with live interaction shows while playing: a QR code
 * in the corner (Q hides it), the question the presenter put on screen as a
 * caption, and reactions rising as they arrive. Nothing renders without a room.
 */
export function LiveOverlay({ slideId }: { slideId?: string }) {
  const room = useLiveRoom(slideId);
  const isMobile = useIsMobile();
  const [qrVisible, setQrVisible] = useState(true);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);
  const onReaction = useCallback((emoji: string) => {
    const id = nextId.current++;
    setBursts((b) => [...b.slice(-24), { id, emoji, left: Math.random() * 70 }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 2400);
  }, []);
  const { state } = useLiveDisplay(room, onReaction, { always: true });

  useEffect(() => {
    if (!room) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || hasModifier(e) || e.isComposing) return;
      if (e.key === 'q' || e.key === 'Q') setQrVisible((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [room]);

  if (!room) return null;
  const url = joinUrl(room);
  const spotlight = state?.spotlight ?? null;

  return (
    <div data-live-overlay className="pointer-events-none absolute inset-0 z-30">
      <style>{BURST_CSS}</style>

      {/* Phones are the audience's own screens; they don't need a code to scan. */}
      {qrVisible && !isMobile && (
        <div
          data-live-qr
          className="group pointer-events-auto absolute right-5 bottom-5 origin-bottom-right transition-transform duration-200 hover:scale-[2.2] motion-reduce:transition-none"
          // Clicks here are not page turns.
          data-osd-interactive
        >
          <div className="flex flex-col items-center gap-1 rounded-[14px] border border-black/5 bg-white p-2 shadow-[0_12px_32px_-8px_oklch(0_0_0/0.45)]">
            <img
              src={qrUrl(room)}
              alt={`QR code：${url}`}
              width={112}
              height={112}
              className="size-[112px]"
            />
            <span className="font-medium text-[11px] text-black/75">掃碼發問・回饋</span>
            <span className="font-mono text-[9px] text-black/45">
              {url.replace(/^https?:\/\//, '')}
            </span>
          </div>
        </div>
      )}

      {spotlight && (
        <div className="absolute inset-x-0 bottom-[9%] flex justify-center px-[12%]">
          <div
            data-live-spotlight
            className="max-w-full rounded-[14px] border-[var(--brand,#e5484d)] border-l-4 bg-zinc-950/85 px-[2.2vw] py-[1.3vw] text-zinc-50 shadow-[0_18px_48px_-12px_oklch(0_0_0/0.55)] backdrop-blur"
          >
            <div className="flex items-center gap-[0.6vw] text-[clamp(11px,0.9vw,17px)] text-zinc-400 tabular-nums">
              <span>觀眾提問</span>
              <span aria-hidden>·</span>
              <span>{spotlight.name || '匿名'}</span>
              <span aria-hidden>·</span>
              <span>▲ {spotlight.votes}</span>
            </div>
            <div className="mt-[0.4vw] text-pretty text-[clamp(16px,2vw,40px)] leading-snug">
              {spotlight.text}
            </div>
          </div>
        </div>
      )}

      <div className="absolute right-6 bottom-[170px] h-0 w-[120px]">
        {bursts.map((b) => (
          <span
            key={b.id}
            data-live-burst
            aria-hidden
            className="absolute bottom-0 text-[clamp(24px,2.6vw,52px)]"
            style={{ left: `${b.left}%`, animation: 'osd-live-rise 2.4s ease-out forwards' }}
          >
            {b.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
