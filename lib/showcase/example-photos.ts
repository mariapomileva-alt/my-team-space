/** Curated Unsplash photography for portfolio examples — sports-specific, high resolution. */

function photo(id: string, w = 900, h = 900) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=88&auto=format`;
}

function cover(id: string) {
  return photo(id, 1600, 840);
}

/** IDs verified against images.unsplash.com (Unsplash removes stale assets over time). */
export const EXAMPLE_PHOTO_SETS = {
  tennis: {
    cover: cover("photo-1724157090170-c0e4aa4b170f"),
    spotlight: [
      cover("photo-1724157090170-c0e4aa4b170f"),
      photo("photo-1714802064588-39d1065269cf", 900, 680),
      photo("photo-1622279457486-62dcc4a431d6", 900, 680),
    ],
    gallery: [
      photo("photo-1724157090170-c0e4aa4b170f"),
      photo("photo-1714802064588-39d1065269cf"),
      photo("photo-1622279457486-62dcc4a431d6"),
      photo("photo-1551698618-1dfe5d97d256"),
      photo("photo-1571902943202-507ec2618e8f"),
      photo("photo-1461896836934-ffe607ba8211"),
      photo("photo-1521572163474-6864f9cf17ab"),
      photo("photo-1503676260728-1c00da094a0b"),
    ],
    galleryCaptions: [
      "Morning clay session",
      "Match point — U16 final",
      "Centre court drills",
      "Serve technique review",
      "Doubles championship point",
      "Coach Marcus on court",
      "Academy squad portrait",
      "Parents' viewing day",
    ],
    shop: photo("photo-1521572163474-6864f9cf17ab", 480, 480),
  },
  dance: {
    cover: cover("photo-1504609773096-104ff2c73ba4"),
    spotlight: [
      cover("photo-1518611012118-696072aa579a"),
      photo("photo-1571019613454-1cb2f99b2d8b", 900, 680),
      photo("photo-1547036967-23d11aacaee0", 900, 680),
    ],
    gallery: [
      photo("photo-1504609773096-104ff2c73ba4"),
      photo("photo-1518611012118-696072aa579a"),
      photo("photo-1547036967-23d11aacaee0"),
      photo("photo-1515886657613-9f3515b0c78f"),
      photo("photo-1571019613454-1cb2f99b2d8b"),
      photo("photo-1508700115892-45ecd05ae2ad"),
      photo("photo-1518609878373-06d740f60d8b"),
      photo("photo-1503676260728-1c00da094a0b"),
    ],
    galleryCaptions: [
      "First day smiles",
      "Spring showcase rehearsal",
      "Group routine — ages 7–9",
      "Acro partner balance",
      "Medals ceremony",
      "Hip-hop crew energy",
      "Ballet foundations class",
      "Backstage before showtime",
    ],
  },
  basketball: {
    cover: cover("photo-1546519638-68e109498ffc"),
    spotlight: [
      cover("photo-1574629810360-7efbbe195018"),
      photo("photo-1467232004584-a241de8bcf5d", 900, 680),
      photo("photo-1571902943202-507ec2618e8f", 900, 680),
    ],
    gallery: [
      photo("photo-1546519638-68e109498ffc"),
      photo("photo-1574629810360-7efbbe195018"),
      photo("photo-1467232004584-a241de8bcf5d"),
      photo("photo-1571902943202-507ec2618e8f"),
      photo("photo-1461896836934-ffe607ba8211"),
      photo("photo-1521572163474-6864f9cf17ab"),
      photo("photo-1551698618-1dfe5d97d256"),
      photo("photo-1503676260728-1c00da094a0b"),
    ],
    galleryCaptions: [
      "Tip-off — city league final",
      "Fast break in transition",
      "Captain's pre-game talk",
      "Team huddle",
      "Game-winning layup",
      "U14 tournament action",
      "Squad photo — 2026",
      "MVP celebration",
    ],
    shopJersey: photo("photo-1521572163474-6864f9cf17ab", 480, 480),
    shopShorts: photo("photo-1546519638-68e109498ffc", 480, 480),
  },
} as const;

export { photo as examplePhoto, cover as exampleCover };
