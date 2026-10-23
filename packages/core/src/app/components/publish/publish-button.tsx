import { Check, Copy, ExternalLink, Globe, Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLocale } from '@/lib/use-locale';

type PublishRecord = { project: string; url: string; publishedAt: string };
type LiveStatus = {
  uses: boolean;
  server: string | null;
  owner: string | null;
  cohort: string | null;
  room: { roomId: string; joinUrl: string; adminUrl: string } | null;
};
type Status = {
  vercel: { installed: boolean; loggedIn: boolean; user: string | null };
  record: PublishRecord | null;
  live: LiveStatus;
  busy: boolean;
};
type Phase = 'idle' | 'publishing' | 'confirm-unpublish' | 'unpublishing';

// Kept here instead of the shared locale files so this fork-only feature
// doesn't touch files upstream edits every release.
const ZH = {
  button: '發布',
  title: '發布這份簡報',
  checking: '正在檢查 Vercel 連線…',
  notConnected: '這台電腦還沒連上 Vercel。',
  notConnectedHint: '打開 Claude App，跟它說：「幫我安裝並登入 Vercel」。完成後按「重新檢查」。',
  recheck: '重新檢查',
  account: 'Vercel 帳號',
  intro:
    '上線後，任何拿到網址的人都能看到這份簡報；搜尋引擎不會收錄。只會上傳這一份，其他簡報不會跟著上去。',
  urlPreview: '網址通常會是',
  publish: '發布上線',
  republish: '更新上線內容',
  publishing: '正在打包、檢查並部署，大約需要 1 分鐘…',
  live: '已上線',
  updatedAt: '最後更新',
  open: '開啟',
  copy: '複製網址',
  copied: '已複製',
  unpublish: '下架',
  confirmTitle: '確定要下架嗎？',
  confirmBody: '網址會在幾秒內失效，這個動作無法復原。之後重新發布可以再上線，但網址可能會不一樣。',
  cancel: '取消',
  confirmUnpublish: '確定下架',
  unpublishing: '正在下架…',
  failed: '沒有成功',
  liveTitle: '現場互動',
  liveNoServer: '還沒設定互動服務網址，請聯絡工作坊講師。',
  liveSetupHint: '這份簡報有互動區塊。第一次發布前，請輸入講師給的工作坊代碼。',
  liveCohort: '工作坊代碼',
  liveOwner: '你的名字（讓講師找得到你的互動）',
  liveSave: '儲存',
  liveChange: '更改工作坊代碼',
  livePending: '發布後會自動開啟互動。',
  liveJoin: '觀眾加入網址',
  liveAdmin: '講者管理頁',
  liveAdminHint: '管理連結只給你自己，不要投影或分享。',
  liveOpenAdmin: '開啟管理頁',
  liveCopyAdmin: '複製管理連結',
  liveReset: '重設管理連結',
  liveResetConfirm: '重設後，舊的管理連結會立刻失效。確定嗎？',
};
const EN: typeof ZH = {
  button: 'Publish',
  title: 'Publish this deck',
  checking: 'Checking the Vercel connection…',
  notConnected: 'This computer is not connected to Vercel yet.',
  notConnectedHint:
    'Open the Claude app and say "install and log in to Vercel for me", then press Check again.',
  recheck: 'Check again',
  account: 'Vercel account',
  intro:
    'Anyone with the link can view the deck once it is live; search engines will not index it. Only this deck is uploaded.',
  urlPreview: 'The address will usually be',
  publish: 'Publish',
  republish: 'Update the live deck',
  publishing: 'Building, checking and deploying — about a minute…',
  live: 'Live',
  updatedAt: 'Last updated',
  open: 'Open',
  copy: 'Copy link',
  copied: 'Copied',
  unpublish: 'Unpublish',
  confirmTitle: 'Unpublish this deck?',
  confirmBody:
    'The link stops working within seconds and this cannot be undone. Publishing again brings it back, possibly at a different address.',
  cancel: 'Cancel',
  confirmUnpublish: 'Unpublish',
  unpublishing: 'Unpublishing…',
  failed: 'Something went wrong',
  liveTitle: 'Live interaction',
  liveNoServer: 'No live service is configured. Ask the workshop host.',
  liveSetupHint: 'This deck has live blocks. Enter the workshop code before the first publish.',
  liveCohort: 'Workshop code',
  liveOwner: 'Your name (so the host can find your room)',
  liveSave: 'Save',
  liveChange: 'Change workshop code',
  livePending: 'Live interaction opens when you publish.',
  liveJoin: 'Audience link',
  liveAdmin: 'Presenter page',
  liveAdminHint: 'Keep the admin link to yourself; do not project or share it.',
  liveOpenAdmin: 'Open presenter page',
  liveCopyAdmin: 'Copy admin link',
  liveReset: 'Reset admin link',
  liveResetConfirm: 'The old admin link stops working at once. Reset it?',
};

async function post(
  path: string,
  slideId: string,
  extra: Record<string, string> = {},
): Promise<Record<string, unknown>> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slideId, ...extra }),
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${res.status}`);
  return body;
}

export function PublishButton({ slideId }: { slideId: string }) {
  const s = useLocale().id.startsWith('zh') ? ZH : EN;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editingLive, setEditingLive] = useState(false);
  const [cohortInput, setCohortInput] = useState('');
  const [ownerInput, setOwnerInput] = useState('');

  const refresh = useCallback(async () => {
    setStatus(null);
    const res = await fetch(`/__publish/status?slideId=${encodeURIComponent(slideId)}`);
    setStatus((await res.json()) as Status);
  }, [slideId]);

  useEffect(() => {
    if (open) void refresh().catch((err: unknown) => setError(String(err)));
  }, [open, refresh]);

  if (import.meta.env.PROD) return null;

  const record = status?.record ?? null;
  const live = status?.live ?? null;
  const busy = phase === 'publishing' || phase === 'unpublishing';
  // A live deck can't go up until it has a workshop code to open its room with.
  const liveBlocked = Boolean(live?.uses && !live.room && (!live.server || !live.cohort));
  const showLiveSetup = Boolean(
    live?.uses && live.server && !live.room && (!live.cohort || editingLive),
  );

  const saveLive = async () => {
    setError(null);
    try {
      const body = await post('/__publish/live-setup', slideId, {
        cohort: cohortInput,
        owner: ownerInput,
      });
      setStatus((prev) => (prev ? { ...prev, live: body.live as LiveStatus } : prev));
      setEditingLive(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const resetLive = async () => {
    if (!window.confirm(s.liveResetConfirm)) return;
    setError(null);
    try {
      const body = await post('/__publish/live-reset', slideId);
      setStatus((prev) => (prev ? { ...prev, live: body.live as LiveStatus } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const publish = async () => {
    setError(null);
    setPhase('publishing');
    try {
      const body = await post('/__publish', slideId);
      setStatus((prev) => (prev ? { ...prev, record: body.record as PublishRecord } : prev));
      if (live?.uses) {
        const res = await fetch(`/__publish/status?slideId=${encodeURIComponent(slideId)}`);
        setStatus((await res.json()) as Status);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPhase('idle');
    }
  };

  const unpublish = async () => {
    setError(null);
    setPhase('unpublishing');
    try {
      await post('/__publish/unpublish', slideId);
      setStatus((prev) => (prev ? { ...prev, record: null } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPhase('idle');
    }
  };

  const copy = async () => {
    if (!record) return;
    await navigator.clipboard.writeText(record.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setOpen(true)}
        aria-label={s.title}
        title={s.title}
        data-publish-ui
      >
        <Globe className="size-3.5" />
        <span className="hidden lg:inline">{s.button}</span>
      </Button>
      <Dialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
        <DialogContent className="sm:max-w-lg" data-publish-dialog>
          <DialogHeader>
            <DialogTitle>{phase === 'confirm-unpublish' ? s.confirmTitle : s.title}</DialogTitle>
            <DialogDescription>
              {phase === 'confirm-unpublish' ? s.confirmBody : s.intro}
            </DialogDescription>
          </DialogHeader>

          {!status && (
            <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
              {s.checking}
            </p>
          )}

          {status && !status.vercel.loggedIn && (
            <div className="grid gap-2 text-[13px]" data-publish-state="not-connected">
              <p className="font-medium">{s.notConnected}</p>
              <p className="text-muted-foreground">{s.notConnectedHint}</p>
            </div>
          )}

          {status?.vercel.loggedIn && phase !== 'confirm-unpublish' && (
            <div className="grid gap-3 text-[13px]">
              <p className="text-muted-foreground">
                {s.account}：
                <span className="font-medium text-foreground">{status.vercel.user}</span>
              </p>
              {record ? (
                <div
                  className="grid gap-2 rounded-[8px] border border-border p-3"
                  data-publish-state="live"
                >
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    {s.live}
                  </span>
                  <a
                    href={record.url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all font-mono text-[12.5px] underline underline-offset-2"
                    data-publish-url
                  >
                    {record.url}
                  </a>
                  <span className="text-muted-foreground">
                    {s.updatedAt}：{new Date(record.publishedAt).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copy}>
                      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      {copied ? s.copied : s.copy}
                    </Button>
                    <a
                      href={record.url}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                    >
                      <ExternalLink className="size-3.5" />
                      {s.open}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {s.urlPreview}：
                  <span className="font-mono text-foreground">
                    https://{slideId.toLowerCase()}.vercel.app
                  </span>
                </p>
              )}
            </div>
          )}

          {status?.vercel.loggedIn && phase !== 'confirm-unpublish' && live?.uses && (
            <div
              className="grid gap-2 rounded-[8px] border border-border p-3 text-[13px]"
              data-publish-live
            >
              <span className="font-medium">{s.liveTitle}</span>
              {!live.server && <p className="text-muted-foreground">{s.liveNoServer}</p>}
              {showLiveSetup && (
                <div className="grid gap-2" data-publish-live-setup>
                  <p className="text-muted-foreground">{s.liveSetupHint}</p>
                  <input
                    className="h-8 rounded-[6px] border border-border bg-background px-2 font-mono uppercase"
                    placeholder={s.liveCohort}
                    aria-label={s.liveCohort}
                    value={cohortInput}
                    onChange={(e) => setCohortInput(e.target.value)}
                    data-publish-live-cohort
                  />
                  <input
                    className="h-8 rounded-[6px] border border-border bg-background px-2"
                    placeholder={s.liveOwner}
                    aria-label={s.liveOwner}
                    value={ownerInput}
                    onChange={(e) => setOwnerInput(e.target.value)}
                    data-publish-live-owner
                  />
                  <div>
                    <Button
                      size="sm"
                      onClick={() => void saveLive()}
                      disabled={!cohortInput.trim()}
                      data-publish-action="live-setup"
                    >
                      {s.liveSave}
                    </Button>
                  </div>
                </div>
              )}
              {live.server && !live.room && live.cohort && !editingLive && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>
                    {s.livePending}（{s.liveCohort}：
                    <span className="font-mono text-foreground">{live.cohort}</span>）
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setCohortInput(live.cohort ?? '');
                      setOwnerInput(live.owner ?? '');
                      setEditingLive(true);
                    }}
                  >
                    {s.liveChange}
                  </Button>
                </div>
              )}
              {live.room && (
                <div className="grid gap-2" data-publish-live-room>
                  <span className="text-muted-foreground">
                    {s.liveJoin}：
                    <span className="break-all font-mono text-foreground">{live.room.joinUrl}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {s.liveAdmin}：{s.liveAdminHint}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={live.room.adminUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({ variant: 'outline', size: 'sm' })}
                      data-publish-live-admin
                    >
                      <ExternalLink className="size-3.5" />
                      {s.liveOpenAdmin}
                    </a>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void navigator.clipboard.writeText(live.room?.adminUrl ?? '')}
                    >
                      <Copy className="size-3.5" />
                      {s.liveCopyAdmin}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void resetLive()}
                      data-publish-action="live-reset"
                    >
                      {s.liveReset}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {busy && (
            <p className="flex items-center gap-2 text-[13px]" data-publish-progress>
              <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
              {phase === 'publishing' ? s.publishing : s.unpublishing}
            </p>
          )}

          {error && (
            <div className="grid gap-1 rounded-[8px] bg-destructive/10 p-3 text-[12.5px] text-destructive">
              <span className="font-medium">{s.failed}</span>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          )}

          <DialogFooter>
            {status && !status.vercel.loggedIn && (
              <Button size="sm" onClick={() => void refresh()}>
                <RefreshCw className="size-3.5" />
                {s.recheck}
              </Button>
            )}
            {status?.vercel.loggedIn && phase === 'confirm-unpublish' && (
              <>
                <Button size="sm" variant="ghost" onClick={() => setPhase('idle')}>
                  {s.cancel}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => void unpublish()}>
                  {s.confirmUnpublish}
                </Button>
              </>
            )}
            {status?.vercel.loggedIn && phase !== 'confirm-unpublish' && (
              <>
                {record && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => setPhase('confirm-unpublish')}
                    data-publish-action="unpublish"
                  >
                    {s.unpublish}
                  </Button>
                )}
                <Button
                  size="sm"
                  disabled={busy || liveBlocked}
                  onClick={() => void publish()}
                  data-publish-action="publish"
                >
                  {record ? s.republish : s.publish}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
