import { motion } from 'motion/react';
import { type CSSProperties, type ReactNode, useRef } from 'react';
import { useReveal } from './use-reveal.ts';

export type LayoutListProps<T> = {
  /** Order shown before the reveal. */
  items: T[];
  /** Order (and values) after the reveal; rows glide to their new positions. */
  revealedItems: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  trigger?: string;
  gap?: number;
  style?: CSSProperties;
  className?: string;
};

export function LayoutList<T>({
  items,
  revealedItems,
  getKey,
  renderItem,
  trigger,
  gap = 20,
  style,
  className,
}: LayoutListProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const { shown } = useReveal(ref, trigger);
  const list = shown ? revealedItems : items;
  return (
    <div
      ref={ref}
      style={{ display: 'flex', flexDirection: 'column', gap, ...style }}
      className={className}
    >
      {list.map((item, i) => (
        <motion.div
          key={getKey(item)}
          layout
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
        >
          {renderItem(item, i)}
        </motion.div>
      ))}
    </div>
  );
}
