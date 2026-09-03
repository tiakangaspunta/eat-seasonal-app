/**
 * What satokausi.fi says about September, one entry per seasonal ingredient.
 *
 * satokausi splits a year into Varastosesonki, Sesongissa and Huippusesonki,
 * which map onto storageMonths, freshMonths and peakMonths. `bucket` is which
 * of those September fell in on that ingredient's own page
 * (satokausi.fi/raaka-aineet/<slug>/), transcribed for issue 004:
 *
 *   fresh             Sesongissa
 *   peak              Huippusesonki, which is also fresh
 *   storage           Varastosesonki
 *   imported          in season, but the origin shown was not Finland
 *   absent            the page lists September under no heading
 *   peak-only         Tia's data already has September as fresh; only
 *                     satokausi's peak marking is added
 *   already-verified  Tia's own data already covers September; left alone
 *   no-page           satokausi has no page for this ingredient
 */
export const SEPTEMBER_BY_INGREDIENT = {
  carrot: ['peak', 'porkkana'],
  potato: ['peak', 'peruna'],
  swede: ['peak', 'lanttu'],
  parsnip: ['peak', 'palsternakka'],
  celeriac: ['peak', 'juuriselleri-mukulaselleri'],
  'jerusalem-artichoke': ['peak', 'maa-artisokka'],
  'black-salsify': ['peak', 'mustajuuri'],
  'chioggia-beetroot': ['fresh', 'raitajuuri'],
  'yellow-beet': ['peak', 'keltajuuri'],
  horseradish: ['fresh', 'piparjuuri'],
  beetroot: ['absent', 'punajuuri'],
  turnip: ['absent', 'nauris'],
  'white-cabbage': ['peak', 'valkokaali-kerakaali'],
  'red-cabbage': ['fresh', 'punakaali'],
  'pointed-cabbage': ['fresh', 'suippokaali'],
  'brussels-sprout': ['fresh', 'ruusukaali'],
  cauliflower: ['storage', 'kukkakaali'],
  kale: ['peak', 'lehtikaali'],
  'napa-cabbage': ['peak', 'kiinankaali'],
  broccoli: ['peak', 'parsakaali-brokkoli'],
  'sprouting-broccoli': ['peak', 'varsiparsakaali'],
  spinach: ['fresh', 'pinaatti'],
  'bok-choy': ['peak-only', 'pinaattikiinankaali'],
  'yellow-onion': ['fresh', 'ruokasipuli-keltasipuli'],
  'red-onion': ['fresh', 'punasipuli'],
  shallot: ['fresh', 'salottisipuli'],
  garlic: ['peak', 'valkosipuli'],
  'spring-onion': ['fresh', 'kevatsipuli'],
  pumpkin: ['peak', 'kurpitsa'],
  'spaghetti-squash': ['fresh', 'spagettikurpitsa'],
  'butternut-squash': ['absent', 'myskikurpitsa'],
  tomato: ['fresh', 'tomaatti'],
  cucumber: ['fresh', 'kurkku'],
  eggplant: ['peak', 'munakoiso'],
  'bell-pepper': ['fresh', 'paprika'],
  'pointed-pepper': ['peak', 'suippopaprika'],
  'red-chili': ['peak', 'chili'],
  fennel: ['peak', 'salaattifenkoli'],
  'globe-artichoke': ['peak', 'latva-artisokka'],
  radish: ['peak', 'retiisi'],
  'green-beans': ['fresh', 'taitepapu-vihreapapu'],
  peas: ['absent', 'herne'],
  asparagus: ['absent', 'parsa'],
  'funnel-chanterelle': ['already-verified', 'suppilovahvero'],
  portobello: ['storage', 'portobello'],
  shiitake: ['storage', 'siitakesieni'],
  'button-mushroom': ['fresh', 'herkkusieni'],
  'oyster-mushroom': ['fresh', 'osterivinokas'],
  'false-morel': ['absent', 'korvasieni'],
  parsley: ['peak', 'persilja'],
  thyme: ['no-page', null],
  basil: ['no-page', null],
  coriander: ['no-page', null],
  apple: ['peak', 'omenat'],
  pear: ['fresh', 'paaryna'],
  strawberry: ['absent', 'mansikka'],
  banana: ['imported', 'banaani'],
  mango: ['imported', 'mango'],
  avocado: ['imported', 'avokado'],
  lemon: ['absent', 'sitruuna'],
  lime: ['absent', 'limetti'],
  orange: ['absent', 'appelsiini'],
  grapefruit: ['absent', 'greippi'],
  'blood-grapefruit': ['absent', 'verigreippi'],
  'blood-orange': ['absent', 'veriappelsiini'],
  mandarin: ['absent', 'mandariini'],
  kiwi: ['absent', 'kiivi'],
  papaya: ['absent', 'papaija'],
  pineapple: ['absent', 'ananas'],
  guava: ['absent', 'guava'],
  coconut: ['absent', 'kookospahkina'],
  ginger: ['absent', 'inkivaari'],
  'sweet-potato': ['absent', 'bataatti'],
}
