const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '../public/covers')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

const covers = [
  { file: 'cover-wow-momo.svg', title: 'WOW! MOMO', sub: 'AUTHENTIC DARJEELING MOMOS & MOBURGERS' },
  { file: 'cover-chinese-wok.svg', title: 'DRAGON CHINESE WOK', sub: 'HAKKA NOODLES, MANCHURIAN & SIZZLERS' },
  { file: 'cover-mamta-sweets.svg', title: 'MAMTA SWEETS & NAMKEEN', sub: 'PURE DESI GHEE SWEETS & FRESH NAMKEEN' },
  { file: 'cover-good-food.svg', title: 'GOOD FOOD CLOUD KITCHEN', sub: 'HEALTHY SALADS, PROTEIN BOWLS & WRAPS' },
  { file: 'cover-rajgad-travels.svg', title: 'RAJGAD TOURS & TRAVELS', sub: 'LUXURY AC SLEEPER BUSES & HOLIDAY PACKAGES' },
  { file: 'cover-shivaji-travels.svg', title: 'SHIVAJI EXPRESS TOURS', sub: 'AIRPORT CABS, OUTSTATION SUVS & YATRA BUSES' },
  { file: 'cover-maharashtra-tours.svg', title: 'MAHARASHTRA DARSHAN TOURS', sub: 'KONKAN, ASHTAVINAYAK & HERITAGE SIGHTSEEING' },
  { file: 'cover-sai-travels.svg', title: 'SAI TRAVELS & CAR RENTALS', sub: 'SELF-DRIVE SEDANS & LUXURY TEMPO TRAVELLERS' },
  { file: 'cover-royal-safari.svg', title: 'ROYAL SAFARI & HOLIDAYS', sub: 'HILL STATION VOLVO BUSES & TOUR PACKAGES' },
  { file: 'cover-raj-garments.svg', title: 'RAJ GARMENTS', sub: 'PREMIUM MEN S SUITS, FORMAL & CASUAL WEAR' },
  { file: 'cover-sunny-garments.svg', title: 'SUNNY GARMENTS & KIDS WORLD', sub: 'TRENDY KIDS WEAR, PARTY DRESSES & HOODIES' },
  { file: 'cover-metro-fashion.svg', title: 'METRO FASHION STUDIO', sub: 'DESIGNER KURTIS, WESTERN TOPS & PALAZZOS' },
  { file: 'cover-royal-textiles.svg', title: 'ROYAL TEXTILES & SILKS', sub: 'BANARASI, KANJIVARAM & CHANDERI SAREES' },
  { file: 'cover-surya-mobile.svg', title: 'SURYA MOBILE SHOP', sub: '5G SMARTPHONES, ONEPLUS, REALME & EARBUDS' },
  { file: 'cover-shilam-mobile.svg', title: 'SHILAM MOBILE & SMART TECH', sub: 'XIAOMI, VIVO, MAGSAFE POWERBANKS & TECH' },
  { file: 'cover-galaxy-telecom.svg', title: 'GALAXY TELECOM & GADGETS', sub: 'ARMOR CASES, SMARTWATCHES & AUDIO GEAR' },
  { file: 'cover-apna-mobile.svg', title: 'APNA MOBILE HUB', sub: 'BUDGET 5G PHONES & BLUETOOTH ACCESSORIES' },
  { file: 'cover-great-eastern.svg', title: 'GREAT EASTERN ELECTRONICS', sub: 'DOUBLE DOOR FRIDGES, WASHING MACHINES & ACS' },
  { file: 'cover-electronics-mart.svg', title: 'ELECTRONICS MART INDIA', sub: 'HOME THEATERS, AIR PURIFIERS & OLED TVS' },
  { file: 'cover-royal-wood.svg', title: 'ROYAL WOOD CRAFT', sub: 'ERGONOMIC OFFICE CHAIRS & EXECUTIVE DESKS' },
  { file: 'cover-modern-living.svg', title: 'MODERN LIVING DECOR', sub: 'ORTHOPEDIC MATTRESSES & RECLINER SOFAS' },
  { file: 'cover-om-steel.svg', title: 'OM STEEL FURNITURE', sub: 'HEAVY DUTY STEEL CUPBOARDS & LOCKERS' },
  { file: 'cover-apna-bazaar.svg', title: 'APNA SUPER BAZAAR', sub: 'PREMIUM DRY FRUITS, BASMATI RICE & EDIBLE OILS' },
  { file: 'cover-organic-farm.svg', title: 'PURE ORGANIC FARM STORE', sub: 'COLD PRESSED OILS, JAGGERY & MILLETS' },
  { file: 'cover-shree-ganesh.svg', title: 'SHREE GANESH KIRANA', sub: 'TATA TEA, WHOLE SPICES & DAILY PROVISIONS' },
  { file: 'cover-green-basket.svg', title: 'GREEN BASKET SUPERMARKET', sub: 'FRESH DAIRY PANEER, BUTTER & PROVISIONS' }
]

covers.forEach((c) => {
  const safeSub = c.sub.replace(/&/g, '&amp;')
  const safeTitle = c.title.replace(/&/g, '&amp;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08080a" />
      <stop offset="50%" stop-color="#121218" />
      <stop offset="100%" stop-color="#030305" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <rect width="1600" height="600" fill="url(#bgGrad)" />
  <circle cx="800" cy="300" r="450" fill="url(#glow)" />

  <g transform="translate(765, 140)" filter="url(#shadow)">
    <path d="M35 5 L45 25 L65 35 L45 45 L35 65 L25 45 L5 35 L25 25 Z" fill="#ffffff" opacity="0.9" />
  </g>

  <g filter="url(#shadow)">
    <text x="800" y="325" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif" font-size="64" font-weight="900" letter-spacing="6" fill="#ffffff" text-anchor="middle">
      ${safeTitle}
    </text>
    <text x="800" y="390" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="10" fill="#9ca3af" text-anchor="middle">
      ${safeSub}
    </text>
  </g>
</svg>`

  fs.writeFileSync(path.join(dir, c.file), svg)
})

console.log('All cover SVGs generated successfully!')
