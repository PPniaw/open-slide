import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgentDock, useAgentSessions, useAgentStatus } from '@/lib/agent/use-agent';
import { useLocale } from '@/lib/use-locale';
import { cn } from '@/lib/utils';
import { ProviderLogo } from './provider-logo';

export const AGENT_DOCK_W = 380;

export function AgentToggleButton() {
  const t = useLocale();
  const { open, toggle } = useAgentDock();
  const { provider } = useAgentStatus();
  const { sessions } = useAgentSessions();
  // Any running session, on any deck, keeps the button moving so the work
  // stays visible with the panel closed.
  const running = sessions.find((s) => s.status === 'running') ?? null;
  if (import.meta.env.PROD) return null;
  return (
    <Button
      size="sm"
      variant={open ? 'default' : 'ghost'}
      onClick={toggle}
      aria-pressed={open}
      aria-busy={running !== null}
      aria-label={t.agent.openTitle}
      title={t.agent.openTitle}
      className="relative"
      data-agent-ui
      data-agent-provider={running?.provider}
    >
      {running && <span aria-hidden className="agent-ring" />}
      {provider ? (
        <ProviderLogo
          provider={provider.id}
          className={cn('size-3.5', running && 'agent-busy-icon')}
        />
      ) : (
        <Sparkles className={cn('size-3.5', running && 'agent-busy-icon')} />
      )}
      <span className="hidden lg:inline">{t.agent.open}</span>
      <kbd className="ml-1 hidden rounded-[3px] bg-foreground/10 px-1 font-mono text-[9.5px] tracking-[0.04em] lg:inline">
        A
      </kbd>
    </Button>
  );
}
