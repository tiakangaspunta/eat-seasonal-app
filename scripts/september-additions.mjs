/**
 * The September produce satokausi.fi's calendar page lists and we did not have.
 *
 * Read off `https://satokausi.fi/satokausikalenteri/` on 2026-09-11, narrowed to
 * the entries the page flags FIN, since the app is domestic by default. The
 * months themselves are not here: they come from each ingredient's own page,
 * parsed into `september-additions-source.json` by `satokausi-fetch.mjs`.
 *
 * Names follow the rule agreed with Tia: English where it is the word she would
 * use, Finnish where an English name would be invented or confusable.
 */
/** slug: [id, display name, category, Finnish search term if name is not Finnish] */
export const NEW_INGREDIENTS = {
  minttu: ['mint', 'Mint', 'herb', 'minttu'],
  tilli: ['dill', 'Dill', 'herb', 'tilli'],
  vihanneskrassi: ['garden-cress', 'Garden cress', 'herb', 'vihanneskrassi'],
  ruohosipuli: ['chives', 'Chives', 'herb', 'ruohosipuli'],

  romanesco: ['romanesco', 'Romanesco', 'vegetable', null],
  merikaali: ['sea-kale', 'Merikaali', 'vegetable', null],
  'kyssakaali-kaalirapi': ['kohlrabi', 'Kohlrabi', 'vegetable', 'kyssäkaali'],
  'kurttukaali-savoijinkaali': ['savoy-cabbage', 'Savoy cabbage', 'vegetable', 'savoijinkaali'],

  lehtisalaatti: ['leaf-lettuce', 'Leaf lettuce', 'vegetable', 'lehtisalaatti'],
  kerasalaatti: ['head-lettuce', 'Keräsalaatti', 'vegetable', null],
  jaavuorisalaatti: ['iceberg-lettuce', 'Iceberg lettuce', 'vegetable', 'jäävuorisalaatti'],
  jaasalaatti: ['ice-lettuce', 'Jääsalaatti', 'vegetable', null],
  'lollo-rosso': ['lollo-rosso', 'Lollo Rosso', 'vegetable', null],
  rucola: ['rocket', 'Rucola', 'vegetable', null],
  vuonankaali: ['lambs-lettuce', 'Vuonankaali', 'vegetable', null],
  salaattisikuri: ['chicory', 'Salaattisikuri', 'vegetable', null],
  endiivit: ['endive', 'Endiivi', 'vegetable', null],
  'lehtiselleri-varsiselleri': ['celery', 'Celery', 'vegetable', 'varsiselleri'],

  puolukka: ['lingonberry', 'Lingonberry', 'berry', 'puolukka'],
  karpalo: ['cranberry', 'Cranberry', 'berry', 'karpalo'],
  vadelma: ['raspberry', 'Raspberry', 'berry', 'vadelma'],
  karhunvatukka: ['blackberry', 'Blackberry', 'berry', 'karhunvatukka'],
  juolukka: ['bog-bilberry', 'Juolukka', 'berry', null],
  variksenmarja: ['crowberry', 'Variksenmarja', 'berry', null],
  tyrnimarja: ['sea-buckthorn', 'Tyrnimarja', 'berry', null],
  pihlajanmarja: ['rowanberry', 'Pihlajanmarja', 'berry', null],
  ruusunmarja: ['rosehip', 'Ruusunmarja', 'berry', null],
  'marja-aronia': ['aronia', 'Marja-aronia', 'berry', null],
  katajanmarja: ['juniper-berry', 'Katajanmarja', 'berry', null],
  lillukka: ['stone-bramble', 'Lillukka', 'berry', null],
  riekonmarja: ['bearberry', 'Riekonmarja', 'berry', null],

  kriikuna: ['damson', 'Kriikuna', 'fruit', null],
  vesimeloni: ['watermelon', 'Watermelon', 'fruit', 'vesimeloni'],

  tatit: ['bolete', 'Tatit', 'mushroom', null],
  mustatorvisieni: ['black-trumpet', 'Mustatorvisieni', 'mushroom', null],
  'matsutake-tuoksuvalmuska': ['matsutake', 'Matsutake', 'mushroom', null],

  kesakurpitsa: ['courgette', 'Kesäkurpitsa', 'vegetable', null],
  patissionkurpitsa: ['pattypan-squash', 'Patissonkurpitsa', 'vegetable', null],
  hokkaidokurpitsa: ['hokkaido-squash', 'Hokkaido squash', 'vegetable', 'hokkaidokurpitsa'],

  vahapapu: ['wax-bean', 'Wax bean', 'vegetable', 'vahapapu'],

  pihvitomaatti: ['beef-tomato', 'Beef tomato', 'vegetable', 'pihvitomaatti'],
  kirsikkatomaatti: ['cherry-tomato', 'Cherry tomato', 'vegetable', 'kirsikkatomaatti'],

  purjosipuli: ['leek', 'Purjo', 'vegetable', null],
  ryvassipuli: ['potato-onion', 'Ryvässipuli', 'vegetable', null],
  hopeasipuli: ['silverskin-onion', 'Hopeasipuli', 'vegetable', null],
  jattisipuli: ['giant-onion', 'Jättisipuli', 'vegetable', null],

  retikka: ['mooli', 'Retikka', 'vegetable', null],
  valkojuurikas: ['white-beet', 'Valkojuurikas', 'vegetable', null],
  juuripersilja: ['root-parsley', 'Juuripersilja', 'vegetable', null],
}

/** Already in data/, filed with no season at all. Its months stay drafted. */
export const HARKAPAPU = { slug: 'harkapapu', id: 'broad-bean', category: 'vegetable' }


