import { useLocale } from '@/lib/use-locale';

const UPSTREAM_URL = 'https://github.com/open-slide/open-slide';

/** slidez is a fork of open-slide (MIT); credit it where people look. */
export function UpstreamAttribution() {
  const zh = useLocale().id.startsWith('zh');
  return (
    <a
      href={UPSTREAM_URL}
      target="_blank"
      rel="noreferrer"
      className="mx-4 mb-1 inline-flex w-fit items-center gap-1 rounded-[3px] text-[11px] text-muted-foreground/70 outline-none transition-[color] hover:text-foreground focus-visible:ring-1 focus-visible:ring-brand"
      data-upstream-attribution
    >
      {zh ? '改自 open-slide，感謝原作者開源' : 'Forked from open-slide, with thanks'}
      <span aria-hidden>↗</span>
    </a>
  );
}
