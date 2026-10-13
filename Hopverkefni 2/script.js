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

/* ===== Favorites page ===== */
const favGrid = document.getElementById('fav-grid');

if (favGrid) {
  const pills = document.querySelectorAll('.pill-filter');
  const emptyMsg = document.getElementById('fav-empty');
  let activeFilter = 'all';

  const getCards = () => favGrid.querySelectorAll('.fav-card');

  const updateCounts = () => {
    const cards = getCards();
    pills.forEach((pill) => {
      const filter = pill.dataset.filter;
      const count = filter === 'all'
        ? cards.length
        : [...cards].filter((card) => card.dataset.category === filter).length;
      const label = filter === 'all' ? 'Allt' : filter;
      pill.textContent = `${label} (${count})`;
    });
  };

  const applyFilter = () => {
    getCards().forEach((card) => {
      card.hidden = activeFilter !== 'all' && card.dataset.category !== activeFilter;
    });
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      activeFilter = pill.dataset.filter;
      pills.forEach((p) => {
        const isActive = p === pill;
        p.classList.toggle('is-active', isActive);
        p.setAttribute('aria-pressed', String(isActive));
      });
      applyFilter();
    });
  });

  favGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.fav-heart');
    if (!button) return;

    const card = button.closest('.fav-card');
    card.classList.add('is-removing');
    setTimeout(() => {
      card.remove();
      updateCounts();
      emptyMsg.hidden = getCards().length > 0;
      favGrid.hidden = getCards().length === 0;
    }, 300);
  });

  updateCounts();
  lucide.createIcons();
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
  const businesses = [
    { name: 'Sápugerð.is', location: 'Reykjavík', category: 'snyrti', storeType: 'bæði', tags: ['handgert', 'gjafir'], description: 'Handgerðar sápur úr náttúrulegum hráefnum', image: 'images/fyrirtaeki/sapugerd.jpg', url: '#' },
    { name: 'Skart og Co', location: 'Hafnarfjörður', category: 'skartgripir', storeType: 'verslun', tags: ['skartgripir', 'handgert', 'gjafir'], description: 'Handsmíðaðir hringir og skartgripir', image: 'images/fyrirtaeki/skartogco.jpg', url: '#' },
    { name: 'Vintaj', location: 'Reykjavík', category: 'fatnadur', storeType: 'verslun', tags: ['tiska'], description: 'Notuð föt og vintage gersemar', image: 'images/fyrirtaeki/vintaj.jpg', url: '#' },
    { name: 'Grænt', location: 'Kópavogur', category: 'matur', storeType: 'bæði', tags: [], description: 'Ferskt grænmeti og ávextir beint frá bónda', image: 'images/fyrirtaeki/graent.jpg', url: '#' },
    { name: 'Margt og fleira', location: 'Akureyri', category: 'heimilid', storeType: 'verslun', tags: ['gjafir', 'baekur', 'heimilid'], description: 'Smávörur, gjafir og bækur fyrir heimilið', image: 'images/fyrirtaeki/margtogfleira.jpg', url: '#' },
    { name: 'Bakað', location: 'Reykjavík', category: 'matur', storeType: 'bæði', tags: ['handgert'], description: 'Notalegt bakarí með nýbökuðu brauði', image: 'images/bakad.jpg', url: 'bakad.html' },
    { name: 'Kaffihúsið', location: 'Reykjavík', category: 'matur', storeType: 'verslun', tags: [], description: 'Notalegt kaffihús í miðbænum', image: 'images/fyrirtaeki/kaffihus.jpg', url: '#' },
    { name: 'Hjólabúðin', location: 'Hafnarfjörður', category: 'heimilid', storeType: 'bæði', tags: [], description: 'Hjól, varahlutir og viðgerðir', image: 'images/fyrirtaeki/hjol.jpg', url: '#' },
    { name: 'Fegurð', location: 'Akureyri', category: 'snyrti', storeType: 'netverslun', tags: ['gjafir'], description: 'Snyrtivörur og húðumhirða', image: 'images/fyrirtaeki/fegurd.jpg', url: '#' },
  ];

  const CATEGORY_NAMES = {
    all: 'Allt',
    snyrti: 'Snyrti & Heilsuvörur',
    fatnadur: 'Fatnaður',
    heimilid: 'Heimilið',
    skartgripir: 'Skartgripir',
    matur: 'Matur og Drykkir',
  };

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

  const state = { category: 'all', location: 'all', type: 'all', sort: 'none', tags: new Set() };

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

  const cardHtml = (b) => `
    <article class="fav-card explore-card">
      <a href="${b.url}" class="fav-img explore-img">
        <img src="${b.image}" alt="Mynd frá ${b.name}: ${b.description}" loading="lazy">
      </a>
      <p class="small fav-location">${b.location}</p>
      <div class="fav-row">
        <h2 class="business-name"><a href="${b.url}">${b.name}</a></h2>
        <a href="${b.url}" class="fav-link" aria-label="Vefsíða ${b.name}">Vefsíða <i data-lucide="external-link" aria-hidden="true"></i></a>
      </div>
      <p class="small">${b.description}</p>
    </article>`;

  const render = () => {
    const result = businesses.filter(matches);
    if (state.sort !== 'none') {
      const dir = state.sort === 'asc' ? 1 : -1;
      result.sort((a, b) => dir * a.name.localeCompare(b.name, 'is'));
    }

    heading.textContent = CATEGORY_NAMES[state.category];
    count.textContent = `${result.length} fyrirtæki`;
    exploreGrid.innerHTML = result.map(cardHtml).join('');
    exploreGrid.hidden = result.length === 0;
    emptyBox.hidden = result.length > 0;
    lucide.createIcons();
  };

  const updateUrl = () => {
    const url = state.category === 'all' ? window.location.pathname : `?flokkur=${state.category}`;
    history.replaceState(null, '', url);
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
    Object.assign(state, { category: 'all', location: 'all', type: 'all', sort: 'none' });
    state.tags.clear();
    syncPills();
    syncDropdownLabels();
    syncTags();
    updateUrl();
    render();
  });

  const initial = new URLSearchParams(window.location.search).get('flokkur');
  if (initial && initial in CATEGORY_NAMES) state.category = initial;
  syncPills();
  render();
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
