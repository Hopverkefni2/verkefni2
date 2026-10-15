# TÍNT

TÍNT er vefsíða sem kynnir íslensk fyrirtæki og hjálpar fólki að finna verslanir, vörur og þjónustu á Íslandi á einum stað. Notendur geta leitað að fyrirtækjum, síað eftir flokkum og staðsetningu, skoðað síðu hvers fyrirtækis og vistað uppáhaldsfyrirtæki.

Þetta er hópverkefni í Vefþróun í Tækniakademíunni, haust 2026.

## Hlekkir

- **Lifandi útgáfa:** [https://tint-island.netlify.app/]
- **Hönnun (Figma):** [https://www.figma.com/design/EOtB431EwqGXiRh0KBh4My/H%C3%B3paverkefni-2?node-id=0-1&t=toR5hQAeRumPZYf5-1]
- **Kóði (GitHub):** [https://github.com/Hopverkefni2/verkefni2]
- **Skýrsla um kóðann:** [https://tint-island.netlify.app/ai-report.html]/ai-report.html

## Síður

| Síða | Skrá | Lýsing |
|---|---|---|
| Forsíða | `index.html` | Hetjusvæði, flokkar, fyrirtæki vikunnar, fréttabréf og um okkur |
| Öll fyrirtæki | `fyrirtaeki.html` | Öll fyrirtæki með leit, flokkum, síum og röðun |
| Fyrirtækjasíða | `fyrirtaeki-sida.html?id=...` | Sniðmát sem sýnir upplýsingar, myndir og umsagnir um hvert fyrirtæki |
| Uppáhald | `favorites.html` | Fyrirtæki sem notandinn hefur vistað |
| Sækja um | `saekja-um.html` | Umsóknarform fyrir fyrirtæki sem vilja vera með |
| Hafa samband | `hafa-samband.html` | Samskiptaupplýsingar, form og algengar spurningar |
| Skýrsla | `ai-report.html` | Tæknileg skýrsla um verkefnið og kóðann |

`bakad.html` vísar áfram á `fyrirtaeki-sida.html?id=bakad`, svo eldri hlekkir virki enn.

## Virkni

### Leit
- Leitarstikan í hausnum virkar á öllum síðum.
- Á meðan skrifað er birtist fellilisti með fyrirtækjum sem passa. Smellt er á fyrirtæki til að opna síðu þess.
- Leitað er í nafni, staðsetningu, flokki, merkjum og lýsingu.
- Leitin hunsar íslenska stafi, svo „bakad“ finnur „Bakað“.
- Hægt er að fletta í listanum með örvatökkum, Enter og Escape.
- Enter opnar **Öll fyrirtæki** með niðurstöðunum, og leitin virkar þar saman við síurnar.

### Öll fyrirtæki
- Flokkar, staðsetning, tegund verslunar, merki (t.d. Handgert, Gjafavörur) og röðun eftir nafni.
- Allar síur virka saman, og fjöldi niðurstaðna uppfærist strax.
- Hægt er að opna síðuna með flokk eða leit fyrirfram valin, t.d. `fyrirtaeki.html?flokkur=fatnadur` eða `fyrirtaeki.html?leit=bakarí`.

### Fyrirtækjasíður
- Ein sniðmátssíða fyrir öll fyrirtæki. Hún les `?id=` úr slóðinni og fyllir inn upplýsingarnar með JavaScript.
- Sýnir myndasafn, lýsingu, staðsetningu, opnunartíma, einkunn og umsagnir.
- Ef fyrirtækið finnst ekki birtast skilaboð með hlekk á öll fyrirtæki.
- Hægt er að skrifa umsögn á öllum fyrirtækjasíðum (nafn, 1–5 stjörnur og texti). Umsagnirnar eru vistaðar í `localStorage` (lykill `tint-reviews`) og eru því aðeins sýnilegar í þeim vafra þar sem þær voru skrifaðar. Einkunn og fjöldi umsagna uppfærast með þeim.

### Uppáhald
- Smellt er á hjartað á mynd fyrirtækis til að vista það. Hjartað verður rautt.
- Uppáhald er vistað í `localStorage` vafrans og helst á milli síðna og heimsókna.
- Talan við **Uppáhald** í hausnum sýnir fjölda vistaðra fyrirtækja.
- Á uppáhaldssíðunni er hægt að sía eftir flokkum og fjarlægja fyrirtæki.

### Form
- **Fréttabréf:** athugar netfangið og sýnir þakkarskilaboð.
- **Sækja um:** villuboð við hvern reit, val um verslun og/eða netverslun, og upphleðsla mynda með drag og sleppa.
- **Hafa samband:** villuboð og þakkarskilaboð.

> Athugið: Engin gögn eru send á netþjón. Form sýna aðeins staðfestingarskilaboð.

### Annað
- Skalast að öllum skjástærðum, frá 360px síma upp í stóran skjá.
- Sami haus og fótur á öllum síðum.
- Myndir sem vantar birtast sem gráir kassar.

## Tækni

| Tækni | Notkun |
|---|---|
| HTML, CSS og TypeScript | Án ramma (frameworks); TypeScript er þýtt í JavaScript |
| CSS-breytur | Litir og letur úr útlitsleiðbeiningum, skilgreind á einum stað |
| CSS Grid og Flexbox | Útlit og skölun |
| Media queries | Brotpunktar við 1024px, 768px og 480px |
| `localStorage` | Vistar uppáhaldsfyrirtæki í vafranum |
| `URLSearchParams` | Les `?id=`, `?flokkur=` og `?leit=` úr slóðinni |
| [Lucide](https://lucide.dev) | Tákn |
| Google Fonts | **Freeman** (fyrirsagnir) og **Amarna** (meginmál) |
| Figma | Hönnun |
| GitHub Copilot og Claude | Aðstoð við kóða og prompt-gerð |
| Netlify | Hýsing |

## TypeScript

Upprunakóði er í `script.ts` og er þýddur með `tsc` (eða `tsc --watch` meðan unnið er). `script.js` er mynduð úttaksskrá og á ekki að breyta beint. Fyrirtækjagögn eru í `data/businesses.json` og sótt með `fetch`. Opnaðu síðuna í gegnum staðbundinn vefþjón, til dæmis VS Code Live Server, en ekki með því að tvísmella á `index.html`, því `fetch` virkar ekki með `file://`.

## Skráarskipulag

```
Hopverkefni 2/
├── README.md
└── Hopverkefni 2/
    ├── tsconfig.json
    ├── index.html
    ├── fyrirtaeki.html
    ├── fyrirtaeki-sida.html
    ├── favorites.html
    ├── saekja-um.html
    ├── hafa-samband.html
    ├── bakad.html
    ├── ai-report.html
    ├── style.css          # Sameiginlegir stílar, skipt í hluta eftir síðum
    ├── script.ts          # TypeScript-upprunakóði
    ├── script.js          # Þýdd virkni, hlaðin af HTML-síðunum
    ├── data/
    │   └── businesses.json # Fyrirtækjagögn sótt með fetch
    └── images/
        ├── hero.jpg
        ├── bakad.jpg
        ├── bakad/         # Myndir fyrir Bakað
        ├── flokkar/       # Myndir fyrir flokka á forsíðu
        └── fyrirtaeki/    # Myndir fyrir öll fyrirtæki
```

## Hvernig á að keyra 

1. Sæktu verkefnið:
   ```
   git clone [GitHub-slóð]
   ```
2. Opnaðu möppuna í gegnum **Live Server** í VS Code eða annan staðbundinn vefþjón. Ekki tvísmella á `index.html`, því þá virkar `fetch` ekki.

Engin uppsetning eða pakkar eru nauðsynleg.

## Hvernig á að bæta við fyrirtæki

Öll fyrirtæki eru geymd í `data/businesses.json`. Til að bæta við fyrirtæki:

1. Bættu nýjum hlut í fylkið með sömu reitum og hin fyrirtækin (`id`, `name`, `location`, `category`, `storeType`, `tags`, `description`, `about`, `address`, `hours`, `rating`, `reviews` o.s.frv.).
2. Settu myndirnar í `images/fyrirtaeki/`: `[id].jpg`, `[id]-1.jpg` og `[id]-2.jpg`.

Fyrirtækið birtist þá sjálfkrafa á **Öll fyrirtæki**, í leitinni og fær sína eigin síðu á `fyrirtaeki-sida.html?id=[id]`.

## Uppfærsla á lifandi útgáfu

Kóðinn er í einkageymslu (private repository) í eigu GitHub-stofnunar, svo síðan er hýst á Netlify með handvirkri uppfærslu:

1. Opnaðu síðuna á [app.netlify.com](https://app.netlify.com) og farðu í **Deploys**.
2. Dragðu innri `Hopverkefni 2`-möppuna inn á síðuna.

## Útlitsleiðbeiningar

| Litur | Kóði | Notkun |
|---|---|---|
| Blár | `#BFD9E8` | Hetjusvæði, fyrirtæki vikunnar og valdar síur |
| Grænn | `#214E3A` | Takkar og fréttabréf |
| Rjómahvítur | `#F8F5ED` | Leitarstika, form og „Um okkur“ |
| Svartur | `#252525` | Texti og tákn |
| Hvítur | `#FFFFFF` | Bakgrunnur |
| Rauður | `#E0393E` | Vistuð hjörtu og teljari |

## Takmarkanir

- Form senda engin gögn.
- Uppáhald er aðeins vistað í þeim vafra sem er notaður, því engin innskráning er til staðar.
- Fyrirtækin, umsagnirnar og samskiptaupplýsingarnar eru dæmi, ekki raunveruleg gögn.

## Hópurinn

| Nafn | Hlutverk | Framlag |
|---|---|---|
| Oliver | TypeScript / Data & Functionality Developer og Integration + back/front end + Deployment | Sá um gögn og TypeScript, leit, síun, röðun, uppáhald, hleðslu- og villustöður, samþættingu, prófanir og birtingu á Netlify. Vann einnig að Git/GitHub, README og AI-skýrslu. |
| Ingvar | UX Research + Project / Agile Lead | Leiddi verkefnastjórnun, notendarannsóknir, persónur og innsýn, notendasögur, backlog og spretti, auk notendaprófana. |
| Valdís | UI/UX Designer | Vann að UI/UX-hönnun, endurnýtanlegum UI-einingum, fyrirtækjaspjöldum, style guide og heildarútliti. |
| Elma | UI/UX Designer | Vann moodboard og visual direction, hannaði Explore- og Favorites-síðurnar og vann að style guide og heildarútliti. |
| Kristófer | Design – Figma | Vann að litahönnun verkefnisins. |

Hönnunarteymið vann saman að UI/UX-hönnun verkefnisins í Figma. Elma og Valdís unnu saman að heildarútliti og style guide. Ingvar leiddi notendarannsóknir og Design Thinking-ferlið. Oliver útfærði hönnunina sem virkandi vef og sá um virkni, samþættingu, prófanir og birtingu.

## Myndir

Myndir eru fengnar frá [Unsplash].