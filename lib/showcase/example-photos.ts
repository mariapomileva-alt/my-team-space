/** Curated Unsplash photography for portfolio examples — sports-specific, high resolution. */

function photo(id: string, w = 900, h = 900) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=88&auto=format`;
}

function cover(id: string) {
  return photo(id, 1600, 840);
}

export const EXAMPLE_PHOTO_SETS = {
  tennis: {
    cover: cover("photo-1554068865-24cecd4e9b26"),
    spotlight: [
      cover("photo-1622163649001-09445f787b59"),
      photo("photo-1551698618-1dfe5d97d256", 900, 680),
      photo("photo-1532151694832-7252614dbd1b", 900, 680),
    ],
    gallery: [
      photo("photo-1554068865-24cecd4e9b26"),
      photo("photo-1622163649001-09445f787b59"),
      photo("photo-1595435934249-26df3d350cea"),
      photo("photo-1551698618-1dfe5d97d256"),
      photo("photo-1532151694832-7252614dbd1b"),
      photo("photo-1611874824423-ef3ddb1c972a"),
      photo("photo-1587280508545-6392f456a209"),
      photo("photo-1617885741078-665bb78490ba"),
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
      cover("photo-1518834107812-67b0bb7c2d2e"),
      photo("photo-1516450360432-1aa25ef1279e", 900, 680),
      photo("photo-1571019613454-1cb2f99b2d8b", 900, 680),
    ],
    gallery: [
      photo("photo-1504609773096-104ff2c73ba4"),
      photo("photo-1518834107812-67b0bb7c2d2e"),
      photo("photo-1547159414-26d2a83f4a42"),
      photo("photo-1516450360432-1aa25ef1279e"),
      photo("photo-1571019613454-1cb2f99b2d8b"),
      photo("photo-1508700115892-45ecd05ae2ad"),
      photo("photo-1463746934887-52fd00699226"),
      photo("photo-1518609878373-06d740f60d8b"),
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
      photo("photo-1577225245490-5cca4573a14f", 900, 680),
      photo("photo-1577471348706-c7aad785419e", 900, 680),
    ],
    gallery: [
      photo("photo-1546519638-68e109498ffc"),
      photo("photo-1519861531473-920026218ac7"),
      photo("photo-1574623452334-1e0ac2bddd96"),
      photo("photo-1577225245490-5cca4573a14f"),
      photo("photo-1574629810360-7efbbe195018"),
      photo("photo-1577471348706-c7aad785419e"),
      photo("photo-1511516416926-57b9319f94fc"),
      photo("photo-1504450757627-4eeb1c678bda"),
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
    shopJersey: photo("photo-1574623452334-1e0ac2bddd96", 480, 480),
    shopShorts: photo("photo-1519861531473-920026218ac7", 480, 480),
  },
} as const;

export { photo as examplePhoto, cover as exampleCover };
