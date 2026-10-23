import { motion, type Variants } from 'motion/react';
import {
  Children,
  type CSSProperties,
  isValidElement,
  type PropsWithChildren,
  useRef,
} from 'react';
import { REVEAL_EFFECTS, type RevealEffect, SPRING } from './effects.ts';
import { useReveal } from './use-reveal.ts';

export type StaggerProps = PropsWithChildren<{
  effect?: RevealEffect;
  /** Seconds between one child and the next. */
  interval?: number;
  delay?: number;
  trigger?: string;
  style?: CSSProperties;
  className?: string;
  itemStyle?: CSSProperties;
}>;

export function Stagger({
  effect = 'rise',
  interval = 0.11,
  delay = 0.05,
  trigger,
  style,
  className,
  itemStyle,
  children,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { shown, instant } = useReveal(ref, trigger);
  const container: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: interval, delayChildren: delay } },
  };
  const item = REVEAL_EFFECTS[effect];
  return (
    <motion.div
      ref={ref}
      initial={instant ? false : 'hidden'}
      animate={shown ? 'shown' : 'hidden'}
      variants={container}
      style={style}
      className={className}
    >
      {Children.toArray(children).map((child) => (
        <motion.div
          key={isValidElement(child) ? child.key : String(child)}
          variants={item}
          transition={SPRING}
          style={itemStyle}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
