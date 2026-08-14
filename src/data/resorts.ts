export interface Resort {
  slug: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  /** Base station elevation, metres */
  baseElevation: number;
  /** Highest lift-served point, metres */
  topElevation: number;
}

export const resorts: Resort[] = [
  // France
  { slug: "chamonix", name: "Chamonix", country: "France", region: "Mont Blanc", lat: 45.9237, lon: 6.8694, baseElevation: 1035, topElevation: 3300 },
  { slug: "val-disere", name: "Val d'Isère", country: "France", region: "Tarentaise", lat: 45.4489, lon: 6.9797, baseElevation: 1850, topElevation: 3456 },
  { slug: "tignes", name: "Tignes", country: "France", region: "Tarentaise", lat: 45.4674, lon: 6.9061, baseElevation: 2100, topElevation: 3456 },
  { slug: "les-deux-alpes", name: "Les Deux Alpes", country: "France", region: "Isère", lat: 45.0119, lon: 6.1225, baseElevation: 1650, topElevation: 3568 },
  { slug: "courchevel", name: "Courchevel", country: "France", region: "Three Valleys", lat: 45.4147, lon: 6.6349, baseElevation: 1300, topElevation: 2738 },
  { slug: "meribel", name: "Méribel", country: "France", region: "Three Valleys", lat: 45.3974, lon: 6.5658, baseElevation: 1450, topElevation: 2952 },
  { slug: "val-thorens", name: "Val Thorens", country: "France", region: "Three Valleys", lat: 45.2977, lon: 6.5799, baseElevation: 2300, topElevation: 3230 },
  { slug: "la-plagne", name: "La Plagne", country: "France", region: "Paradiski", lat: 45.5061, lon: 6.6764, baseElevation: 1970, topElevation: 3250 },
  { slug: "alpe-dhuez", name: "Alpe d'Huez", country: "France", region: "Isère", lat: 45.0909, lon: 6.07, baseElevation: 1860, topElevation: 3330 },
  { slug: "serre-chevalier", name: "Serre Chevalier", country: "France", region: "Hautes-Alpes", lat: 44.944, lon: 6.554, baseElevation: 1400, topElevation: 2830 },
  { slug: "la-rosiere", name: "La Rosière", country: "France", region: "Tarentaise", lat: 45.6206, lon: 6.8425, baseElevation: 1850, topElevation: 2650 },
  { slug: "avoriaz", name: "Avoriaz", country: "France", region: "Portes du Soleil", lat: 46.1917, lon: 6.7729, baseElevation: 1800, topElevation: 2466 },

  // Switzerland
  { slug: "zermatt", name: "Zermatt", country: "Switzerland", region: "Valais", lat: 46.0207, lon: 7.7491, baseElevation: 1620, topElevation: 3899 },
  { slug: "verbier", name: "Verbier", country: "Switzerland", region: "Valais", lat: 46.0967, lon: 7.2286, baseElevation: 1500, topElevation: 3330 },
  { slug: "st-moritz", name: "St. Moritz", country: "Switzerland", region: "Graubünden", lat: 46.4908, lon: 9.8355, baseElevation: 1856, topElevation: 3057 },
  { slug: "wengen", name: "Wengen", country: "Switzerland", region: "Jungfrau", lat: 46.6058, lon: 7.9219, baseElevation: 1274, topElevation: 2320 },
  { slug: "grindelwald", name: "Grindelwald", country: "Switzerland", region: "Jungfrau", lat: 46.6244, lon: 8.0414, baseElevation: 1034, topElevation: 2971 },
  { slug: "davos", name: "Davos", country: "Switzerland", region: "Graubünden", lat: 46.8027, lon: 9.836, baseElevation: 1560, topElevation: 2844 },
  { slug: "crans-montana", name: "Crans-Montana", country: "Switzerland", region: "Valais", lat: 46.3092, lon: 7.4844, baseElevation: 1500, topElevation: 3000 },
  { slug: "engelberg", name: "Engelberg", country: "Switzerland", region: "Central Switzerland", lat: 46.8194, lon: 8.4058, baseElevation: 1000, topElevation: 3020 },

  // Austria
  { slug: "st-anton", name: "St. Anton am Arlberg", country: "Austria", region: "Arlberg", lat: 47.1288, lon: 10.2639, baseElevation: 1304, topElevation: 2811 },
  { slug: "kitzbuhel", name: "Kitzbühel", country: "Austria", region: "Tyrol", lat: 47.4467, lon: 12.3927, baseElevation: 762, topElevation: 2000 },
  { slug: "solden", name: "Sölden", country: "Austria", region: "Ötztal", lat: 46.9664, lon: 10.9927, baseElevation: 1377, topElevation: 3340 },
  { slug: "ischgl", name: "Ischgl", country: "Austria", region: "Paznaun", lat: 47.0169, lon: 10.2925, baseElevation: 1377, topElevation: 2872 },
  { slug: "mayrhofen", name: "Mayrhofen", country: "Austria", region: "Zillertal", lat: 47.1667, lon: 11.8667, baseElevation: 630, topElevation: 2500 },
  { slug: "obergurgl", name: "Obergurgl-Hochgurgl", country: "Austria", region: "Ötztal", lat: 46.8697, lon: 11.0261, baseElevation: 1930, topElevation: 3082 },
  { slug: "saalbach", name: "Saalbach-Hinterglemm", country: "Austria", region: "Salzburgerland", lat: 47.3897, lon: 12.6383, baseElevation: 1003, topElevation: 2096 },
  { slug: "kaprun", name: "Zell am See-Kaprun", country: "Austria", region: "Salzburgerland", lat: 47.2431, lon: 12.6931, baseElevation: 757, topElevation: 3029 },

  // Italy
  { slug: "cortina", name: "Cortina d'Ampezzo", country: "Italy", region: "Dolomites", lat: 46.5405, lon: 12.1357, baseElevation: 1224, topElevation: 2930 },
  { slug: "livigno", name: "Livigno", country: "Italy", region: "Lombardy", lat: 46.5379, lon: 10.1358, baseElevation: 1816, topElevation: 3000 },
  { slug: "sestriere", name: "Sestriere", country: "Italy", region: "Piedmont", lat: 44.9578, lon: 6.8789, baseElevation: 2035, topElevation: 2823 },
  { slug: "madonna-di-campiglio", name: "Madonna di Campiglio", country: "Italy", region: "Dolomites", lat: 46.2306, lon: 10.8253, baseElevation: 1550, topElevation: 2600 },
  { slug: "val-gardena", name: "Val Gardena", country: "Italy", region: "Dolomites", lat: 46.5636, lon: 11.6756, baseElevation: 1236, topElevation: 2518 },
  { slug: "cervinia", name: "Cervinia", country: "Italy", region: "Aosta Valley", lat: 45.9308, lon: 7.6319, baseElevation: 2050, topElevation: 3883 },

  // Andorra
  { slug: "grandvalira", name: "Grandvalira", country: "Andorra", region: "Pyrenees", lat: 42.5763, lon: 1.6675, baseElevation: 1710, topElevation: 2640 },
  { slug: "vallnord", name: "Vallnord", country: "Andorra", region: "Pyrenees", lat: 42.5719, lon: 1.4886, baseElevation: 1550, topElevation: 2560 },

  // UK (Scotland)
  { slug: "cairngorm", name: "Cairngorm Mountain", country: "United Kingdom", region: "Scotland", lat: 57.1167, lon: -3.6425, baseElevation: 637, topElevation: 1097 },
  { slug: "glenshee", name: "Glenshee", country: "United Kingdom", region: "Scotland", lat: 56.8608, lon: -3.4256, baseElevation: 650, topElevation: 920 },
  { slug: "glencoe", name: "Glencoe Mountain", country: "United Kingdom", region: "Scotland", lat: 56.6389, lon: -4.9497, baseElevation: 300, topElevation: 1108 },
  { slug: "nevis-range", name: "Nevis Range", country: "United Kingdom", region: "Scotland", lat: 56.8181, lon: -5.0106, baseElevation: 650, topElevation: 1221 },
  { slug: "the-lecht", name: "The Lecht", country: "United Kingdom", region: "Scotland", lat: 57.1333, lon: -3.2333, baseElevation: 600, topElevation: 793 },
];

export const countries = [...new Set(resorts.map((r) => r.country))].sort();

export function getResortBySlug(slug: string): Resort | undefined {
  return resorts.find((r) => r.slug === slug);
}
