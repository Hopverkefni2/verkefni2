'use strict';

lucide.createIcons();

const form = document.getElementById('newsletter-form');
const wrap = document.getElementById('newsletter-wrap');
const emailInput = document.getElementById('email');
const errorMsg = document.getElementById('email-error');

// Newsletter exists only on the homepage
if (form) form.addEventListener('submit', (event) => {
  event.preventDefault();

  const value = emailInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!isValid) {
    errorMsg.hidden = false;
    emailInput.setAttribute('aria-invalid', 'true');
    emailInput.focus();
    return;
  }

  const thanks = document.createElement('p');
  thanks.className = 'newsletter-thanks';
  thanks.setAttribute('role', 'status');
  thanks.textContent = 'Takk fyrir! Þú ert nú skráð/ur á póstlistann.';
  wrap.replaceChildren(thanks);
});

/* ===== Business data and favorites (shared by all pages) ===== */
const businesses = [
  { id: 'sapugerd', name: 'Sápugerð.is', location: 'Reykjavík', category: 'snyrti', storeType: 'bæði', tags: ['handgert', 'gjafir'], description: 'Handgerðar sápur úr náttúrulegum hráefnum', image: 'images/fyrirtaeki/sapugerd.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Sápugerð.is býr til handgerðar sápur úr náttúrulegum hráefnum eins og íslenskum jurtum, ólífuolíu og shea-smjöri. Hver sápa er mótuð í höndunum og látin þroskast í nokkrar vikur áður en hún fer í sölu. Hér finnur þú einnig krem, varasalva og fallegar gjafapakkningar. Allt er framleitt í litlum upplögum í Reykjavík.',
    address: 'Skólavörðustígur 18', postcode: '101 Reykjavík', hours: ['Mán–Fös 10–18', 'Lau 11–16'],
    gallery: ['images/fyrirtaeki/sapugerd-1.jpg', 'images/fyrirtaeki/sapugerd-2.jpg'], rating: 4.7, reviewCount: 18,
    reviews: [
      { name: 'Helga M.', date: 'fyrir 1 viku', stars: 5, text: 'Lavender-sápan er dásamleg og húðin mín þakkar fyrir sig.' },
      { name: 'Jón P.', date: 'fyrir 3 vikum', stars: 5, text: 'Keypti gjafapakka handa mömmu og hún var í skýjunum.' },
      { name: 'Katrín L.', date: 'fyrir 2 mánuðum', stars: 4, text: 'Frábærar vörur, ilmurinn mætti vera aðeins sterkari.' },
    ] },
  { id: 'skart-og-co', name: 'Skart og Co', location: 'Hafnarfjörður', category: 'skartgripir', storeType: 'verslun', tags: ['skartgripir', 'handgert', 'gjafir'], description: 'Handsmíðaðir hringir og skartgripir', image: 'images/fyrirtaeki/skartogco.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Skart og Co er lítil gullsmiðja í hjarta Hafnarfjarðar þar sem hver gripur er handsmíðaður frá grunni. Við vinnum með silfur, gull og íslenskan stein og tökum líka að okkur sérsmíði. Hringir, hálsmen og eyrnalokkar eru hönnuð með tímalausa fegurð í huga. Komdu í heimsókn og finndu skart sem segir þína sögu.',
    address: 'Strandgata 25', postcode: '220 Hafnarfjörður', hours: ['Mán–Fös 11–17', 'Lau 12–16'],
    gallery: ['images/fyrirtaeki/skart-og-co-1.jpg', 'images/fyrirtaeki/skart-og-co-2.jpg'], rating: 4.9, reviewCount: 23,
    reviews: [
      { name: 'Ragnheiður A.', date: 'fyrir 2 vikum', stars: 5, text: 'Fékk sérsmíðaðan trúlofunarhring og hann er fullkominn.' },
      { name: 'Davíð K.', date: 'fyrir 1 mánuði', stars: 5, text: 'Persónuleg þjónusta og vönduð vinna. Mæli heils hugar með.' },
      { name: 'Elín S.', date: 'fyrir 3 mánuðum', stars: 5, text: 'Fallegustu eyrnalokkar sem ég hef átt.' },
    ] },
  { id: 'vintaj', name: 'Vintaj', location: 'Reykjavík', category: 'fatnadur', storeType: 'verslun', tags: ['tiska'], description: 'Notuð föt og vintage gersemar', image: 'images/fyrirtaeki/vintaj.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Vintaj selur notuð föt og vintage gersemar sem fá nýtt líf. Hér finnur þú vandlega valdar flíkur frá áttunda, níunda og tíunda áratugnum, ásamt töskum og fylgihlutum. Allt er yfirfarið og í góðu ástandi. Að kaupa notað er góð leið til að klæða sig persónulega og fara vel með jörðina.',
    address: 'Hverfisgata 40', postcode: '101 Reykjavík', hours: ['Mán–Fös 12–18', 'Lau & Sun 12–17'],
    gallery: ['images/fyrirtaeki/vintaj-1.jpg', 'images/fyrirtaeki/vintaj-2.jpg'], rating: 4.5, reviewCount: 31,
    reviews: [
      { name: 'Birna H.', date: 'fyrir 1 viku', stars: 5, text: 'Fann ótrúlega fallega leðurjakka á frábæru verði.' },
      { name: 'Óskar T.', date: 'fyrir 1 mánuði', stars: 4, text: 'Skemmtilegt úrval og vingjarnlegt starfsfólk.' },
      { name: 'Hildur G.', date: 'fyrir 2 mánuðum', stars: 4, text: 'Gaman að gramsa hér. Stærðirnar eru misjafnar en alltaf eitthvað að finna.' },
    ] },
  { id: 'graent', name: 'Grænt', location: 'Kópavogur', category: 'matur', storeType: 'bæði', tags: [], description: 'Ferskt grænmeti og ávextir beint frá bónda', image: 'images/fyrirtaeki/graent.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Grænt selur ferskt grænmeti og ávexti beint frá íslenskum bændum. Við veljum vörur eftir árstíðum og leggjum áherslu á lífræna ræktun og stuttar flutningsleiðir. Þú getur komið við í versluninni í Hamraborg eða pantað kassa heim að dyrum. Ferskleikinn skiptir okkur öllu máli.',
    address: 'Hamraborg 10', postcode: '200 Kópavogur', hours: ['Mán–Fös 9–18', 'Lau 10–14'],
    gallery: ['images/fyrirtaeki/graent-1.jpg', 'images/fyrirtaeki/graent-2.jpg'], rating: 4.6, reviewCount: 14,
    reviews: [
      { name: 'Stefán R.', date: 'fyrir 2 vikum', stars: 5, text: 'Tómatarnir eru þeir bestu sem ég hef smakkað á Íslandi.' },
      { name: 'Margrét Ó.', date: 'fyrir 1 mánuði', stars: 5, text: 'Þægilegt að fá grænmetiskassa heim og alltaf ferskt.' },
      { name: 'Tómas B.', date: 'fyrir 3 mánuðum', stars: 4, text: 'Gott verð og fínt úrval, mætti hafa opið lengur.' },
    ] },
  { id: 'margt-og-fleira', name: 'Margt og fleira', location: 'Akureyri', category: 'heimilid', storeType: 'verslun', tags: ['gjafir', 'baekur', 'heimilid'], description: 'Smávörur, gjafir og bækur fyrir heimilið', image: 'images/fyrirtaeki/margtogfleira.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Margt og fleira er notaleg verslun á Akureyri með smávörur, gjafir og bækur fyrir heimilið. Hér finnur þú allt frá kertum og keramiki til barnabóka og íslenskra skáldsagna. Við veljum vörurnar af kostgæfni og aðstoðum gjarnan við að finna rétta gjöfina. Kíktu í heimsókn og gefðu þér tíma til að skoða.',
    address: 'Hafnarstræti 94', postcode: '600 Akureyri', hours: ['Mán–Fös 10–18', 'Lau 10–16'],
    gallery: ['images/fyrirtaeki/margt-og-fleira-1.jpg', 'images/fyrirtaeki/margt-og-fleira-2.jpg'], rating: 4.4, reviewCount: 12,
    reviews: [
      { name: 'Sigrún V.', date: 'fyrir 3 vikum', stars: 5, text: 'Yndisleg búð og alltaf hægt að finna fallega gjöf.' },
      { name: 'Arnar F.', date: 'fyrir 1 mánuði', stars: 4, text: 'Gott bókaúrval og notalegt andrúmsloft.' },
      { name: 'Lilja D.', date: 'fyrir 2 mánuðum', stars: 4, text: 'Frábær þjónusta, verðin mættu vera aðeins lægri.' },
    ] },
  { id: 'bakad', name: 'Bakað', location: 'Reykjavík', category: 'matur', storeType: 'bæði', tags: ['handgert'], description: 'Notalegt bakarí með nýbökuðu brauði', image: 'images/bakad.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Bakað er notalegt bakarí þar sem ástríða fyrir bakstri, gæðahráefni og íslenskri hefð mætast. Hér er allt bakað af alúð, frá nýbökuðu súrdeigsbrauði til ljúffengra kanilsnúða og sætabrauðs. Markmið Bakað er einfalt: að færa fólki smá gleði í hversdaginn, einn bita í einu.',
    address: 'Laugavegur 52', postcode: '101 Reykjavík', hours: ['Mán–Fös 10–19', 'Lau & Sun 12–16'],
    gallery: ['images/bakad/braud1.jpg', 'images/bakad/braud2.jpg'], rating: 4.8, reviewCount: 20,
    reviews: [
      { name: 'Anna J.', date: 'fyrir 2 vikum', stars: 5, text: 'Besta súrdeigsbrauð sem ég hef smakkað. Notalegt andrúmsloft og frábær þjónusta.' },
      { name: 'Gunnar S.', date: 'fyrir 1 mánuði', stars: 5, text: 'Kanilsnúðarnir eru ómótstæðilegir. Kem hingað alltaf á laugardögum.' },
      { name: 'Sara B.', date: 'fyrir 2 mánuðum', stars: 4, text: 'Gott úrval og fallegt bakarí. Stundum smá biðröð en það er þess virði.' },
    ] },
  { id: 'kaffihusid', name: 'Kaffihúsið', location: 'Reykjavík', category: 'matur', storeType: 'verslun', tags: [], description: 'Notalegt kaffihús í miðbænum', image: 'images/fyrirtaeki/kaffihus.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Kaffihúsið er notalegt kaffihús í miðbæ Reykjavíkur þar sem gott er að setjast niður með bolla og bók. Við brennum og malum baunirnar sjálf og bjóðum líka heimabakað meðlæti og létta rétti. Hér hittast heimamenn og ferðalangar í rólegu og vinalegu umhverfi. Verið velkomin í kaffi.',
    address: 'Austurstræti 6', postcode: '101 Reykjavík', hours: ['Mán–Fös 8–20', 'Lau & Sun 9–20'],
    gallery: ['images/fyrirtaeki/kaffihusid-1.jpg', 'images/fyrirtaeki/kaffihusid-2.jpg'], rating: 4.5, reviewCount: 27,
    reviews: [
      { name: 'Þórunn E.', date: 'fyrir 1 viku', stars: 5, text: 'Besta kaffið í bænum og kakan er himnesk.' },
      { name: 'Páll I.', date: 'fyrir 1 mánuði', stars: 4, text: 'Notalegt og rólegt, fullkomið til að vinna í fartölvunni.' },
      { name: 'Eva N.', date: 'fyrir 2 mánuðum', stars: 5, text: 'Vinalegt starfsfólk og góður matur í hádeginu.' },
    ] },
  { id: 'hjolabudin', name: 'Hjólabúðin', location: 'Hafnarfjörður', category: 'heimilid', storeType: 'bæði', tags: [], description: 'Hjól, varahlutir og viðgerðir', image: 'images/fyrirtaeki/hjol.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Hjólabúðin í Hafnarfirði býður hjól fyrir alla aldurshópa, varahluti og fylgihluti. Á verkstæðinu okkar sjáum við um allt frá einföldum stillingum til stærri viðgerða. Starfsfólkið er hjólreiðafólk sjálft og gefur góð ráð um val á hjóli. Hvort sem þú hjólar til vinnu eða í fjallaferðir getum við aðstoðað.',
    address: 'Reykjavíkurvegur 66', postcode: '220 Hafnarfjörður', hours: ['Mán–Fös 10–18', 'Lau 11–15'],
    gallery: ['images/fyrirtaeki/hjolabudin-1.jpg', 'images/fyrirtaeki/hjolabudin-2.jpg'], rating: 4.6, reviewCount: 16,
    reviews: [
      { name: 'Ólafur H.', date: 'fyrir 2 vikum', stars: 5, text: 'Fljót og góð viðgerð, hjólið er eins og nýtt.' },
      { name: 'Freyja M.', date: 'fyrir 1 mánuði', stars: 4, text: 'Fékk góð ráð við kaup á fyrsta rafmagnshjólinu mínu.' },
      { name: 'Kristján A.', date: 'fyrir 3 mánuðum', stars: 5, text: 'Sanngjörn verð og frábær þjónusta.' },
    ] },
  { id: 'fegurd', name: 'Fegurð', location: 'Akureyri', category: 'snyrti', storeType: 'netverslun', tags: ['gjafir'], description: 'Snyrtivörur og húðumhirða', image: 'images/fyrirtaeki/fegurd.jpg', website: '#', instagram: '#', facebook: '#',
    about: 'Fegurð er netverslun á Akureyri með snyrtivörur og húðumhirðu fyrir öll tækifæri. Við veljum mildar og vandaðar vörur sem henta íslenskri veðráttu og viðkvæmri húð. Pantanir eru sendar hratt um allt land og við pökkum fallega, líka sem gjafir. Láttu þér líða vel í eigin skinni.',
    address: '', postcode: '', hours: ['Netverslun opin allan sólarhringinn', 'Afgreiðsla pantana mán–fös'],
    gallery: ['images/fyrirtaeki/fegurd-1.jpg', 'images/fyrirtaeki/fegurd-2.jpg'], rating: 4.8, reviewCount: 22,
    reviews: [
      { name: 'Alda P.', date: 'fyrir 1 viku', stars: 5, text: 'Húðin mín hefur aldrei verið betri og sendingin kom daginn eftir.' },
      { name: 'Hrafnhildur Ö.', date: 'fyrir 1 mánuði', stars: 5, text: 'Falleg pökkun og frábærar vörur í gjöf.' },
      { name: 'Bjarki Þ.', date: 'fyrir 2 mánuðum', stars: 4, text: 'Gott úrval og einfalt að panta.' },
    ] },
];

const CATEGORY_NAMES = {
  all: 'Allt',
  snyrti: 'Snyrti & Heilsuvörur',
  fatnadur: 'Fatnaður',
  heimilid: 'Heimilið',
  skartgripir: 'Skartgripir',
  matur: 'Matur og Drykkir',
};

const FAVORITES_KEY = 'tint-favorites';
let memoryFavorites = []; // fallback when localStorage is unavailable

const getFavorites = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [...memoryFavorites];
  }
};

const isFavorite = (id) => getFavorites().includes(id);

// Returns the new favorite state of the business
const toggleFavorite = (id) => {
  const current = getFavorites();
  const nowFavorite = !current.includes(id);
  const next = nowFavorite ? [...current, id] : current.filter((x) => x !== id);
  memoryFavorites = next;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    // Keep the in-memory copy
  }
  updateFavoritesBadge();
  return nowFavorite;
};

// Runs on changes made in other tabs and when a page is restored from the back/forward cache
const onFavoritesChange = (callback) => {
  window.addEventListener('storage', (event) => {
    if (event.key === FAVORITES_KEY || event.key === null) callback();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) callback();
  });
};

// Header counter next to the heart in the nav
const favoritesLink = document.querySelector('.nav-link[href="favorites.html"]');

const updateFavoritesBadge = () => {
  if (!favoritesLink) return;
  let badge = favoritesLink.querySelector('.fav-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'fav-badge';
    badge.setAttribute('aria-hidden', 'true');
    favoritesLink.append(badge);
  }
  const total = getFavorites().length;
  badge.textContent = total;
  badge.hidden = total === 0;
  if (total > 0) favoritesLink.setAttribute('aria-label', `Uppáhald, ${total} vistuð`);
  else favoritesLink.removeAttribute('aria-label');
};

updateFavoritesBadge();
onFavoritesChange(updateFavoritesBadge);

const setHeartState = (button, on) => {
  const business = businesses.find((b) => b.id === button.dataset.id);
  button.classList.toggle('is-favorite', on);
  button.setAttribute('aria-pressed', String(on));
  button.setAttribute('aria-label', on ? `Fjarlægja ${business.name} úr uppáhaldi` : `Bæta ${business.name} í uppáhald`);
};

const popHeart = (button) => {
  button.classList.remove('is-pop');
  void button.offsetWidth; // restart the animation
  button.classList.add('is-pop');
  button.addEventListener('animationend', () => button.classList.remove('is-pop'), { once: true });
};

// Card used on both the explore and favorites pages
const profileUrl = (b) => 'fyrirtaeki-sida.html?id=' + b.id;
const cardHtml = (b) => {
  const fav = isFavorite(b.id);
  const label = fav ? `Fjarlægja ${b.name} úr uppáhaldi` : `Bæta ${b.name} í uppáhald`;
  return `
    <article class="fav-card explore-card" data-id="${b.id}">
      <div class="fav-img explore-img">
        <a href="${profileUrl(b)}" class="explore-img-link">
          <img src="${b.image}" alt="Mynd frá ${b.name}: ${b.description}" loading="lazy">
        </a>
        <button type="button" class="fav-heart${fav ? ' is-favorite' : ''}" data-id="${b.id}" aria-pressed="${fav}" aria-label="${label}"><i data-lucide="heart" aria-hidden="true"></i></button>
      </div>
      <p class="small fav-location">${b.location}</p>
      <div class="fav-row">
        <h2 class="business-name"><a href="${profileUrl(b)}">${b.name}</a></h2>
        <a href="${b.website}" class="fav-link" aria-label="Vefsíða ${b.name}">Vefsíða <i data-lucide="external-link" aria-hidden="true"></i></a>
      </div>
      <p class="small">${b.description}</p>
    </article>`;
};

/* ===== Search (shared by all pages) ===== */
const STORE_TYPE_NAMES = { verslun: 'Verslun', netverslun: 'Netverslun', 'bæði': 'Verslun & netverslun' };
const TAG_NAMES = {
  baekur: 'Bækur',
  gjafir: 'Gjafavörur',
  heimilid: 'Heimilið',
  handgert: 'Handgert',
  skartgripir: 'Skartgripir',
  tiska: 'Tíska',
};

// Lowercase and strip accents so "bakad" matches "Bakað"
const normalizeText = (text) => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ð/g, 'd')
  .replace(/þ/g, 'th')
  .replace(/æ/g, 'ae')
  .replace(/ö/g, 'o');

const escapeHtml = (text) => text.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

// Every word must match somewhere; name matches come first
const searchBusinesses = (query) => {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const matched = [];
  businesses.forEach((b) => {
    const name = normalizeText(b.name);
    const details = normalizeText([
      b.location,
      CATEGORY_NAMES[b.category],
      STORE_TYPE_NAMES[b.storeType],
      ...b.tags.map((tag) => TAG_NAMES[tag]),
      b.description,
    ].join(' '));
    if (words.every((word) => name.includes(word) || details.includes(word))) {
      matched.push({ business: b, inName: words.some((word) => name.includes(word)) });
    }
  });
  return matched.sort((a, b) => Number(b.inName) - Number(a.inName)).map((m) => m.business);
};

// Bold the parts of the name that match the query
const highlightName = (name, query) => {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  const chars = name.split('');
  let normalized = '';
  const origin = [];
  chars.forEach((char, index) => {
    const part = normalizeText(char);
    normalized += part;
    for (let i = 0; i < part.length; i += 1) origin.push(index);
  });

  const marked = new Array(chars.length).fill(false);
  words.forEach((word) => {
    let from = normalized.indexOf(word);
    while (from !== -1) {
      for (let i = from; i < from + word.length; i += 1) marked[origin[i]] = true;
      from = normalized.indexOf(word, from + word.length);
    }
  });

  return chars.map((char, i) => (marked[i] ? `<strong>${escapeHtml(char)}</strong>` : escapeHtml(char))).join('');
};

const searchForm = document.querySelector('form.search');
const searchInput = document.getElementById('search-input');
let closeSearchDropdown = () => {};

if (searchForm && searchInput) {
  const MAX_SUGGESTIONS = 6;
  const dropdown = document.createElement('div');
  dropdown.className = 'search-dd';
  dropdown.id = 'search-dd';
  dropdown.setAttribute('role', 'listbox');
  dropdown.setAttribute('aria-label', 'Tillögur að fyrirtækjum');
  dropdown.hidden = true;
  searchForm.append(dropdown);

  searchInput.setAttribute('role', 'combobox');
  searchInput.setAttribute('aria-autocomplete', 'list');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.setAttribute('aria-controls', 'search-dd');

  let activeIndex = -1;
  let timer;

  const getOptions = () => [...dropdown.querySelectorAll('a[role="option"]')];

  closeSearchDropdown = () => {
    dropdown.hidden = true;
    activeIndex = -1;
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.removeAttribute('aria-activedescendant');
  };

  const setActive = (index) => {
    const options = getOptions();
    activeIndex = index;
    options.forEach((option, i) => {
      option.classList.toggle('is-active', i === index);
      option.setAttribute('aria-selected', String(i === index));
    });
    if (index >= 0) {
      searchInput.setAttribute('aria-activedescendant', options[index].id);
      options[index].scrollIntoView({ block: 'nearest' });
    } else {
      searchInput.removeAttribute('aria-activedescendant');
    }
  };

  const renderSuggestions = () => {
    const query = searchInput.value.trim();
    if (!query) {
      closeSearchDropdown();
      return;
    }

    const shown = searchBusinesses(query).slice(0, MAX_SUGGESTIONS);
    const safeQuery = escapeHtml(query);

    if (shown.length === 0) {
      dropdown.innerHTML = `<p class="search-dd-empty">Engin fyrirtæki fundust fyrir „${safeQuery}“</p>`;
    } else {
      const rows = shown.map((b, i) => `
        <a href="fyrirtaeki-sida.html?id=${b.id}" class="search-dd-row" role="option" id="search-opt-${i}" aria-selected="false">
          <img class="search-dd-thumb" src="${b.image}" alt="">
          <span class="search-dd-text">
            <span class="search-dd-name">${highlightName(b.name, query)}</span>
            <span class="search-dd-meta">${CATEGORY_NAMES[b.category]} · ${b.location}</span>
          </span>
        </a>`).join('');
      dropdown.innerHTML = `${rows}
        <a href="fyrirtaeki.html?leit=${encodeURIComponent(query)}" class="search-dd-all" role="option" id="search-opt-${shown.length}" aria-selected="false">
          <span>Sjá allar niðurstöður fyrir „${safeQuery}“</span>
          <i data-lucide="arrow-right" aria-hidden="true"></i>
        </a>`;
    }

    dropdown.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
    setActive(-1);
    lucide.createIcons();
  };

  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(renderSuggestions, 150);
  });

  searchInput.addEventListener('keydown', (event) => {
    if (dropdown.hidden) return;
    const options = getOptions();

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (options.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((activeIndex + step + options.length) % options.length);
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      options[activeIndex].click();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeSearchDropdown();
    }
  });

  document.addEventListener('click', (event) => {
    if (!searchForm.contains(event.target)) closeSearchDropdown();
  });
}

/* ===== Favorites page ===== */
const favGrid = document.getElementById('fav-grid');

if (favGrid) {
  const filtersEl = document.getElementById('fav-filters');
  const emptyBox = document.getElementById('fav-empty');
  let activeFilter = 'all';

  const render = () => {
    const saved = businesses.filter((b) => isFavorite(b.id));
    const countFor = (category) => (category === 'all' ? saved.length : saved.filter((b) => b.category === category).length);
    if (countFor(activeFilter) === 0) activeFilter = 'all';

    const isEmpty = saved.length === 0;
    filtersEl.hidden = isEmpty;
    favGrid.hidden = isEmpty;
    emptyBox.hidden = !isEmpty;

    filtersEl.innerHTML = Object.entries(CATEGORY_NAMES)
      .filter(([category]) => category === 'all' || countFor(category) > 0)
      .map(([category, label]) => {
        const active = category === activeFilter;
        return `<button type="button" class="pill-filter${active ? ' is-active' : ''}" data-filter="${category}" aria-pressed="${active}">${label} (${countFor(category)})</button>`;
      })
      .join('');

    const shown = saved.filter((b) => activeFilter === 'all' || b.category === activeFilter);
    favGrid.innerHTML = shown.map(cardHtml).join('');
    lucide.createIcons();
  };

  filtersEl.addEventListener('click', (event) => {
    const pill = event.target.closest('.pill-filter');
    if (!pill) return;
    activeFilter = pill.dataset.filter;
    render();
  });

  favGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.fav-heart');
    if (!button) return;
    toggleFavorite(button.dataset.id);
    const card = button.closest('.fav-card');
    card.classList.add('is-removing');
    setTimeout(render, 300);
  });

  onFavoritesChange(render);
  render();
}

/* ===== Shared form validation (application and contact pages) ===== */
const REQUIRED_MSG = 'Þetta svæði er nauðsynlegt';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const showError = (control, id, message) => {
  const error = document.getElementById(id);
  error.textContent = message;
  error.hidden = false;
  control?.classList.add('has-error');
  control?.setAttribute('aria-invalid', 'true');
};

const clearError = (control, id) => {
  const error = document.getElementById(id);
  if (!error) return;
  error.hidden = true;
  control?.classList.remove('has-error');
  control?.removeAttribute('aria-invalid');
};

const fieldMessage = (control) => {
  const value = control.value.trim();
  if (control.required && !value) return REQUIRED_MSG;
  if (!value) return '';
  if (control.type === 'email' && !EMAIL_RE.test(value)) return 'Vinsamlegast sláðu inn gilt netfang';
  if (control.type === 'url' && !control.checkValidity()) return 'Vinsamlegast sláðu inn gilt veffang';
  if (control.type === 'number' && !control.checkValidity()) return 'Vinsamlegast sláðu inn gilda tölu';
  if (control.minLength > 0 && value.length < control.minLength) return control.dataset.minMessage;
  return '';
};

// Validates fields, shows errors and returns the invalid controls
const validateControls = (controls) => {
  const invalid = [];
  controls.forEach((control) => {
    const message = fieldMessage(control);
    if (message) {
      showError(control, `${control.id}-error`, message);
      invalid.push(control);
    } else {
      clearError(control, `${control.id}-error`);
    }
  });
  return invalid;
};

// Clear a field's error once the user edits it
const watchControls = (controls) => {
  controls.forEach((control) => {
    const clear = () => clearError(control, `${control.id}-error`);
    control.addEventListener('input', clear);
    control.addEventListener('change', clear);
  });
};

const focusFirstError = (invalid) => {
  invalid.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  invalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  invalid[0].focus({ preventScroll: true });
};

/* ===== Application page ===== */
const applyForm = document.getElementById('apply-form');

if (applyForm) {
  const toggles = applyForm.querySelectorAll('.toggle');
  const addressInput = document.getElementById('address');
  const consentInput = document.getElementById('consent');
  const fileInput = document.getElementById('images');
  const uploadArea = document.getElementById('upload-area');
  const thumbs = document.getElementById('thumbs');
  const controls = [...applyForm.querySelectorAll('input:not([type="file"]):not([type="checkbox"]), select, textarea')];
  let selectedFiles = [];

  const isStoreSelected = () => document.getElementById('toggle-store').getAttribute('aria-pressed') === 'true';

  // Toggle buttons
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const pressed = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', String(!pressed));
      addressInput.required = isStoreSelected();
      clearError(null, 'type-error');
      if (!isStoreSelected()) clearError(addressInput, 'address-error');
    });
  });

  // Clear errors once the user edits a field
  watchControls(controls);
  consentInput.addEventListener('change', () => clearError(consentInput, 'consent-error'));

  // Image upload
  const renderThumbs = () => {
    thumbs.replaceChildren(...selectedFiles.map((file, index) => {
      const item = document.createElement('li');
      item.className = 'thumb';

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      img.addEventListener('load', () => URL.revokeObjectURL(img.src));

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'thumb-remove';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Fjarlægja ${file.name}`);
      remove.addEventListener('click', () => {
        selectedFiles.splice(index, 1);
        renderThumbs();
      });

      item.append(img, remove);
      return item;
    }));
  };

  const addFiles = (files) => {
    const images = [...files].filter((file) => file.type.startsWith('image/'));
    selectedFiles = selectedFiles.concat(images);
    renderThumbs();
  };

  fileInput.addEventListener('change', () => {
    addFiles(fileInput.files);
    fileInput.value = '';
  });

  ['dragenter', 'dragover'].forEach((type) => {
    uploadArea.addEventListener(type, (event) => {
      event.preventDefault();
      uploadArea.classList.add('is-dragover');
    });
  });
  ['dragleave', 'drop'].forEach((type) => {
    uploadArea.addEventListener(type, () => uploadArea.classList.remove('is-dragover'));
  });
  uploadArea.addEventListener('drop', (event) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  });

  // Submit and validation
  applyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = validateControls(controls);

    if (![...toggles].some((t) => t.getAttribute('aria-pressed') === 'true')) {
      showError(null, 'type-error', 'Veldu að minnsta kosti einn möguleika');
      invalid.push(toggles[0]);
    }

    if (!consentInput.checked) {
      showError(consentInput, 'consent-error', 'Þú þarft að samþykkja til að halda áfram');
      invalid.push(consentInput);
    }

    if (invalid.length) {
      focusFirstError(invalid);
      return;
    }

    const thanks = document.createElement('div');
    thanks.className = 'apply-thanks';
    thanks.setAttribute('role', 'status');
    thanks.innerHTML = `
      <h2 class="section-heading">Takk fyrir umsóknina!</h2>
      <p class="body-text">Við förum yfir umsóknina og höfum samband fljótlega.</p>
      <a href="index.html" class="btn">Til baka á forsíðu <i data-lucide="arrow-right" aria-hidden="true"></i></a>`;
    document.getElementById('apply-box').replaceChildren(thanks);
    lucide.createIcons();
    thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ===== Explore page ===== */
const exploreGrid = document.getElementById('explore-grid');

if (exploreGrid) {
  const TAGS = [
    ['baekur', 'Bækur'],
    ['gjafir', 'Gjafavörur'],
    ['heimilid', 'Heimilið'],
    ['handgert', 'Handgert'],
    ['skartgripir', 'Skartgripir'],
    ['tiska', 'Tíska'],
  ];

  const DEFAULT_LABELS = { location: 'Staðsetning', type: 'Tegund verslunar', more: 'Fleiri síur' };
  const SORT_LABELS = { asc: 'Raða eftir nafni (A–Ö)', desc: 'Raða eftir nafni (Ö–A)' };

  const state = { category: 'all', location: 'all', type: 'all', sort: 'none', tags: new Set(), query: '' };

  const pills = document.querySelectorAll('.explore-pills .pill-filter');
  const dropdowns = document.querySelectorAll('.explore-dd');
  const heading = document.getElementById('explore-heading');
  const count = document.getElementById('explore-count');
  const emptyBox = document.getElementById('explore-empty');
  const tagFieldsets = document.querySelectorAll('[data-tags]');

  const matches = (b) =>
    (state.category === 'all' || b.category === state.category) &&
    (state.location === 'all' || b.location === state.location) &&
    (state.type === 'all' || b.storeType === 'bæði' || b.storeType === state.type) &&
    (state.tags.size === 0 || b.tags.some((tag) => state.tags.has(tag)));

  const render = () => {
    const query = state.query.trim();
    const found = query ? searchBusinesses(query) : businesses;
    const result = found.filter(matches);
    if (state.sort !== 'none') {
      const dir = state.sort === 'asc' ? 1 : -1;
      result.sort((a, b) => dir * a.name.localeCompare(b.name, 'is'));
    }
    searchStatus.hidden = !query;
    if (query) searchStatusText.textContent = `Niðurstöður fyrir „${query}“ (${result.length})`;

    heading.textContent = CATEGORY_NAMES[state.category];
    count.textContent = `${result.length} fyrirtæki`;
    exploreGrid.innerHTML = result.map(cardHtml).join('');
    exploreGrid.hidden = result.length === 0;
    emptyBox.hidden = result.length > 0;
    lucide.createIcons();
  };

  // Toggle the heart in place so the card keeps its position
  exploreGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.fav-heart');
    if (!button) return;
    setHeartState(button, toggleFavorite(button.dataset.id));
    popHeart(button);
  });

  const syncHearts = () => {
    exploreGrid.querySelectorAll('.fav-heart').forEach((button) => {
      setHeartState(button, isFavorite(button.dataset.id));
    });
  };
  onFavoritesChange(syncHearts);

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (state.category !== 'all') params.set('flokkur', state.category);
    if (state.query.trim()) params.set('leit', state.query.trim());
    const queryString = params.toString();
    history.replaceState(null, '', queryString ? '?' + queryString : window.location.pathname);
  };

  const syncPills = () => {
    pills.forEach((pill) => {
      const active = pill.dataset.category === state.category;
      pill.classList.toggle('is-active', active);
      pill.setAttribute('aria-pressed', String(active));
    });
  };

  const syncDropdownLabels = () => {
    const labels = {
      location: state.location === 'all' ? DEFAULT_LABELS.location : state.location,
      type: state.type === 'all' ? DEFAULT_LABELS.type : { verslun: 'Verslun', netverslun: 'Netverslun' }[state.type],
      more: state.sort === 'none' ? DEFAULT_LABELS.more : SORT_LABELS[state.sort],
    };
    dropdowns.forEach((dd) => {
      dd.querySelector('.explore-dd-label').textContent = labels[dd.dataset.dd];
    });
  };

  const syncTags = () => {
    document.querySelectorAll('[data-tags] input').forEach((input) => {
      input.checked = state.tags.has(input.value);
    });
  };

  const closeDropdowns = (except) => {
    dropdowns.forEach((dd) => {
      if (dd === except) return;
      dd.querySelector('.explore-dd-btn').setAttribute('aria-expanded', 'false');
      dd.querySelector('.explore-panel').hidden = true;
    });
  };

  // Sidebar and mobile panel share one tag state
  tagFieldsets.forEach((fieldset, fsIndex) => {
    TAGS.forEach(([value, label]) => {
      const id = `tag-${fsIndex}-${value}`;
      const row = document.createElement('div');
      row.className = 'explore-check';
      row.innerHTML = `<input type="checkbox" id="${id}" value="${value}"><label for="${id}" class="label">${label}</label>`;
      fieldset.append(row);
    });
    fieldset.addEventListener('change', (event) => {
      const { value, checked } = event.target;
      if (checked) state.tags.add(value);
      else state.tags.delete(value);
      syncTags();
      render();
    });
  });

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      state.category = pill.dataset.category;
      syncPills();
      updateUrl();
      render();
    });
  });

  dropdowns.forEach((dd) => {
    const button = dd.querySelector('.explore-dd-btn');
    const panel = dd.querySelector('.explore-panel');

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      closeDropdowns(dd);
      button.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });

    panel.addEventListener('click', (event) => {
      const option = event.target.closest('.explore-option');
      if (!option) return;
      const value = option.dataset.value;

      if (dd.dataset.dd === 'location') state.location = value;
      if (dd.dataset.dd === 'type') state.type = value;
      if (dd.dataset.dd === 'more') state.sort = state.sort === value ? 'none' : value;

      syncDropdownLabels();
      closeDropdowns();
      render();
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.explore-dd')) closeDropdowns();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = document.querySelector('.explore-dd-btn[aria-expanded="true"]');
    closeDropdowns();
    open?.focus();
  });

  document.getElementById('explore-reset').addEventListener('click', () => {
    Object.assign(state, { category: 'all', location: 'all', type: 'all', sort: 'none', query: '' });
    searchInput.value = '';
    state.tags.clear();
    syncPills();
    syncDropdownLabels();
    syncTags();
    updateUrl();
    render();
  });

  const searchStatus = document.getElementById('explore-search');
  const searchStatusText = document.getElementById('explore-search-text');

  // Live filtering while typing in the header search
  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    updateUrl();
    render();
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    closeSearchDropdown();
  });

  document.getElementById('explore-clear-search').addEventListener('click', () => {
    state.query = '';
    searchInput.value = '';
    updateUrl();
    render();
    searchInput.focus();
  });

  const initialQuery = new URLSearchParams(window.location.search).get('leit') || '';
  state.query = initialQuery;
  searchInput.value = initialQuery;

  const initial = new URLSearchParams(window.location.search).get('flokkur');
  if (initial && initial in CATEGORY_NAMES) state.category = initial;
  syncPills();
  render();
}

/* ===== Business profile page ===== */
const bizRoot = document.getElementById('biz-root');

if (bizRoot) {
  const business = businesses.find((b) => b.id === new URLSearchParams(window.location.search).get('id'));

  if (!business) {
    bizRoot.hidden = true;
    document.getElementById('biz-notfound').hidden = false;
    document.title = 'Fyrirtækið fannst ekki – TÍNT';
  } else {
    const byId = (id) => document.getElementById(id);
    const starsHtml = (filled) => Array.from({ length: 5 }, (_, i) => `<i data-lucide="star"${i < filled ? ' class="is-filled"' : ''}></i>`).join('');
    const formatRating = (value) => String(value).replace('.', ',');

    document.title = `${business.name} – TÍNT`;
    byId('biz-title').textContent = business.name;
    byId('biz-tags').innerHTML = [CATEGORY_NAMES[business.category], business.location, STORE_TYPE_NAMES[business.storeType]]
      .map((tag) => `<li>${tag}</li>`)
      .join('');

    const images = [
      ['biz-img-main', business.image, `Mynd af ${business.name}`],
      ['biz-img-1', business.gallery[0], `Fleiri myndir frá ${business.name} (1)`],
      ['biz-img-2', business.gallery[1], `Fleiri myndir frá ${business.name} (2)`],
    ];
    images.forEach(([id, src, alt]) => {
      byId(id).src = src;
      byId(id).alt = alt;
    });

    byId('biz-about').textContent = business.about;
    byId('biz-website').href = business.website;
    byId('biz-instagram').href = business.instagram;
    byId('biz-instagram').setAttribute('aria-label', `${business.name} á Instagram`);
    byId('biz-facebook').href = business.facebook;
    byId('biz-facebook').setAttribute('aria-label', `${business.name} á Facebook`);

    byId('biz-address').innerHTML = business.storeType === 'netverslun' ? 'Netverslun' : `${business.address}<br>${business.postcode}`;
    byId('biz-hours').innerHTML = business.hours.join('<br>');

    const ratingStars = byId('biz-rating-stars');
    ratingStars.setAttribute('aria-label', `${formatRating(business.rating)} af 5 stjörnum`);
    ratingStars.innerHTML = starsHtml(Math.round(business.rating));
    byId('biz-rating-value').textContent = formatRating(business.rating);
    byId('biz-rating-count').textContent = `${business.reviewCount} umsagnir`;

    byId('biz-reviews').innerHTML = business.reviews.map((review) => `
      <article class="biz-review">
        <p class="label biz-strong">${review.name}</p>
        <p class="small">${review.date}</p>
        <span class="biz-stars biz-stars-sm" role="img" aria-label="${review.stars} af 5 stjörnum">${starsHtml(review.stars)}</span>
        <p class="label">${review.text}</p>
      </article>`).join('');

    const heart = byId('biz-heart');
    heart.dataset.id = business.id;
    setHeartState(heart, isFavorite(business.id));
    heart.addEventListener('click', () => {
      setHeartState(heart, toggleFavorite(business.id));
      popHeart(heart);
    });
    onFavoritesChange(() => setHeartState(heart, isFavorite(business.id)));

    lucide.createIcons();
  }
}

/* ===== Contact page ===== */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const controls = [...contactForm.querySelectorAll('input, select, textarea')];
  watchControls(controls);

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = validateControls(controls);

    if (invalid.length) {
      focusFirstError(invalid);
      return;
    }

    const thanks = document.createElement('div');
    thanks.className = 'apply-thanks';
    thanks.setAttribute('role', 'status');
    thanks.innerHTML = `
      <h2 class="section-heading">Takk fyrir skilaboðin!</h2>
      <p class="body-text">Við svörum þér eins fljótt og auðið er, yfirleitt innan tveggja virkra daga.</p>
      <a href="index.html" class="btn">Til baka á forsíðu <i data-lucide="arrow-right" aria-hidden="true"></i></a>`;
    document.getElementById('contact-box').replaceChildren(thanks);
    lucide.createIcons();
    thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
