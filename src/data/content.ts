/* Site content — AURA's own copy. Release metadata lives in exactly
 * one place (RELEASE); download buttons, version pill and release
 * links all read from it. */

export const NAV_LINKS = [
  { href: '#engine', label: 'Engine' },
  { href: '#showcase', label: 'Outcomes' },
  { href: '#download', label: 'Download' },
];

export const RELEASE = {
  version: '0.1.20',
  repo: 'https://github.com/Aura-hub-ai-native-workspace/aura-hub',
  assets: {
    linuxTarball: 'AURA-Hub-0.1.20-linux-x64.tar.gz',
    linuxAppImage: 'AURA-Hub-0.1.20-linux-x64.AppImage',
    linuxDeb: 'AURA-Hub-0.1.20-linux-x64.deb',
    windows: 'AURA-Hub-0.1.20-windows-x64.exe',
    macosArm64: 'AURA-Hub-0.1.20-macos-arm64.dmg',
    macosX64: 'AURA-Hub-0.1.20-macos-x64.dmg',
  },
  sizes: {
    linuxTarball: '142 MB',
    linuxAppImage: '142 MB',
    linuxDeb: '101 MB',
    windows: '41 MB',
    macosArm64: '78 MB',
    macosX64: '78 MB',
  },
} as const;

export const releaseUrl = `${RELEASE.repo}/releases/tag/v${RELEASE.version}`;
export const releaseBase = `${RELEASE.repo}/releases/download/v${RELEASE.version}/`;
export const assetUrl = (asset: keyof typeof RELEASE.assets) =>
  `${releaseBase}${RELEASE.assets[asset]}`;

export interface DownloadStats {
  total: number;
  windows: number;
  linux: number;
  macos: number;
}

/** Live figures from GitHub's public Release API. Null when unreachable —
 *  callers hide counters rather than inventing them. */
export async function fetchDownloadStats(): Promise<DownloadStats | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/Aura-hub-ai-native-workspace/aura-hub/releases/tags/v${RELEASE.version}`,
      { headers: { Accept: 'application/vnd.github+json' } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      assets?: { name?: string; download_count?: number }[];
    };
    const counts = (data.assets ?? []).map((a) => ({
      name: (a.name ?? '').toLowerCase(),
      count: a.download_count ?? 0,
    }));
    const pick = (...needles: string[]) =>
      counts
        .filter((a) => needles.some((n) => a.name.includes(n)))
        .reduce((sum, a) => sum + a.count, 0);
    const windows = pick('windows');
    const linux = pick('linux');
    const macos = pick('macos', 'apple', '.dmg');
    const total = counts.reduce((sum, a) => sum + a.count, 0);
    if (total === 0) return null;
    return { total, windows, linux, macos };
  } catch {
    return null;
  }
}

/** Detects the visitor OS for HIGHLIGHTING one card. Never hides,
 *  disables or reorders anything — and never guesses macOS arch. */
export function detectOS(): 'windows' | 'macos' | 'linux' | null {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const platform =
    (typeof navigator !== 'undefined' &&
      (navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData?.platform) ||
    (typeof navigator !== 'undefined' ? navigator.platform : '') ||
    '';
  const hay = `${platform} ${ua}`.toLowerCase();
  if (hay.includes('win')) return 'windows';
  if (hay.includes('mac')) return 'macos';
  if (hay.includes('linux') && !hay.includes('android')) return 'linux';
  return null;
}

export interface ReleaseNote {
  tag: string;
  name: string;
  date: string;
  url: string;
  notes: string;
}

export async function fetchReleases(): Promise<ReleaseNote[] | null> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/Aura-hub-ai-native-workspace/aura-hub/releases?per_page=3',
      { headers: { Accept: 'application/vnd.github+json' } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      tag_name?: string;
      name?: string;
      published_at?: string;
      html_url?: string;
      body?: string;
    }[];
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.slice(0, 3).map((r) => ({
      tag: r.tag_name ?? '',
      name: r.name ?? r.tag_name ?? 'Release',
      date: r.published_at
        ? new Date(r.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        : '',
      url: r.html_url ?? RELEASE.repo,
      notes: (r.body ?? '').split('\n').filter(Boolean)[0]?.slice(0, 140) ?? '',
    }));
  } catch {
    return null;
  }
}
