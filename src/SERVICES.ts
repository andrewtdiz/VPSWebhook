const VOIDS_MUSIC_REPO = "https://api.github.com/andrewtdiz/VoidsMusix";

const VOIDS_MUSIC_BOTS = [
  "MusicBot1",
  "MusicBot2",
  // "MusicBot3",
];

const LOCKED_IN_REPO = "https://api.github.com/andrewtdiz/locked-in-devs";

const LOCKED_IN_BOTS = ["LockedInBot"];

const WEB_HOOK_REP = "https://api.github.com/andrewtdiz/VPSWebhook";

const WEB_HOOK_BOTS = ["VPSWebhook"];

const PING_RENDER_REPO = "https://api.github.com/andrewtdiz/pingrender";

const PING_RENDER_BOTS = ["pingrender"];

export default {
  [VOIDS_MUSIC_REPO]: VOIDS_MUSIC_BOTS,

  [LOCKED_IN_REPO]: LOCKED_IN_BOTS,

  [WEB_HOOK_REP]: WEB_HOOK_BOTS,

  [PING_RENDER_REPO]: PING_RENDER_BOTS,
} as Record<string, string[]>;
