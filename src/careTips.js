// Matched against the plant's species (or name) by keyword. v2 will replace this with Claude API tips.
const SPECIES_TIPS = [
  {
    keywords: ['monstera', 'swiss cheese'],
    tips: [
      'Bright, indirect light. Direct sun can scorch the leaves.',
      'Water when the top 2–3 cm of soil is dry.',
      'Give it a moss pole to climb for bigger, split leaves.',
    ],
  },
  {
    keywords: ['pothos', 'devil'],
    tips: [
      'Tolerates low light, but grows faster in bright, indirect light.',
      'Let the soil dry out halfway between waterings.',
      'Droopy leaves usually mean it is thirsty.',
    ],
  },
  {
    keywords: ['snake', 'sansevieria', 'dracaena trifasciata'],
    tips: [
      'Very drought tolerant. Overwatering is the main risk.',
      'Water only when the soil is completely dry.',
      'Happy in low to bright light.',
    ],
  },
  {
    keywords: ['zz', 'zamioculcas'],
    tips: [
      'Stores water in its rhizomes, so water sparingly.',
      'Yellow leaves usually mean too much water.',
      'Handles low light well.',
    ],
  },
  {
    keywords: ['peace lily', 'spathiphyllum'],
    tips: [
      'Droops dramatically when thirsty and perks up after watering.',
      'Prefers medium, indirect light.',
      'Brown tips can mean tap water sensitivity. Try filtered water.',
    ],
  },
  {
    keywords: ['spider plant', 'chlorophytum'],
    tips: [
      'Keep the soil lightly moist, not soggy.',
      'Bright, indirect light keeps the stripes vivid.',
      'Pot up the baby plantlets to grow new plants.',
    ],
  },
  {
    keywords: ['fiddle', 'ficus', 'rubber'],
    tips: [
      'Bright, consistent light. Avoid moving it around.',
      'Water when the top few centimetres of soil are dry.',
      'Wipe the leaves now and then so they can soak up light.',
    ],
  },
  {
    keywords: ['succulent', 'cactus', 'aloe', 'jade', 'echeveria'],
    tips: [
      'Use well-draining soil and a pot with a drainage hole.',
      'Soak thoroughly, then let the soil dry out completely.',
      'Needs lots of bright light, so a sunny window is ideal.',
    ],
  },
  {
    keywords: ['fern'],
    tips: [
      'Loves humidity. Mist it or keep it near other plants.',
      'Keep the soil evenly moist.',
      'Indirect light only. Direct sun crisps the fronds.',
    ],
  },
  {
    keywords: ['philodendron'],
    tips: [
      'Bright, indirect light suits it best.',
      'Water when the top half of the soil is dry.',
      'Yellow lower leaves often signal overwatering.',
    ],
  },
  {
    keywords: ['calathea', 'prayer', 'maranta'],
    tips: [
      'Prefers filtered or distilled water.',
      'Keep the soil lightly moist and the air humid.',
      'Curling leaves mean it is thirsty or the air is too dry.',
    ],
  },
  {
    keywords: ['orchid', 'phalaenopsis'],
    tips: [
      'Water when the roots turn silvery-grey.',
      'Never let it sit in standing water.',
      'Bright, indirect light encourages new blooms.',
    ],
  },
]

const GENERAL_TIPS = [
  'Check the soil with your finger before watering. If the top layer is dry, it is time.',
  'Make sure the pot has a drainage hole so roots never sit in water.',
  'Most houseplants like bright, indirect light.',
  'Water less in winter, when growth slows down.',
]

export function getCareTips(plant) {
  const text = `${plant.species} ${plant.name}`.toLowerCase()
  const match = SPECIES_TIPS.find((entry) =>
    entry.keywords.some((keyword) => text.includes(keyword)),
  )
  return match ? { tips: match.tips, isGeneral: false } : { tips: GENERAL_TIPS, isGeneral: true }
}
