import { useReducedMotion } from 'motion/react';
import { type RefObject, useLayoutEffect, useState } from 'react';
import { useIsActivePage } from '../app/lib/step-context.tsx';

export type RevealState = {
  /** True only for the instance the audience is watching. */
  active: boolean;
  /** True once the element should be in its final, revealed state. */
  shown: boolean;
  /** Skip the animation and render the final state directly. */
  instant: boolean;
};

function findStep(el: HTMLElement, trigger: string | undefined): HTMLElement | null {
  if (!trigger) return el.closest<HTMLElement>('[data-osd-step]');
  const marker = el.closest('section')?.querySelector(`[data-reveal="${trigger}"]`);
  return marker?.closest<HTMLElement>('[data-osd-step]') ?? null;
}

export function useReveal(ref: RefObject<HTMLElement | null>, trigger?: string): RevealState {
  const active = useIsActivePage();
  const reduced = useReducedMotion() ?? false;
  // <Step> keeps its children mounted and only toggles opacity, so a mount-time
  // animation would finish while still invisible. Track the step's attribute
  // instead; `null` until measured so the first render doesn't play early.
  const [revealed, setRevealed] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const step = findStep(el, trigger);
    if (!step) {
      setRevealed(true);
      return;
    }
    const read = () => setRevealed(step.dataset.osdStep === 'revealed');
    read();
    const observer = new MutationObserver(read);
    observer.observe(step, { attributes: true, attributeFilter: ['data-osd-step'] });
    return () => observer.disconnect();
  }, [ref, trigger]);

  const instant = !active || reduced;
  return { active, shown: instant || revealed === true, instant };
}
