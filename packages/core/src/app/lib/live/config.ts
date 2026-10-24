// Where the app leaves the live-room config for the live blocks. The blocks
// ship as a separate kit (dist), so the value goes through globalThis; this
// file lives under src/app because only src/app is published as source.
export const LIVE_GLOBAL_KEY = '__open_slide_live__';
