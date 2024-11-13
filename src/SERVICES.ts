const VOIDS_MUSIC_REPO = "https://github.com/andrewtdiz/VoidsMusix";

const VOIDS_MUSIC_BOTS = ["MusicBot1", "MusicBot2"];

const LOCKED_IN_REPO = "https://github.com/andrewtdiz/locked-in-devs";

const LOCKED_IN_BOTS = ["LockedInBot"];

const WEB_HOOK_REP = "https://github.com/andrewtdiz/VPSWebhook";

const WEB_HOOK_BOTS = ["VPSWebhook"];

export default {
  [VOIDS_MUSIC_REPO]: VOIDS_MUSIC_BOTS,

  [LOCKED_IN_REPO]: LOCKED_IN_BOTS,

  [WEB_HOOK_REP]: WEB_HOOK_BOTS,
} as Record<string, string[]>;
