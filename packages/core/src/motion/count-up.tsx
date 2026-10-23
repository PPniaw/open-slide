import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { type CSSProperties, useEffect, useRef } from 'react';
import { useReveal } from './use-reveal.ts';

export type CountUpProps = {
  to: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  /** Insert thousands separators (1,234). */
  grouping?: boolean;
  trigger?: string;
  style?: CSSProperties;
  className?: string;
};

export function CountUp({
  to,
  from = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  grouping = false,
  trigger,
  style,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { shown, instant } = useReveal(ref, trigger);
  const value = useMotionValue(instant ? to : from);
  const text = useTransform(value, (v) => {
    const n = grouping
      ? v.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : v.toFixed(decimals);
    return `${prefix}${n}${suffix}`;
  });

  useEffect(() => {
    if (instant) {
      value.set(to);
      return;
    }
    if (!shown) {
      value.set(from);
      return;
    }
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [instant, shown, from, to, duration, value]);

  return (
    <motion.span
      ref={ref}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
      className={className}
    >
      {text}
    </motion.span>
  );
}
