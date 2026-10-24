import { ExternalLink, Loader2, MessagesSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type PublishedDeck, unpublishDeck } from '@/lib/publish/published';
import { useLocale } from '@/lib/use-locale';

// Kept here instead of the shared locale files so this fork-only feature
// doesn't touch files upstream edits every release.
const ZH = {
  live: '已上線',
  liveInteraction: '互動開啟中',
  open: '開啟',
  unpublish: '下架',
  unpublishing: '正在下架…',
  confirmTitle: '確定要下架嗎？',
  confirmBody:
    '網址會在幾秒內失效，現場互動也會一起關閉。之後重新發布可以再上線，但網址可能會不一樣。',
  cancel: '取消',
  done: '已下架',
  failed: '下架失敗',
};
const EN: typeof ZH = {
  live: 'Live',
  liveInteraction: 'Live interaction on',
  open: 'Open',
  unpublish: 'Unpublish',
  unpublishing: 'Unpublishing…',
  confirmTitle: 'Unpublish this deck?',
  confirmBody:
    'The link stops working within seconds and live interaction closes too. Publishing again brings it back, possibly at a different address.',
  cancel: 'Cancel',
  done: 'Unpublished',
  failed: 'Unpublish failed',
};

/** Under a deck card in the "Published" view: its live address and an unpublish button. */
export function PublishedFooter({
  slideId,
  title,
  deck,
}: {
  slideId: string;
  title: string;
  deck: PublishedDeck;
}) {
  const s = useLocale().id.startsWith('zh') ? ZH : EN;
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const unpublish = async () => {
    setBusy(true);
    try {
      await unpublishDeck(slideId);
      toast.success(`${s.done}：${title}`);
      setConfirming(false);
    } catch (err) {
      toast.error(`${s.failed}：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="mt-2 flex min-w-0 items-center gap-2 text-[12px]" data-published-footer>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
          {s.live}
        </span>
        {deck.live && (
          <span
            className="inline-flex shrink-0 items-center gap-1 text-muted-foreground"
            title={s.liveInteraction}
          >
            <MessagesSquare className="size-3" aria-hidden />
            <span className="sr-only">{s.liveInteraction}</span>
          </span>
        )}
        <a
          href={deck.url}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 flex-1 truncate font-mono text-muted-foreground hover:text-foreground"
          translate="no"
        >
          {deck.url.replace(/^https?:\/\//, '')}
        </a>
        <a
          href={deck.url}
          target="_blank"
          rel="noreferrer"
          aria-label={s.open}
          title={s.open}
          className={buttonVariants({ variant: 'ghost', size: 'icon-xs' })}
        >
          <ExternalLink aria-hidden />
        </a>
        <Button
          size="xs"
          variant="outline"
          onClick={() => setConfirming(true)}
          data-published-action="unpublish"
        >
          {s.unpublish}
        </Button>
      </div>

      <Dialog open={confirming} onOpenChange={(v) => !busy && setConfirming(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{s.confirmTitle}</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{title}</span>
              <br />
              {s.confirmBody}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" size="sm" disabled={busy} onClick={() => setConfirming(false)}>
              {s.cancel}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={busy}
              onClick={() => void unpublish()}
              data-published-action="confirm-unpublish"
            >
              {busy && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden />}
              {busy ? s.unpublishing : s.unpublish}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
