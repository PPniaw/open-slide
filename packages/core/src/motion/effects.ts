import type { Transition, Variants } from 'motion/react';

export type RevealEffect = 'fade' | 'rise' | 'pop' | 'slide' | 'blur';

export const REVEAL_EFFECTS: Record<RevealEffect, Variants> = {
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
  rise: { hidden: { opacity: 0, y: 48 }, shown: { opacity: 1, y: 0 } },
  pop: { hidden: { opacity: 0, scale: 0.6 }, shown: { opacity: 1, scale: 1 } },
  slide: { hidden: { opacity: 0, x: -80 }, shown: { opacity: 1, x: 0 } },
  blur: {
    hidden: { opacity: 0, filter: 'blur(16px)' },
    // A leftover `blur(0px)` makes the editable PPTX export rasterise the element.
    shown: { opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  },
};

export const SPRING: Transition = { type: 'spring', stiffness: 320, damping: 24 };
