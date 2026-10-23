import type { Locale } from './locale/types';

export type OpenSlideBuildConfig = {
  showSlideBrowser?: boolean;
  showSlideUi?: boolean;
  allowHtmlDownload?: boolean;
};

export type OpenSlideAgentConfig = {
  enabled?: boolean;
};

export type OpenSlideLiveConfig = {
  /** Base URL of the shared live-interaction service. */
  server?: string;
  /** Deck id → room id. Filled in by `open-slide publish`; not set by hand. */
  rooms?: Record<string, string>;
};

export type OpenSlideConfig = {
  base?: string;
  slidesDir?: string;
  themesDir?: string;
  assetsDir?: string;
  port?: number;
  allowedHosts?: string[] | true;
  /**
   * @deprecated Pick the UI language from the language switcher in the slide UI
   * instead. When set, this only seeds the initial language until the user
   * chooses one (their choice is then remembered locally).
   */
  locale?: Locale;
  build?: OpenSlideBuildConfig;
  agent?: OpenSlideAgentConfig;
  live?: OpenSlideLiveConfig;
};
