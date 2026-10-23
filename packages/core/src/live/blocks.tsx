import { type CSSProperties, useCallback, useRef, useState } from 'react';
import { isLiveDev, joinUrl, qrUrl, useLiveRoom } from './room.ts';
import { type LiveStatus, useLiveDisplay } from './socket.ts';

// Sized for the 1920×1080 canvas. Colours follow the deck's design tokens so
// the blocks sit inside any theme.
const ACCENT = 'var(--osd-accent, #2f6f4f)';
const FONT = 'var(--osd-font-body, inherit)';

type BlockProps = { className?: string; style?: CSSProperties };

function statusText(status: LiveStatus, message?: string): string | null {
  if (status === 'connecting') return '連線中…';
  if (status === 'offline') return '重新連線中…';
  if (status === 'closed') return message ?? '互動已關閉';
  return null;
}

// A published deck without a room was built without `--live-room`.
function Placeholder({ text, style }: { text: string; style?: CSSProperties }) {
  if (!isLiveDev()) text = '互動尚未開啟';
  return (
    <div
      data-live="placeholder"
      style={{
        display: 'grid',
        placeItems: 'center',
        padding: 32,
        border: '3px dashed currentColor',
        borderRadius: 24,
        opacity: 0.45,
        fontSize: 30,
        fontFamily: FONT,
        textAlign: 'center',
        ...style,
      }}
    >
      {text}
    </div>
  );
}

export type LiveJoinProps = BlockProps & {
  /** Line above the address. */
  label?: string;
  /** QR code edge in canvas pixels. */
  size?: number;
  /** Show how many phones are connected right now. */
  showCount?: boolean;
};

/** QR code + short address the audience scans to join the live room. */
export function LiveJoin({
  label = '掃描 QR code，一起互動',
  size = 320,
  showCount = true,
  className,
  style,
}: LiveJoinProps) {
  const room = useLiveRoom();
  const { state, status, message } = useLiveDisplay(room);
  if (!room) {
    return (
      <Placeholder
        text="發布後，這裡會出現加入用的 QR code"
        style={{ width: size * 2.4, height: size, ...style }}
      />
    );
  }
  const url = joinUrl(room);
  const pending = statusText(status, message);
  return (
    <div
      data-live="join"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.14,
        fontFamily: FONT,
        ...style,
      }}
    >
      <img
        src={qrUrl(room)}
        alt={`QR code：${url}`}
        width={size}
        height={size}
        style={{ background: '#fff', padding: size * 0.04, borderRadius: 24, flex: 'none' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.25 }}>{label}</div>
        <div style={{ fontSize: 32, fontFamily: 'ui-monospace, monospace', opacity: 0.75 }}>
          {url.replace(/^https?:\/\//, '')}
        </div>
        {showCount && (
          <div data-live-count style={{ fontSize: 30, color: ACCENT, fontWeight: 600 }}>
            {pending ?? `${state?.online ?? 0} 人在線`}
          </div>
        )}
      </div>
    </div>
  );
}

export type LiveQAProps = BlockProps & {
  title?: string;
  /** How many questions fit on the slide. */
  limit?: number;
};

/**
 * Questions the presenter put on screen, most-voted first. Phones see every
 * question; the slide only shows the ones picked in the admin page.
 */
export function LiveQA({ title = '現場提問', limit = 4, className, style }: LiveQAProps) {
  const room = useLiveRoom();
  const { state, status, message } = useLiveDisplay(room);
  if (!room) {
    return (
      <Placeholder text="發布後，講者挑選的問題會出現在這裡" style={{ minHeight: 360, ...style }} />
    );
  }
  const questions = state?.questions.slice(0, limit) ?? [];
  const pending = statusText(status, message);
  return (
    <div
      data-live="qa"
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: FONT, ...style }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <div style={{ fontSize: 48, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.6 }}>
          {pending ?? (state?.settings.qaOpen === false ? '發問已暫停' : '掃 QR code 發問、按讚')}
        </div>
      </div>
      {questions.length === 0 ? (
        <div style={{ fontSize: 32, opacity: 0.5, padding: '24px 0' }}>還沒有問題上螢幕。</div>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            data-live-question
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              padding: '22px 28px',
              borderRadius: 20,
              background: 'color-mix(in oklab, currentColor 7%, transparent)',
              opacity: q.answered ? 0.5 : 1,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 36, lineHeight: 1.35 }}>{q.text}</div>
              <div style={{ fontSize: 24, opacity: 0.6, marginTop: 6 }}>
                {q.name || '匿名'}
                {q.answered ? '・已回答' : ''}
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: ACCENT, flex: 'none' }}>
              👍 {q.votes}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export type LiveFeedbackProps = BlockProps & {
  title?: string;
  /** Which parts to show. */
  show?: ('rating' | 'reactions')[];
};

type Burst = { id: number; emoji: string; left: number };

const BURST_CSS = `@keyframes osd-live-float { from { transform: translateY(0) scale(.8); opacity: 0 }
  15% { opacity: 1 } to { transform: translateY(-360px) scale(1.25); opacity: 0 } }
@media (prefers-reduced-motion: reduce) { [data-live-burst] { display: none } }`;

/** Average rating and emoji reactions, with reactions floating up as they arrive. */
export function LiveFeedback({
  title = '即時反饋',
  show = ['rating', 'reactions'],
  className,
  style,
}: LiveFeedbackProps) {
  const room = useLiveRoom();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);
  const onReaction = useCallback((emoji: string) => {
    const id = nextId.current++;
    setBursts((b) => [...b.slice(-20), { id, emoji, left: 10 + Math.random() * 80 }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 2000);
  }, []);
  const { state, status, message } = useLiveDisplay(room, onReaction);
  if (!room) {
    return (
      <Placeholder text="發布後，這裡會顯示評分和表情反饋" style={{ minHeight: 320, ...style }} />
    );
  }
  const rating = state?.rating;
  const pending = statusText(status, message);
  return (
    <div
      data-live="feedback"
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        fontFamily: FONT,
        ...style,
      }}
    >
      <style>{BURST_CSS}</style>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <div style={{ fontSize: 48, fontWeight: 700 }}>{title}</div>
        {pending && <div style={{ fontSize: 28, opacity: 0.6 }}>{pending}</div>}
      </div>
      {show.includes('rating') && (
        <div data-live-rating style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <span style={{ fontSize: 120, fontWeight: 800, color: ACCENT, lineHeight: 1 }}>
            {rating?.avg ?? '–'}
          </span>
          <span style={{ fontSize: 40, opacity: 0.6 }}>/ 5</span>
          <span style={{ fontSize: 30, opacity: 0.6 }}>
            {rating ? `${rating.count} 人評分` : ''}
          </span>
        </div>
      )}
      {show.includes('reactions') && (
        <div style={{ display: 'flex', gap: 36 }}>
          {Object.entries(state?.reactions ?? {}).map(([emoji, n]) => (
            <div
              key={emoji}
              style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 52 }}
            >
              {emoji}
              <span style={{ fontSize: 34, fontWeight: 700 }}>{n}</span>
            </div>
          ))}
        </div>
      )}
      {bursts.map((b) => (
        <span
          key={b.id}
          data-live-burst
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${b.left}%`,
            fontSize: 72,
            pointerEvents: 'none',
            animation: 'osd-live-float 2s ease-out forwards',
          }}
        >
          {b.emoji}
        </span>
      ))}
    </div>
  );
}
