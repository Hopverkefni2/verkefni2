declare const lucide: { createIcons: () => void };

type Category = "snyrti" | "fatnadur" | "heimilid" | "skartgripir" | "matur";
type StoreType = "verslun" | "netverslun" | "bæði";
type Tag = "baekur" | "gjafir" | "heimilid" | "handgert" | "skartgripir" | "tiska";

interface Review {
  name: string;
  date: string;
  stars: number;
  text: string;
}

interface UserReview extends Review {
  id: string;
  createdAt: string;
  isUserReview: true;
}

interface Business {
  id: string;
  name: string;
  location: string;
  category: Category;
  storeType: StoreType;
  tags: Tag[];
  description: string;
  about: string;
  address: string;
  postcode: string;
  hours: string[];
  website: string;
  instagram: string;
  facebook: string;
  image: string;
  gallery: string[];
  reviews: Review[];
}

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FilterCategory = Category | "all";
type SortOrder = "none" | "asc" | "desc";

/* ===== Shared business data and labels ===== */
const CATEGORY_NAMES: Record<FilterCategory, string> = {
  all: "Allt",
  snyrti: "Snyrti & Heilsuvörur",
  fatnadur: "Fatnaður",
  heimilid: "Heimilið",
  skartgripir: "Skartgripir",
  matur: "Matur og Drykkir",
};

const STORE_TYPE_NAMES: Record<StoreType, string> = {
  verslun: "Verslun",
  netverslun: "Netverslun",
  "bæði": "Verslun & netverslun",
};

const TAG_NAMES: Record<Tag, string> = {
  baekur: "Bækur",
  gjafir: "Gjafavörur",
  heimilid: "Heimilið",
  handgert: "Handgert",
  skartgripir: "Skartgripir",
  tiska: "Tíska",
};

const FAVORITES_KEY = "tint-favorites";
const REVIEWS_KEY = "tint-reviews";
const ERROR_MESSAGE = "Ekki tókst að sækja fyrirtæki. Reyndu aftur síðar.";
let businesses: Business[] = [];
let memoryFavorites: string[] = [];

async function loadBusinesses(): Promise<Business[]> {
  try {
    const response = await fetch("data/businesses.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json() as Business[];
  } catch (error: unknown) {
    console.error("Gat ekki sótt fyrirtækjagögn:", error);
    showBusinessLoadError();
    throw error;
  }
}

function showBusinessLoadError(): void {
  const destinations = [
    document.getElementById("explore-grid"),
    document.getElementById("fav-grid"),
    document.getElementById("biz-root"),
  ];
  const destination = destinations.find((element) => element !== null);
  if (!destination) return;
  const message = document.createElement("p");
  message.className = "business-load-error";
  message.setAttribute("role", "alert");
  message.textContent = ERROR_MESSAGE;
  destination.replaceChildren(message);
  destination.hidden = false;
}

function getFavorites(): string[] {
  try {
    const storedValue = localStorage.getItem(FAVORITES_KEY);
    if (storedValue === null) return [...memoryFavorites];
    const parsed: unknown = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed.filter((id: unknown): id is string => typeof id === "string") : [];
  } catch {
    return [...memoryFavorites];
  }
}

function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

/* ===== User reviews (localStorage) ===== */
function isUserReview(value: unknown): value is UserReview {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.text === "string"
    && typeof item.date === "string" && typeof item.createdAt === "string"
    && typeof item.stars === "number" && item.stars >= 1 && item.stars <= 5 && item.isUserReview === true;
}

function readAllUserReviews(): Record<string, UserReview[]> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(REVIEWS_KEY) ?? "{}");
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const result: Record<string, UserReview[]> = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([key, list]) => {
      if (Array.isArray(list)) result[key] = list.filter(isUserReview);
    });
    return result;
  } catch {
    return {};
  }
}

function getUserReviews(businessId: string): UserReview[] {
  return readAllUserReviews()[businessId] ?? [];
}

function writeUserReviews(businessId: string, list: UserReview[]): void {
  const all = readAllUserReviews();
  all[businessId] = list;
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  } catch {
    // Storage unavailable or full; the review will not persist.
  }
}

function saveUserReview(businessId: string, review: UserReview): void {
  writeUserReviews(businessId, [...getUserReviews(businessId), review]);
}

function deleteUserReview(businessId: string, reviewId: string): void {
  writeUserReviews(businessId, getUserReviews(businessId).filter((review) => review.id !== reviewId));
}

function getAllReviews(business: Business): Review[] {
  const own = [...getUserReviews(business.id)].sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt) || Number(second.id) - Number(first.id));
  return [...own, ...business.reviews];
}

function calculateRating(business: Business): { rating: number; count: number } {
  const all = getAllReviews(business);
  if (all.length === 0) return { rating: 0, count: 0 };
  const total = all.reduce((sum, review) => sum + review.stars, 0);
  return { rating: Math.round((total / all.length) * 10) / 10, count: all.length };
}

function toggleFavorite(id: string): boolean {
  const currentFavorites = getFavorites();
  const nowFavorite = !currentFavorites.includes(id);
  const nextFavorites = nowFavorite
    ? [...currentFavorites, id]
    : currentFavorites.filter((favoriteId) => favoriteId !== id);
  memoryFavorites = nextFavorites;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
  } 
  catch {
  }
  updateFavoritesBadge();
  return nowFavorite;
}

function onFavoritesChange(callback: () => void): void {
  window.addEventListener("storage", (event: StorageEvent) => {
    if (event.key === FAVORITES_KEY || event.key === null) callback();
  });
  window.addEventListener("pageshow", (event: PageTransitionEvent) => {
    if (event.persisted) callback();
  });
}

function updateFavoritesBadge(): void {
  const favoritesLink = document.querySelector<HTMLAnchorElement>('.nav-link[href="favorites.html"]');
  if (!favoritesLink) return;
  let badge = favoritesLink.querySelector<HTMLSpanElement>(".fav-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "fav-badge";
    badge.setAttribute("aria-hidden", "true");
    favoritesLink.append(badge);
  }
  const total = getFavorites().length;
  badge.textContent = String(total);
  badge.hidden = total === 0;
  if (total > 0) favoritesLink.setAttribute("aria-label", `Uppáhald, ${total} vistuð`);
  else favoritesLink.removeAttribute("aria-label");
}

function setHeartState(button: HTMLButtonElement, favorite: boolean): void {
  const business = businesses.find((item) => item.id === button.dataset.id);
  if (!business) return;
  button.classList.toggle("is-favorite", favorite);
  button.setAttribute("aria-pressed", String(favorite));
  button.setAttribute("aria-label", favorite
    ? `Fjarlægja ${business.name} úr uppáhaldi`
    : `Bæta ${business.name} í uppáhald`);
}

function popHeart(button: HTMLButtonElement): void {
  button.classList.remove("is-pop");
  void button.offsetWidth;
  button.classList.add("is-pop");
  button.addEventListener("animationend", () => button.classList.remove("is-pop"), { once: true });
}

function profileUrl(business: Business): string {
  return `fyrirtaeki-sida.html?id=${business.id}`;
}

function renderBusinessCard(business: Business): string {
  const favorite = isFavorite(business.id);
  const label = favorite
    ? `Fjarlægja ${business.name} úr uppáhaldi`
    : `Bæta ${business.name} í uppáhald`;
  return `
    <article class="fav-card explore-card" data-id="${business.id}">
      <div class="fav-img explore-img">
        <a href="${profileUrl(business)}" class="explore-img-link">
          <img src="${business.image}" alt="Mynd frá ${business.name}: ${business.description}" loading="lazy">
        </a>
        <button type="button" class="fav-heart${favorite ? " is-favorite" : ""}" data-id="${business.id}" aria-pressed="${favorite}" aria-label="${label}"><i data-lucide="heart" aria-hidden="true"></i></button>
      </div>
      <p class="small fav-location">${business.location}</p>
      <div class="fav-row">
        <h2 class="business-name"><a href="${profileUrl(business)}">${business.name}</a></h2>
        <a href="${business.website}" class="fav-link" aria-label="Vefsíða ${business.name}">Vefsíða <i data-lucide="external-link" aria-hidden="true"></i></a>
      </div>
      <p class="small">${business.description}</p>
    </article>`;
}

/* ===== Search and suggestions ===== */
function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ð/g, "d").replace(/þ/g, "th").replace(/æ/g, "ae").replace(/ö/g, "o");
}

function escapeHtml(text: string): string {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
  return text.replace(/[&<>"']/g, (character) => entities[character] ?? character);
}

function searchBusinesses(query: string, list: Business[]): Business[] {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return list.map((business) => {
    const name = normalizeText(business.name);
    const details = normalizeText([
      business.location,
      CATEGORY_NAMES[business.category],
      STORE_TYPE_NAMES[business.storeType],
      ...business.tags.map((tag) => TAG_NAMES[tag]),
      business.description,
    ].join(" "));
    return { business, inName: words.some((word) => name.includes(word)), matches: words.every((word) => name.includes(word) || details.includes(word)) };
  }).filter((result) => result.matches)
    .sort((first, second) => Number(second.inName) - Number(first.inName))
    .map((result) => result.business);
}

function highlightName(name: string, query: string): string {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  const characters = name.split("");
  let normalized = "";
  const origin: number[] = [];
  characters.forEach((character, index) => {
    const part = normalizeText(character);
    normalized += part;
    for (let partIndex = 0; partIndex < part.length; partIndex += 1) origin.push(index);
  });
  const marked = new Array<boolean>(characters.length).fill(false);
  words.forEach((word) => {
    let from = normalized.indexOf(word);
    while (from !== -1) {
      for (let index = from; index < from + word.length; index += 1) {
        const characterIndex = origin[index];
        if (characterIndex !== undefined) marked[characterIndex] = true;
      }
      from = normalized.indexOf(word, from + word.length);
    }
  });
  return characters.map((character, index) => marked[index]
    ? `<strong>${escapeHtml(character)}</strong>`
    : escapeHtml(character)).join("");
}

interface SearchControls {
  form: HTMLFormElement | null;
  input: HTMLInputElement | null;
  close: () => void;
}

function initSearch(businessList: Business[]): SearchControls {
  const searchForm = document.querySelector<HTMLFormElement>("form.search");
  const searchInput = document.querySelector<HTMLInputElement>("#search-input");
  let closeSearchDropdown = (): void => undefined;
  if (!searchForm || !searchInput) return { form: searchForm, input: searchInput, close: closeSearchDropdown };

  const maxSuggestions = 6;
  const dropdown = document.createElement("div");
  dropdown.className = "search-dd";
  dropdown.id = "search-dd";
  dropdown.setAttribute("role", "listbox");
  dropdown.setAttribute("aria-label", "Tillögur að fyrirtækjum");
  dropdown.hidden = true;
  searchForm.append(dropdown);
  searchInput.setAttribute("role", "combobox");
  searchInput.setAttribute("aria-autocomplete", "list");
  searchInput.setAttribute("aria-expanded", "false");
  searchInput.setAttribute("aria-controls", "search-dd");
  let activeIndex = -1;
  let timer = 0;

  const getOptions = (): HTMLAnchorElement[] => Array.from(dropdown.querySelectorAll<HTMLAnchorElement>('a[role="option"]'));
  closeSearchDropdown = (): void => {
    dropdown.hidden = true;
    activeIndex = -1;
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
  };
  const setActive = (index: number): void => {
    const options = getOptions();
    activeIndex = index;
    options.forEach((option, optionIndex) => {
      option.classList.toggle("is-active", optionIndex === index);
      option.setAttribute("aria-selected", String(optionIndex === index));
    });
    if (index >= 0) {
      const option = options[index];
      if (option) {
        searchInput.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    } else searchInput.removeAttribute("aria-activedescendant");
  };
  const renderSuggestions = (): void => {
    const query = searchInput.value.trim();
    if (!query) {
      closeSearchDropdown();
      return;
    }
    const shown = searchBusinesses(query, businessList).slice(0, maxSuggestions);
    const safeQuery = escapeHtml(query);
    if (shown.length === 0) {
      dropdown.innerHTML = `<p class="search-dd-empty">Engin fyrirtæki fundust fyrir „${safeQuery}“</p>`;
    } else {
      const rows = shown.map((business, index) => `
        <a href="${profileUrl(business)}" class="search-dd-row" role="option" id="search-opt-${index}" aria-selected="false">
          <img class="search-dd-thumb" src="${business.image}" alt="">
          <span class="search-dd-text"><span class="search-dd-name">${highlightName(business.name, query)}</span>
          <span class="search-dd-meta">${CATEGORY_NAMES[business.category]} · ${business.location}</span></span>
        </a>`).join("");
      dropdown.innerHTML = `${rows}
        <a href="fyrirtaeki.html?leit=${encodeURIComponent(query)}" class="search-dd-all" role="option" id="search-opt-${shown.length}" aria-selected="false">
          <span>Sjá allar niðurstöður fyrir „${safeQuery}“</span><i data-lucide="arrow-right" aria-hidden="true"></i>
        </a>`;
    }
    dropdown.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
    setActive(-1);
    lucide.createIcons();
  };

  searchInput.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(renderSuggestions, 150);
  });
  searchInput.addEventListener("keydown", (event: KeyboardEvent) => {
    if (dropdown.hidden) return;
    const options = getOptions();
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (options.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + options.length) % options.length);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      options[activeIndex]?.click();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeSearchDropdown();
    }
  });
  document.addEventListener("click", (event: MouseEvent) => {
    if (event.target instanceof Node && !searchForm.contains(event.target)) closeSearchDropdown();
  });
  return { form: searchForm, input: searchInput, close: closeSearchDropdown };
}

/* ===== Newsletter and shared form validation ===== */
const REQUIRED_MSG = "Þetta svæði er nauðsynlegt";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(control: FormControl | null, id: string, message: string): void {
  const error = document.getElementById(id);
  if (!error) return;
  error.textContent = message;
  error.hidden = false;
  control?.classList.add("has-error");
  control?.setAttribute("aria-invalid", "true");
}

function clearError(control: FormControl | null, id: string): void {
  const error = document.getElementById(id);
  if (!error) return;
  error.hidden = true;
  control?.classList.remove("has-error");
  control?.removeAttribute("aria-invalid");
}

function fieldMessage(control: FormControl): string {
  const value = control.value.trim();
  if (control.required && !value) return REQUIRED_MSG;
  if (!value) return "";
  if (control instanceof HTMLInputElement && control.type === "email" && !EMAIL_RE.test(value)) return "Vinsamlegast sláðu inn gilt netfang";
  if (control.type === "url" && !control.checkValidity()) return "Vinsamlegast sláðu inn gilt veffang";
  if (control.type === "number" && !control.checkValidity()) return "Vinsamlegast sláðu inn gilda tölu";
  const minimumLength = control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement ? control.minLength : -1;
  if (minimumLength > 0 && value.length < minimumLength) return control.dataset.minMessage ?? "";
  return "";
}

function validateControls(controls: FormControl[]): FormControl[] {
  const invalidControls: FormControl[] = [];
  controls.forEach((control) => {
    const message = fieldMessage(control);
    if (message) {
      showError(control, `${control.id}-error`, message);
      invalidControls.push(control);
    } else clearError(control, `${control.id}-error`);
  });
  return invalidControls;
}

function watchControls(controls: FormControl[]): void {
  controls.forEach((control) => {
    const clear = (): void => clearError(control, `${control.id}-error`);
    control.addEventListener("input", clear);
    control.addEventListener("change", clear);
  });
}

function focusFirstError(invalidControls: HTMLElement[]): void {
  invalidControls.sort((first, second) => first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  const firstError = invalidControls[0];
  if (!firstError) return;
  firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  firstError.focus({ preventScroll: true });
}

function initNewsletter(): void {
  const form = document.getElementById("newsletter-form");
  const wrap = document.getElementById("newsletter-wrap");
  const emailInput = document.querySelector<HTMLInputElement>("#email");
  const errorMessage = document.getElementById("email-error");
  if (!(form instanceof HTMLFormElement) || !wrap || !emailInput || !errorMessage) return;
  form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    const isValid = EMAIL_RE.test(emailInput.value.trim());
    if (!isValid) {
      errorMessage.hidden = false;
      emailInput.setAttribute("aria-invalid", "true");
      emailInput.focus();
      return;
    }
    const thanks = document.createElement("p");
    thanks.className = "newsletter-thanks";
    thanks.setAttribute("role", "status");
    thanks.textContent = "Takk fyrir! Þú ert nú skráð/ur á póstlistann.";
    wrap.replaceChildren(thanks);
  });
}

function initApplicationForm(): void {
  const applyForm = document.getElementById("apply-form");
  if (!(applyForm instanceof HTMLFormElement)) return;
  const toggles = Array.from(applyForm.querySelectorAll<HTMLButtonElement>(".toggle"));
  const addressInput = document.querySelector<HTMLInputElement>("#address");
  const consentInput = document.querySelector<HTMLInputElement>("#consent");
  const fileInput = document.querySelector<HTMLInputElement>("#images");
  const uploadArea = document.getElementById("upload-area");
  const thumbs = document.getElementById("thumbs");
  const applyBox = document.getElementById("apply-box");
  if (!addressInput || !consentInput || !fileInput || !uploadArea || !thumbs || !applyBox) return;
  const controls = Array.from(applyForm.querySelectorAll<FormControl>('input:not([type="file"]):not([type="checkbox"]), select, textarea'));
  let selectedFiles: File[] = [];
  const isStoreSelected = (): boolean => document.getElementById("toggle-store")?.getAttribute("aria-pressed") === "true";

  toggles.forEach((toggle) => toggle.addEventListener("click", () => {
    const pressed = toggle.getAttribute("aria-pressed") === "true";
    toggle.setAttribute("aria-pressed", String(!pressed));
    addressInput.required = isStoreSelected();
    clearError(null, "type-error");
    if (!isStoreSelected()) clearError(addressInput, "address-error");
  }));
  watchControls(controls);
  consentInput.addEventListener("change", () => clearError(consentInput, "consent-error"));

  const renderThumbs = (): void => {
    thumbs.replaceChildren(...selectedFiles.map((file, index) => {
      const item = document.createElement("li");
      item.className = "thumb";
      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);
      image.alt = file.name;
      image.addEventListener("load", () => URL.revokeObjectURL(image.src));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "thumb-remove";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Fjarlægja ${file.name}`);
      remove.addEventListener("click", () => {
        selectedFiles.splice(index, 1);
        renderThumbs();
      });
      item.append(image, remove);
      return item;
    }));
  };
  const addFiles = (fileList: FileList | null): void => {
    const imageFiles = Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
    selectedFiles = selectedFiles.concat(imageFiles);
    renderThumbs();
  };
  fileInput.addEventListener("change", () => {
    addFiles(fileInput.files);
    fileInput.value = "";
  });
  const handleDragOver = (event: DragEvent): void => {
    event.preventDefault();
    uploadArea.classList.add("is-dragover");
  };
  uploadArea.addEventListener("dragenter", handleDragOver);
  uploadArea.addEventListener("dragover", handleDragOver);
  ["dragleave", "drop"].forEach((eventName) => uploadArea.addEventListener(eventName, () => uploadArea.classList.remove("is-dragover")));
  uploadArea.addEventListener("drop", (event: DragEvent) => {
    event.preventDefault();
    addFiles(event.dataTransfer?.files ?? null);
  });
  applyForm.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    const invalidControls: HTMLElement[] = validateControls(controls);
    if (!toggles.some((toggle) => toggle.getAttribute("aria-pressed") === "true")) {
      showError(null, "type-error", "Veldu að minnsta kosti einn möguleika");
      const firstToggle = toggles[0];
      if (firstToggle) invalidControls.push(firstToggle);
    }
    if (!consentInput.checked) {
      showError(consentInput, "consent-error", "Þú þarft að samþykkja til að halda áfram");
      invalidControls.push(consentInput);
    }
    if (invalidControls.length > 0) {
      focusFirstError(invalidControls);
      return;
    }
    const thanks = document.createElement("div");
    thanks.className = "apply-thanks";
    thanks.setAttribute("role", "status");
    thanks.innerHTML = '<h2 class="section-heading">Takk fyrir umsóknina!</h2><p class="body-text">Við förum yfir umsóknina og höfum samband fljótlega.</p><a href="index.html" class="btn">Til baka á forsíðu <i data-lucide="arrow-right" aria-hidden="true"></i></a>';
    applyBox.replaceChildren(thanks);
    lucide.createIcons();
    thanks.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function initContactForm(): void {
  const contactForm = document.getElementById("contact-form");
  const contactBox = document.getElementById("contact-box");
  if (!(contactForm instanceof HTMLFormElement) || !contactBox) return;
  const controls = Array.from(contactForm.querySelectorAll<FormControl>("input, select, textarea"));
  watchControls(controls);
  contactForm.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    const invalidControls = validateControls(controls);
    if (invalidControls.length > 0) {
      focusFirstError(invalidControls);
      return;
    }
    const thanks = document.createElement("div");
    thanks.className = "apply-thanks";
    thanks.setAttribute("role", "status");
    thanks.innerHTML = '<h2 class="section-heading">Takk fyrir skilaboðin!</h2><p class="body-text">Við svörum þér eins fljótt og auðið er, yfirleitt innan tveggja virkra daga.</p><a href="index.html" class="btn">Til baka á forsíðu <i data-lucide="arrow-right" aria-hidden="true"></i></a>';
    contactBox.replaceChildren(thanks);
    lucide.createIcons();
    thanks.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ===== Favorites page ===== */
function initFavoritesPage(businessList: Business[]): void {
  const favoritesGrid = document.getElementById("fav-grid");
  const filtersElement = document.getElementById("fav-filters");
  const emptyBox = document.getElementById("fav-empty");
  if (!favoritesGrid || !filtersElement || !emptyBox) return;
  let activeFilter: FilterCategory = "all";
  const render = (): void => {
    const savedBusinesses = businessList.filter((business) => isFavorite(business.id));
    const countFor = (category: FilterCategory): number => category === "all"
      ? savedBusinesses.length
      : savedBusinesses.filter((business) => business.category === category).length;
    if (countFor(activeFilter) === 0) activeFilter = "all";
    const isEmpty = savedBusinesses.length === 0;
    filtersElement.hidden = isEmpty;
    favoritesGrid.hidden = isEmpty;
    emptyBox.hidden = !isEmpty;
    filtersElement.innerHTML = (Object.entries(CATEGORY_NAMES) as [FilterCategory, string][])
      .filter(([category]) => category === "all" || countFor(category) > 0)
      .map(([category, label]) => {
        const active = category === activeFilter;
        return `<button type="button" class="pill-filter${active ? " is-active" : ""}" data-filter="${category}" aria-pressed="${active}">${label} (${countFor(category)})</button>`;
      }).join("");
    favoritesGrid.innerHTML = savedBusinesses
      .filter((business) => activeFilter === "all" || business.category === activeFilter)
      .map(renderBusinessCard).join("");
    lucide.createIcons();
  };
  filtersElement.addEventListener("click", (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const pill = event.target.closest<HTMLButtonElement>(".pill-filter");
    if (!pill) return;
    const filter = pill.dataset.filter;
    if (filter && filter in CATEGORY_NAMES) activeFilter = filter as FilterCategory;
    render();
  });
  favoritesGrid.addEventListener("click", (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>(".fav-heart");
    if (!button) return;
    toggleFavorite(button.dataset.id ?? "");
    button.closest(".fav-card")?.classList.add("is-removing");
    window.setTimeout(render, 300);
  });
  onFavoritesChange(render);
  render();
}

/* ===== Explore page filters and grid ===== */
function initExplorePage(businessList: Business[], search: SearchControls): void {
  const exploreGrid = document.getElementById("explore-grid");
  const heading = document.getElementById("explore-heading");
  const count = document.getElementById("explore-count");
  const emptyBox = document.getElementById("explore-empty");
  const searchStatus = document.getElementById("explore-search");
  const searchStatusText = document.getElementById("explore-search-text");
  if (!exploreGrid || !heading || !count || !emptyBox || !searchStatus || !searchStatusText || !search.input || !search.form) return;
  const searchInput = search.input;
  const searchForm = search.form;
  const pills = Array.from(document.querySelectorAll<HTMLButtonElement>(".explore-pills .pill-filter"));
  const dropdowns = Array.from(document.querySelectorAll<HTMLElement>(".explore-dd"));
  const tagFieldsets = Array.from(document.querySelectorAll<HTMLElement>("[data-tags]"));
  const tags: [Tag, string][] = [
    ["baekur", "Bækur"], ["gjafir", "Gjafavörur"], ["heimilid", "Heimilið"],
    ["handgert", "Handgert"], ["skartgripir", "Skartgripir"], ["tiska", "Tíska"],
  ];
  const defaultLabels = { location: "Staðsetning", type: "Tegund verslunar", more: "Fleiri síur" };
  const sortLabels: Record<Exclude<SortOrder, "none">, string> = { asc: "Raða eftir nafni (A–Ö)", desc: "Raða eftir nafni (Ö–A)" };
  const state: { category: FilterCategory; location: string; type: "all" | StoreType; sort: SortOrder; tags: Set<Tag>; query: string } = {
    category: "all", location: "all", type: "all", sort: "none", tags: new Set<Tag>(), query: "",
  };
  const matchesFilters = (business: Business): boolean =>
    (state.category === "all" || business.category === state.category) &&
    (state.location === "all" || business.location === state.location) &&
    (state.type === "all" || business.storeType === "bæði" || business.storeType === state.type) &&
    (state.tags.size === 0 || business.tags.some((tag) => state.tags.has(tag)));
  const render = (): void => {
    const query = state.query.trim();
    const foundBusinesses = query ? searchBusinesses(query, businessList) : [...businessList];
    const filteredBusinesses = foundBusinesses.filter(matchesFilters);
    if (state.sort !== "none") {
      const direction = state.sort === "asc" ? 1 : -1;
      filteredBusinesses.sort((first, second) => direction * first.name.localeCompare(second.name, "is"));
    }
    searchStatus.hidden = !query;
    if (query) searchStatusText.textContent = `Niðurstöður fyrir „${query}“ (${filteredBusinesses.length})`;
    heading.textContent = CATEGORY_NAMES[state.category];
    count.textContent = `${filteredBusinesses.length} fyrirtæki`;
    exploreGrid.innerHTML = filteredBusinesses.map(renderBusinessCard).join("");
    exploreGrid.hidden = filteredBusinesses.length === 0;
    emptyBox.hidden = filteredBusinesses.length > 0;
    lucide.createIcons();
  };
  const syncPills = (): void => pills.forEach((pill) => {
    const active = pill.dataset.category === state.category;
    pill.classList.toggle("is-active", active);
    pill.setAttribute("aria-pressed", String(active));
  });
  const syncDropdownLabels = (): void => {
    dropdowns.forEach((dropdown) => {
      const label = dropdown.querySelector<HTMLElement>(".explore-dd-label");
      if (!label) return;
      let value = defaultLabels[dropdown.dataset.dd as keyof typeof defaultLabels];
      if (dropdown.dataset.dd === "location" && state.location !== "all") value = state.location;
      if (dropdown.dataset.dd === "type" && state.type !== "all") value = STORE_TYPE_NAMES[state.type];
      if (dropdown.dataset.dd === "more" && state.sort !== "none") value = sortLabels[state.sort];
      label.textContent = value;
    });
  };
  const syncTags = (): void => document.querySelectorAll<HTMLInputElement>("[data-tags] input").forEach((input) => {
    input.checked = state.tags.has(input.value as Tag);
  });
  const closeDropdowns = (except?: HTMLElement): void => dropdowns.forEach((dropdown) => {
    if (dropdown === except) return;
    dropdown.querySelector(".explore-dd-btn")?.setAttribute("aria-expanded", "false");
    const panel = dropdown.querySelector<HTMLElement>(".explore-panel");
    if (panel) panel.hidden = true;
  });
  const updateUrl = (): void => {
    const params = new URLSearchParams();
    if (state.category !== "all") params.set("flokkur", state.category);
    if (state.query.trim()) params.set("leit", state.query.trim());
    const queryString = params.toString();
    history.replaceState(null, "", queryString ? `?${queryString}` : window.location.pathname);
  };

  tagFieldsets.forEach((fieldset, fieldsetIndex) => {
    tags.forEach(([value, label]) => {
      const id = `tag-${fieldsetIndex}-${value}`;
      const row = document.createElement("div");
      row.className = "explore-check";
      row.innerHTML = `<input type="checkbox" id="${id}" value="${value}"><label for="${id}" class="label">${label}</label>`;
      fieldset.append(row);
    });
    fieldset.addEventListener("change", (event: Event) => {
      if (!(event.target instanceof HTMLInputElement)) return;
      const value = event.target.value as Tag;
      if (event.target.checked) state.tags.add(value);
      else state.tags.delete(value);
      syncTags();
      render();
    });
  });
  pills.forEach((pill) => pill.addEventListener("click", () => {
    const category = pill.dataset.category;
    if (category && category in CATEGORY_NAMES) state.category = category as FilterCategory;
    syncPills();
    updateUrl();
    render();
  }));
  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector<HTMLButtonElement>(".explore-dd-btn");
    const panel = dropdown.querySelector<HTMLElement>(".explore-panel");
    if (!button || !panel) return;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      closeDropdowns(dropdown);
      button.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
    panel.addEventListener("click", (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const option = event.target.closest<HTMLElement>(".explore-option");
      if (!option) return;
      const value = option.dataset.value;
      if (!value) return;
      if (dropdown.dataset.dd === "location") state.location = value;
      if (dropdown.dataset.dd === "type" && (value === "verslun" || value === "netverslun")) state.type = value;
      if (dropdown.dataset.dd === "more" && (value === "asc" || value === "desc")) state.sort = state.sort === value ? "none" : value;
      syncDropdownLabels();
      closeDropdowns();
      render();
    });
  });
  exploreGrid.addEventListener("click", (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>(".fav-heart");
    if (!button) return;
    setHeartState(button, toggleFavorite(button.dataset.id ?? ""));
    popHeart(button);
  });
  const syncHearts = (): void => exploreGrid.querySelectorAll<HTMLButtonElement>(".fav-heart").forEach((button) => {
    setHeartState(button, isFavorite(button.dataset.id ?? ""));
  });
  onFavoritesChange(syncHearts);
  document.addEventListener("click", (event: MouseEvent) => {
    if (event.target instanceof Element && !event.target.closest(".explore-dd")) closeDropdowns();
  });
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    const openButton = document.querySelector<HTMLButtonElement>('.explore-dd-btn[aria-expanded="true"]');
    closeDropdowns();
    openButton?.focus();
  });
  document.getElementById("explore-reset")?.addEventListener("click", () => {
    state.category = "all";
    state.location = "all";
    state.type = "all";
    state.sort = "none";
    state.query = "";
    state.tags.clear();
    searchInput.value = "";
    syncPills();
    syncDropdownLabels();
    syncTags();
    updateUrl();
    render();
  });
  searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    updateUrl();
    render();
  });
  searchForm.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    search.close();
  });
  document.getElementById("explore-clear-search")?.addEventListener("click", () => {
    state.query = "";
    searchInput.value = "";
    updateUrl();
    render();
    searchInput.focus();
  });
  const parameters = new URLSearchParams(window.location.search);
  const initialQuery = parameters.get("leit") ?? "";
  state.query = initialQuery;
  searchInput.value = initialQuery;
  const initialCategory = parameters.get("flokkur");
  if (initialCategory && initialCategory in CATEGORY_NAMES) state.category = initialCategory as FilterCategory;
  syncPills();
  syncDropdownLabels();
  render();
}

/* ===== Review form ===== */
function initReviewForm(business: Business, onSaved: () => void): void {
  const form = document.getElementById("review-form");
  const nameInput = document.getElementById("review-name");
  const textInput = document.getElementById("review-text");
  const counter = document.getElementById("review-text-count");
  const ratingText = document.getElementById("review-rating-text");
  const success = document.getElementById("review-success");
  const starsWrap = document.getElementById("review-stars");
  if (!(form instanceof HTMLFormElement) || !(nameInput instanceof HTMLInputElement)
    || !(textInput instanceof HTMLTextAreaElement) || !starsWrap) return;
  const labels = Array.from(starsWrap.querySelectorAll<HTMLLabelElement>(".star-label"));
  const radios = Array.from(starsWrap.querySelectorAll<HTMLInputElement>(".star-input"));
  const selectedValue = (): number => Number(radios.find((radio) => radio.checked)?.value ?? 0);
  let hideTimer: number | undefined;

  const paintStars = (upTo: number): void => {
    labels.forEach((label, index) => label.classList.toggle("is-on", index < upTo));
  };
  const syncRating = (): void => {
    const value = selectedValue();
    paintStars(value);
    if (ratingText) ratingText.textContent = value ? `${value} af 5` : "";
  };
  const updateCounter = (): void => {
    if (counter) counter.textContent = `${textInput.value.length}/500`;
  };

  labels.forEach((label, index) => {
    label.addEventListener("mouseenter", () => paintStars(index + 1));
  });
  starsWrap.addEventListener("mouseleave", syncRating);
  radios.forEach((radio) => radio.addEventListener("change", () => {
    syncRating();
    clearError(null, "review-rating-error");
  }));
  textInput.addEventListener("input", updateCounter);
  watchControls([nameInput, textInput]);

  form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    const invalid: HTMLElement[] = validateControls([nameInput, textInput]);
    const stars = selectedValue();
    if (!stars) {
      showError(null, "review-rating-error", "Veldu einkunn");
      invalid.push(radios[0] as HTMLElement);
    }
    if (invalid.length) {
      focusFirstError(invalid);
      return;
    }
    const now = new Date();
    const review: UserReview = {
      id: String(Date.now()),
      name: nameInput.value.trim(),
      date: "Rétt í þessu",
      stars,
      text: textInput.value.trim(),
      createdAt: now.toISOString(),
      isUserReview: true,
    };
    saveUserReview(business.id, review);
    form.reset();
    syncRating();
    updateCounter();
    onSaved();
    document.querySelector(`.biz-review[data-review-id="${review.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (success) {
      success.textContent = "Takk! Umsögnin þín hefur verið birt.";
      success.hidden = false;
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        success.hidden = true;
        success.textContent = "";
      }, 4000);
    }
  });
}

/* ===== Business profile page ===== */
function initBusinessProfile(businessList: Business[]): void {
  const businessRoot = document.getElementById("biz-root");
  if (!businessRoot) return;
  const businessId = new URLSearchParams(window.location.search).get("id");
  const business = businessList.find((item) => item.id === businessId);
  if (!business) {
    businessRoot.hidden = true;
    const notFound = document.getElementById("biz-notfound");
    if (notFound) notFound.hidden = false;
    document.title = "Fyrirtækið fannst ekki – TÍNT";
    return;
  }
  const setText = (id: string, text: string): void => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  };
  const setLink = (id: string, url: string, label?: string): void => {
    const element = document.getElementById(id);
    if (!(element instanceof HTMLAnchorElement)) return;
    element.href = url;
    if (label) element.setAttribute("aria-label", label);
  };
  const starsHtml = (filled: number): string => Array.from({ length: 5 }, (_, index) =>
    `<i data-lucide="star"${index < filled ? ' class="is-filled"' : ""}></i>`).join("");
  const formatRating = (rating: number): string => String(rating).replace(".", ",");
  const reviewCountText = (count: number): string =>
    count % 10 === 1 && count % 100 !== 11 ? `${count} umsögn` : `${count} umsagnir`;
  document.title = `${business.name} – TÍNT`;
  setText("biz-title", business.name);
  const businessTags = document.getElementById("biz-tags");
  if (businessTags) businessTags.innerHTML = [CATEGORY_NAMES[business.category], business.location, STORE_TYPE_NAMES[business.storeType]]
    .map((tag) => `<li>${tag}</li>`).join("");
  const imageEntries: [string, string | undefined, string][] = [
    ["biz-img-main", business.image, `Mynd af ${business.name}`],
    ["biz-img-1", business.gallery[0], `Fleiri myndir frá ${business.name} (1)`],
    ["biz-img-2", business.gallery[1], `Fleiri myndir frá ${business.name} (2)`],
  ];
  imageEntries.forEach(([id, source, alt]) => {
    const image = document.getElementById(id);
    if (!(image instanceof HTMLImageElement) || !source) return;
    image.src = source;
    image.alt = alt;
  });
  setText("biz-about", business.about);
  setLink("biz-website", business.website);
  setLink("biz-instagram", business.instagram, `${business.name} á Instagram`);
  setLink("biz-facebook", business.facebook, `${business.name} á Facebook`);
  const address = document.getElementById("biz-address");
  if (address) address.innerHTML = business.storeType === "netverslun" ? "Netverslun" : `${business.address}<br>${business.postcode}`;
  const hours = document.getElementById("biz-hours");
  if (hours) hours.innerHTML = business.hours.join("<br>");
  const ratingStars = document.getElementById("biz-rating-stars");
  const reviews = document.getElementById("biz-reviews");
  const toggleButton = document.getElementById("reviews-toggle");
  const PREVIEW_COUNT = 3;
  let showAll = false;

  const updateRating = (): void => {
    const { rating, count } = calculateRating(business);
    const countButton = document.getElementById("biz-rating-count");
    const emptyText = document.getElementById("biz-rating-empty");
    const valueText = document.getElementById("biz-rating-value");
    if (countButton) countButton.hidden = count === 0;
    if (emptyText) emptyText.hidden = count !== 0;
    if (valueText) valueText.hidden = count === 0;
    if (ratingStars) {
      ratingStars.setAttribute("aria-label", count === 0
        ? "Engar umsagnir enn"
        : `${formatRating(rating)} af 5 stjörnum, ${reviewCountText(count)}`);
      ratingStars.innerHTML = starsHtml(count === 0 ? 0 : Math.round(rating));
    }
    if (count > 0) {
      setText("biz-rating-value", formatRating(rating));
      setText("biz-rating-count", reviewCountText(count));
    }
    lucide.createIcons();
  };

  const renderReview = (review: Review): string => {
    const own = "isUserReview" in review ? (review as UserReview) : null;
    const tag = own
      ? `<span class="review-tag">Þín umsögn</span><button type="button" class="review-delete" data-review-id="${escapeHtml(own.id)}">Eyða</button>`
      : "";
    return `
      <article class="biz-review"${own ? ` data-review-id="${escapeHtml(own.id)}"` : ""}>
      <div class="review-head"><p class="label biz-strong">${escapeHtml(review.name)}</p>${tag}</div>
      <p class="small">${escapeHtml(review.date)}</p>
      <span class="biz-stars biz-stars-sm" role="img" aria-label="${review.stars} af 5 stjörnum">${starsHtml(review.stars)}</span>
      <p class="label">${escapeHtml(review.text)}</p></article>`;
  };

  const renderReviews = (): void => {
    if (!reviews) return;
    const all = getAllReviews(business);
    const visible = showAll ? all : all.slice(0, PREVIEW_COUNT);
    reviews.innerHTML = visible.map(renderReview).join("");
    if (toggleButton) {
      toggleButton.hidden = all.length <= PREVIEW_COUNT;
      toggleButton.setAttribute("aria-expanded", String(showAll));
      toggleButton.textContent = showAll ? "Sýna færri" : `Sjá allar umsagnir (${all.length})`;
    }
    lucide.createIcons();
  };

  const refreshReviews = (): void => {
    updateRating();
    renderReviews();
  };

  toggleButton?.addEventListener("click", () => {
    showAll = !showAll;
    renderReviews();
  });
  document.getElementById("biz-rating-count")?.addEventListener("click", () => {
    if (!showAll) {
      showAll = true;
      renderReviews();
    }
    reviews?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  reviews?.addEventListener("click", (event: MouseEvent) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>(".review-delete") : null;
    if (!button?.dataset.reviewId) return;
    if (!confirm("Viltu eyða umsögninni?")) return;
    deleteUserReview(business.id, button.dataset.reviewId);
    refreshReviews();
  });
  refreshReviews();
  initReviewForm(business, () => {
    refreshReviews();
  });
  const heart = document.getElementById("biz-heart");
  if (heart instanceof HTMLButtonElement) {
    heart.dataset.id = business.id;
    setHeartState(heart, isFavorite(business.id));
    heart.addEventListener("click", () => {
      setHeartState(heart, toggleFavorite(business.id));
      popHeart(heart);
    });
    onFavoritesChange(() => setHeartState(heart, isFavorite(business.id)));
  }
  lucide.createIcons();
}

/* ===== Data-dependent startup ===== */
async function init(): Promise<void> {
  try {
    businesses = await loadBusinesses();
  } catch {
    return;
  }
  updateFavoritesBadge();
  onFavoritesChange(updateFavoritesBadge);
  const search = initSearch(businesses);
  initFavoritesPage(businesses);
  initExplorePage(businesses, search);
  initBusinessProfile(businesses);
}

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initNewsletter();
  initApplicationForm();
  initContactForm();
  void init();
});
