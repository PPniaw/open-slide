import type { OpenSlideConfig } from '@open-slide/core';
import { en } from '@open-slide/core/locale';

// Upstream specs query English UI labels; the fork defaults the UI to Traditional Chinese.
const openSlideConfig: OpenSlideConfig = { locale: en };

export default openSlideConfig;
