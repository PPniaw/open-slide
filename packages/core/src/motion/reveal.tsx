import { motion } from 'motion/react';
import { type CSSProperties, type PropsWithChildren, useRef } from 'react';
import { REVEAL_EFFECTS, type RevealEffect, SPRING } from './effects.ts';
import { useReveal } from './use-reveal.ts';

export type RevealProps = PropsWithChildren<{
  effect?: RevealEffect;
  /** Seconds to wait after the reveal before animating. */
  delay?: number;
  /** Follow the `<Step>` that contains `[data-reveal={trigger}]` instead of the nearest one. */
  trigger?: string;
  style?: CSSProperties;
  className?: string;
}>;

export function Reveal({
  effect = 'rise',
  delay = 0,
  trigger,
  style,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { shown, instant } = useReveal(ref, trigger);
  return (
    <motion.div
      ref={ref}
      initial={instant ? false : 'hidden'}
      animate={shown ? 'shown' : 'hidden'}
      variants={REVEAL_EFFECTS[effect]}
      transition={{ ...SPRING, delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
