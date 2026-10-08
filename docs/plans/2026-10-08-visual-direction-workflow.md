# Plan: kierunek wizualny „Przepływ” (ADR 0009), 3 PR-y

## Kontekst

Kierunek „Studio” (ADR 0002: konsola DJ, fadery, bursztyn i cyjan, Big Shoulders) nie tłumaczy
oferty. kuldev sprzedaje systemy, które pracują za klienta: strony, aplikacje, automatyzacje,
agentów AI. Nowy kierunek opiera język wizualny na tym, co firma buduje: **dane przechodzące
przez kolejne kroki systemu**. Odbiorca (właściciel lub menedżer firmy) ma pomyśleć: „wiedzą,
co robią, i oszczędzą mi czas”.

Zrzuty referencyjne (`docs/design/reference/`) to wzorzec poziomu wykonania: ciemne tło, duża
typografia, dużo powietrza, ponumerowane usługi, CTA w każdej sekcji. Ich wygląd to granat
i błękit, zdjęcia ludzi, robot 3D, gwiazdki ocen i plakietki ALL CAPS. Celowo się od tego
odcinamy: żadnego granatu ani błękitu jako akcentu, żadnych zdjęć ani 3D, żadnych liczb i ocen.
Jedynym „obrazem” strony jest schemat przepływu.

## Zmiany po przeglądzie zrzutów PR A (2026-10-08)

Ta sekcja ma pierwszeństwo przed resztą planu tam, gdzie się z nią nie zgadza.

- **Bez budownictwa i bez siatki.** Siatka w tle usunięta. Motyw przepływu to
  przebieg pracy agenta AI i automatyzacji (kroki, stany), a nie rysunek
  techniczny ani Dynamo/BIM. ADR 0009 zaktualizowany.
- **Tło:** gładkie, sekcje oddzielone tonem (`bg` i pas `surface`), w hero
  miękka poświata akcentu w miejscu schematu, bloki to panele `surface`
  z promieniem 12 px.
- **Nagłówek:** przyklejony, półprzezroczysty z rozmyciem; linki nawigacji
  z paskiem akcentu wypełnianym przy hover i fokusie (tylko `transform`);
  `scroll-padding-top` dla linków `#sekcja`. Na telefonach układ zawijany:
  2 rzędy na 375 px, przycisk w 3. rzędzie na 320 px.
- **Hero (już w PR A):** linijka „Automatyzacja, AI i oprogramowanie dla firm”,
  nagłówek „Buduję agentów AI dla Twojej firmy.” (forma pasująca do każdej
  frazy obiegu w PR B), nowy opis, jeden link „Zobacz usługi”; bez
  „Wyceń projekt” (jest w nawigacji).
- **Usługi:** 4 bloki zamiast zakładek i akordeonu, bez linków „Zapytaj o …”;
  uniesienie bloku przy hover. **PR C odpada**, prymitywy `Tabs` i
  `Accordion` nie powstają.
- **Blok wyróżnika usunięty.**
- **Nowa sekcja „O mnie”** (`#o-mnie`, pozycja w nawigacji): monogram,
  przykładowy tekst do podmiany przez użytkownika, trzy zasady pracy.
- **Kontakt:** przyciski obu ścieżek wyrównane do dołu kart.

## Decyzje użytkownika (2026-10-08)

- Paleta **A „Sygnał OK”**. Zieleń to akcent marki, a nie kolor „sukcesu”.
- Fonty: **Archivo (zmienny) + IBM Plex Mono**.
- Usługi: desktop **zakładki z łącznikiem**, telefon **akordeon**.
- Pauza ruchu:
  - fraza robi jeden obieg ≤ 5 s;
  - schemat ma przycisk „Wstrzymaj animację”;
  - pasek ma przycisk pauzy oraz pauzę na hover i fokus;
  - przyciski są prawdziwymi `<button aria-pressed>` z widoczną etykietą, mają min. 44×44 px
    i przy reduced motion są ukryte.
- Pasek technologii: ciągły ruch samoczynny jako drugi wyjątek obok schematu (ADR 0008).
- Technologie: Laravel, PHP, PostgreSQL, Next.js, React, TypeScript, Tailwind CSS, Python,
  Revit, Dynamo, Playwright, Docker. Bez frameworka mobilnego.
- Podział na 3 PR-y: **A** fundament, **B** Hero, **C** Usługi. W każdym robię zrzuty i czekam
  na akceptację. Commity na bieżąco, zrzuty przed otwarciem PR.

---

## 1. Kierunek projektowy

### Źródło stylu
Rysunek techniczny i graf węzłów z Dynamo (BIM, doświadczenie założyciela):
- prostokątne węzły;
- **ortogonalne** połączenia (tylko kąty proste);
- siatka konstrukcyjna;
- podpisy węzłów pismem technicznym.

To schemat procesu (wejście → praca systemu → wynik), a nie „sieć neuronowa z kropek”.

### Tokeny koloru (jedyna obowiązująca tabela)

| token | ciemny | jasny | użycie |
|---|---|---|---|
| `bg` | `#16191C` | `#F4F5F2` | tło strony |
| `surface` | `#1E2226` | `#FFFFFF` | węzły, panele |
| `line` | `#2C3237` | `#D9DCD6` | siatka, połączenia, obramowania |
| `muted` | `#9BA3A9` | `#565E63` | tekst drugorzędny |
| `ink` | `#E8EAE6` | `#15181B` | tekst główny |
| `accent` | `#3FB68B` | `#3FB68B` | tło przycisku głównego, impuls, aktywny węzeł |
| `accent-ink` | `#0E1210` | `#0E1210` | tekst na `accent`, **w obu motywach** |
| `accent-text` | `#3FB68B` | `#0F7A55` | akcent jako tekst, linki, wskaźnik zakładki (≥ 4,5:1) |
| `success` | `#7CB7F0` | `#1F5FA8` | komunikaty powodzenia (celowo nie zielone) |
| `danger` | `#F2706B` | `#B3261E` | błędy |

- To wartości startowe. Skrypt kontrastu może je skorygować, a wszystkie pary trafią z wynikami
  do ADR 0009.
- `success` i `danger` w tym projekcie nie mają jeszcze użycia (kontakt to `mailto`). Definiujemy
  je dla przyszłych formularzy i obejmujemy testem kontrastu. Kolor sukcesu zostaje niebieski,
  żeby nie mylił się z zielenią marki.
- W jasnym motywie przycisk `accent` ma ok. 2,3:1 względem `bg`. WCAG 1.4.11 nie wymaga tego
  kontrastu przy etykiecie tekstowej, ale dla wyrazistości dodaję obramowanie `accent-text`.

### Typografia i rytm
- **Kroje:**
  - Archivo do nagłówków (szerokość 112.5%, 600) i treści (100%, 400/500);
  - IBM Plex Mono tylko do etykiet węzłów i numerów usług;
  - Big Shoulders usunięty.
- **Skala 1.25 od 16 px:** 16 / 20 / 25 / 31 / 39 / 49 / 61. Hero na desktopie do ~72 px
  przez `clamp()`. Nagłówki z interlinią 1.05–1.1, treść 1.6, linia maks. ~68 znaków.
- **Odstępy i siatka:** baza 8 px, sekcje `py-24` / `py-32`. Tło to siatka 32 px o kontraście
  ~3–4% (dwa `linear-gradient` na `body`, bez obrazków).
- **Wyrównanie:** do lewej wszędzie.

### Zasady
1. Jedno miejsce odwagi to schemat w hero. Reszta jest spokojna.
2. Linie i węzły pojawiają się tylko tam, gdzie coś płynie: hero, łącznik aktywnej usługi
   z panelem, później „Jak pracuję”.
3. Akcent oznacza „tu płynie praca”, nie dekorację.
4. Bez ALL CAPS, bez „→” na przyciskach, bez meta z kropkami, bez pigułek, bez cieni.
5. Mono tylko w węzłach i numerach usług.
6. Zaokrąglenia hierarchiczne: węzły 2 px, przyciski 6 px.

### Szkielet docelowy (po PR C)
```
┌ kuldev▪   Usługi  Kontakt            PL EN  ◐  [Wyceń projekt] ┐
│ Inżynieria oprogramowania dla firm      ┌ Zapytanie klienta ┐   │
│ Buduję [agentów AI ]                     └────────┬──────────┘   │
│ które pracują za Twoją firmę.                     ● impuls       │
│ Jedno zdanie oferty                      ┌ Agent AI ─────────┐   │
│ [Wyceń projekt]  Zobacz usługi           └──┬─────────────┬──┘   │
│                                       ┌ Odpowiedź ┐ ┌ Wpis CRM ┐ │
│                                       [Wstrzymaj animację]       │
├ Laravel  PHP  PostgreSQL  Next.js ...                 [Pauza] ──┤
│ Usługi   01 ───────┐ ┌ panel: opis, cechy, Zapytaj o … ┐         │
│          02        └─┤                                  │         │
│          03          └──────────────────────────────────┘         │
│          04      Wyróżnik (testy, jakość)       [Wyceń projekt]   │
├ Kontakt  ┌ Krótka wiadomość ┐ ┌ Pełny brief ┐                      │
└ footer ──────────────────────────────────────────────────────────┘
```
Na telefonie (375 px) wszystko jest w jednej kolumnie: schemat pod CTA w tym samym pionowym
układzie, usługi jako akordeon.

### Autokorekta względem klisz
- **Ciemne tło z neonem** (klisza #2): grafit zamiast `#0B0B0B`, stonowany akcent
  o znaczeniu i pełnoprawny jasny motyw.
- **Bento z cieniami** (klisza #4): lista z łącznikiem i akordeon, bez cieni.
- **Mono i numeracja:** to wymóg briefu, ograniczony do węzłów i numerów.

---

## 2. Zasady wspólne dla wszystkich PR-ów

- **Flaga `data-js` przed malowaniem.** Skrypt w `<head>` ustawia dwie rzeczy:
  - `data-theme`, ale tylko gdy w `localStorage` jest zapisany wybór;
  - `document.documentElement.dataset.js`.

  CSS zależny od JS (ukryte panele zakładek, animacja paska) działa tylko pod `[data-js]`.
  Geometria jest więc znana przed pierwszym malowaniem: nie ma skoków przy hydracji, a bez JS
  widać wszystko.
- **Stan SSR = pierwsza klatka animacji = stan statyczny.** Żaden komponent nie zmienia
  w widoku stanu wyrenderowanego przez serwer w momencie hydracji.
- `devComponentProps` na każdym nowym komponencie, także w `ui/`. Nawigacja z
  `src/config/navigation.ts`. Teksty w `messages/*.json` bez myślników. 375 px bez poziomego
  przewijania.
- Commity na bieżąco (Conventional Commits, `feat(web)`, `docs:` …). Przed otwarciem PR:
  zrzuty 375 i 1440 px w obu motywach w `apps/web/.screenshots/`, co najmniej 2 rundy
  krytyki i poprawek, potem pokazuję je Tobie.
- Skrypt zrzutów żyje w scratchpadzie, a nie w repo, żeby nie uruchamiał się w CI.
- Plan zapisuję w `docs/plans/2026-10-08-visual-direction-workflow.md` (PL).

---

## 3. PR A: fundament (szczegółowo)

Gałąź: `feat/visual-direction-v2` (bieżąca).

### A1. Dokumentacja i porządki
- **`.gitignore`:** rozdzielić sklejoną linię na `.ai-feedback/` i `docs/design/reference/`,
  dodać `apps/web/.screenshots/`.
- **`docs/decisions/0009-visual-direction-workflow.md`** (nowy, EN):
  - kierunek i zasady;
  - tabela tokenów obu motywów z policzonymi kontrastami wszystkich używanych par;
  - przeznaczenie `success` i `danger`;
  - uwaga o obramowaniu przycisku w jasnym motywie;
  - kroje;
  - mechanizm motywu i `data-js`;
  - „Risk if ignored” i „Revisit when”.
- **`docs/decisions/0002-visual-direction-studio.md`:** `Status: superseded by 0009`.
- **`docs/decisions/0005-self-host-fonts.md`:**
  - nowa lista krojów;
  - proces dla zmiennego Archivo: źródło to oficjalne repozytorium Omnibus-Type (OFL),
    subset `pyftsubset` z zachowaniem osi `wght` i `wdth` do Latin + Latin Ext-A, `woff2`;
  - limit rozmiaru pliku.
- **`docs/decisions/0008-motion-foundation.md`:** w tym PR tylko usunięcie wzmianek
  o `ScrollTransform` i odwołania do ADR 0002 (→ 0009). Pełna aktualizacja zasad ruchu w PR B.
- **`.claude/skills/apply-feedback/SKILL.md:59`:** ADR 0002 → 0009.
- **`.claude/skills/grill-plan/checklist.md`:**
  - gr. 7: `WCAG AA in both themes` odsyła do ADR 0009 zamiast 0002;
  - gr. 7, nowy punkt „Two responsive trees from the same data duplicate `id`s”. Przykład:
    zakładki i akordeon usług dają te same `id`, axe zgłasza `duplicate-id-aria`, a
    `aria-controls` może wskazać ukryte drzewo. Rozwiązanie: prefiks `id` dla każdego drzewa
    i test na brak duplikatów;
  - gr. 8, nowy punkt „Layout that depends on hydration shifts in view (CLS)”. Przykład:
    panele zakładek ukrywane po hydracji, pasek technologii przechodzący z zawijanej listy
    w jedną linię. Rozwiązanie: flaga `data-js` ustawiana w `<head>` przed malowaniem;
  - nowa grupa **14. „Internal consistency of the plan”**: ta sama wartość albo stan opisane
    w dwóch miejscach planu muszą się zgadzać. Przykłady: dwie tabele tokenów z różnym
    kolorem tekstu na przycisku w jasnym motywie; stan SSR frazy hero („agentów AI”) różny
    od pierwszej klatki animacji („strony”). Kontrola: każdą wartość opisuje jedna tabela
    lub sekcja, a inne miejsca tylko do niej odsyłają.
- **`docs/plans/2026-10-08-visual-direction-workflow.md`:** ten plan.

### A2. Tokeny, fonty, motywy
- **`src/app/globals.css`:**
  - `:root` to motyw ciemny;
  - `@media (prefers-color-scheme: light) { :root:not([data-theme='dark']) { … } }` oraz
    `:root[data-theme='light']` to motyw jasny;
  - `color-scheme` w obu motywach;
  - `@theme inline` mapuje tokeny (`bg-bg`, `bg-surface`, `border-line`, `text-muted`,
    `text-ink`, `bg-accent`, `text-accent-ink`, `text-accent-text`, `text-success`,
    `text-danger`) i fonty (`font-sans`, `font-mono`);
  - `@custom-variant dark` na tym samym selektorze;
  - siatka tła na `body`;
  - usunięcie tokenów Studio (`panel`, `accent-amber`, `accent-cyan`, `font-display`).
- **`src/fonts.ts`, `src/fonts/archivo/`:**
  - zmienny Archivo `archivo-variable.woff2` + `OFL.txt` w `next/font/local` z
    `weight: '100 900'` i zmienną `--font-archivo`;
  - nagłówki z `font-stretch: 112.5%`;
  - Plex Mono bez zmian;
  - usunięte `src/fonts/big-shoulders/` i `src/fonts/ibm-plex-sans/`.
- **`src/lib/theme/`:**
  - `theme-script.ts` to string skryptu inline: try/catch na `localStorage`, ustawia
    `data-theme` tylko przy zapisanym wyborze, zawsze ustawia `dataset.js`;
  - `storage.ts` ma klucz `kuldev-theme` oraz funkcje `readTheme` i `writeTheme`.
- **`src/app/[locale]/layout.tsx`:**
  - `<html suppressHydrationWarning>`;
  - `<head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>`;
  - nowe zmienne fontów.

  Wybieram własne rozwiązanie zamiast `next-themes`, bo nie dodaje zależności i daje pełną
  kontrolę nad `data-js`. Wzorzec `data-theme` na `<html>` opisuje dokumentacja Next 16
  w `node_modules/next/dist/docs` (`not-found.md`, `error.md`).
- **`src/components/ThemeToggle.tsx`** (client):
  - przycisk z `aria-pressed` i etykietą i18n (`theme.toggle`), 44×44 px;
  - bez zapisanego wyboru odczytuje stan z `matchMedia`;
  - zapisuje wybór i ustawia `data-theme`.

### A3. Komponenty
- **`Header.tsx`:**
  - znak „kuldev” z kwadratowym węzłem w `accent`;
  - nawigacja z `navigationItems`, `LanguageSwitcher` (nowy styl), `ThemeToggle`, CTA
    „Wyceń projekt” (`bg-accent text-accent-ink`);
  - na 375 px linki nawigacji w drugim rzędzie, bez poziomego przewijania;
  - bez efektu szkła.
- **`Contact.tsx`:**
  - dwie ścieżki, każda z `mailto:` z `src/config/contact.ts`;
  - „Krótka wiadomość” z tematem „Zapytanie ze strony”;
  - „Pełny brief” z treścią z szablonem pytań (firma, cel, termin, budżet, linki), kodowaną
    przez `encodeURIComponent`, szablon w `messages`;
  - dostępne nazwy obu linków są różne;
  - `Reveal` zostaje.
- **`Footer.tsx`:** znak, e-mail, nawigacja, rok.
- **Tymczasowo do PR B i C:** `Hero.tsx` i `Services.tsx` tylko przestylowane nowymi tokenami.
  Usługi jako prosta lista z treścią z briefu, bez faderów. Treść usług i wyróżnika w
  `messages/*.json` aktualizuję już tutaj do wersji z briefu.
- **Usunięcie Studio:**
  - `FaderTrack.tsx` i jego test;
  - `motion/ScrollTransform.tsx`, `motion/scroll-transform-logic.ts` i ich testy;
  - eksport z `motion/index.ts`;
  - `FADER_LEVEL` z `config/services.ts` i `page.tsx`.

### A4. Testy PR A
- **Vitest:**
  - `ThemeToggle`: przełączanie, `aria-pressed`, zapis, stan z `matchMedia`;
  - `theme-script`: wykonany w jsdom ustawia `data-js`, ustawia `data-theme` tylko przy
    zapisanym wyborze, nie rzuca przy błędzie `localStorage`;
  - **kontrast:** test czyta `src/app/globals.css`, wyciąga tokeny obu motywów i liczy pary
    z ADR 0009 (tekst ≥ 4,5:1, elementy UI ≥ 3:1). Kontrola pozytywna: pomocnik z celowo
    złym kolorem (`accent-text` = `#3FB68B` na jasnym `bg`) musi dać błąd;
  - `component-tagging.test.ts` skanuje też `src/components/ui/`;
  - aktualizacje: `layout.test.tsx` (mock fontów), `Header`, `Contact` (oba `mailto`,
    kodowanie treści), `Footer`, `Services`, `Hero`, `messages.test.ts`.
- **E2E:**
  - `accessibility.spec.ts`: axe dla PL/EN × ciemny/jasny (emulacja `colorScheme` i zapisany
    wybór);
  - `theme.spec.ts` (nowy):
    - przełącznik zmienia i zapamiętuje motyw po przeładowaniu;
    - brak mignięcia: `addInitScript` zapisuje „jasny” przy systemowym „dark” i przez
      `MutationObserver` oraz pierwszą klatkę `requestAnimationFrame` rejestruje `data-theme`
      i tło `body`; ciemne nie może się pojawić;
    - kontrola pozytywna: bez zapisu wygrywa motyw systemowy;
    - bez JS działa motyw systemowy;
  - `motion-reduced.spec.ts`: usunięte asercje faderów, reszta bez zmian;
  - `services.spec.ts`: dopasowany do tymczasowej listy;
  - `layout-overflow.spec.ts` bez zmian.

---

## 4. PR B: Hero (skrótowo)

- **Docs:** pełna aktualizacja ADR 0008 i sekcji Motion w **CLAUDE.md**:
  - ruch wywołany przez użytkownika może być bogaty;
  - ruch samoczynny z umiarem;
  - ciągłe wyjątki: impuls schematu i pasek technologii, oba z pauzą (WCAG 2.2.2);
  - jednorazowy wyjątek: fraza hero ≤ 5 s;
  - zdanie „Hero has no entrance animation” zastąpione regułą: treść hero bez animacji
    wejścia, dozwolone tylko wymienione elementy dekoracyjne;
  - reguła „zmiana stanu tylko poza widokiem” zostaje dla treści, a nie dla dekoracji
    `aria-hidden`.
- **`FlowDiagram.tsx` + `motion/FlowPulse.tsx` + `flow-geometry.ts`:**
  - węzły HTML o stałej wysokości w `rem` (etykieta maks. 2 linie), stałe odstępy;
  - połączenia i keyframes `x`/`y` impulsu liczone z tych samych stałych (tylko `transform`);
  - aktywny węzeł podświetlany przez `opacity`;
  - `<figure>` z `aria-hidden` na rysunku i opisem w `figcaption`, bez elementów
    fokusowalnych;
  - pauza poza widokiem i przy karcie w tle;
  - przycisk „Wstrzymaj animację” / „Wznów animację”;
  - reduced motion i brak JS: statyczny schemat.
- **`motion/RotatingPhrase.tsx`:**
  - wszystkie frazy w jednej komórce siatki, więc szerokość i wysokość są stałe;
  - pełne zdanie `sr-only`, część rotująca `aria-hidden`;
  - SSR, brak JS i reduced motion: „agentów AI”;
  - obieg startuje od frazy z SSR i na niej kończy: **agentów AI → strony → aplikacje mobilne →
    automatyzacje → agentów AI** (4 przejścia, łącznie ≤ 5 s), potem stop;
  - przycisk pauzy schematu zatrzymuje też frazę.
- **`ui/Marquee.tsx` + `TechStrip.tsx` + `config/technologies.ts`:**
  - same nazwy z listy, bez logotypów;
  - animacja CSS `transform` tylko pod `[data-js]` i `prefers-reduced-motion: no-preference`
    (geometria jednej linii znana przed malowaniem);
  - druga kopia `aria-hidden`;
  - pauza przyciskiem oraz na hover i focus-within.
- **Testy:**
  - Vitest dla schematu, frazy i paska;
  - E2E `hero-phrase.spec.ts`:
    - pierwsza klatka po hydracji to „agentów AI”;
    - kolejność fraz zgodna z obiegiem;
    - koniec na „agentów AI” w ≤ 5 s;
    - wymiary hero stałe na 375 i 1440 px;
  - `motion-pause.spec.ts`: próbkowanie `transform` przez 1 s po pauzie daje jedną wartość, a
    przed pauzą różne; `aria-pressed`; ≥ 44×44 px na iPhone SE; przy reduced motion brak
    przycisków;
  - wysokość paska stała między `domcontentloaded` a `networkidle`.

## 5. PR C: Usługi (skrótowo)

- **`ui/Tabs.tsx`** (WAI-ARIA, pionowa lista zakładek):
  - strzałki, Home/End, automatyczna aktywacja, roving `tabindex`;
  - nieaktywne panele ukrywane CSS tylko pod `[data-js]`, bez JS widać wszystkie.
- **`ui/Accordion.tsx`:**
  - natywne `<details name>`, pierwszy element otwarty;
  - animacja treści przez `opacity` i `y`.
- **`Services.tsx`:**
  - dwa drzewa z prefiksami `id` (`svc-tab-*`, `svc-acc-*`);
  - łącznik aktywnej usługi z panelem;
  - link „Zapytaj o …”, wyróżnik i CTA.
- **Testy:**
  - Vitest: klawiatura i ARIA obu prymitywów, brak zduplikowanych `id` w wyrenderowanej sekcji;
  - E2E `services.spec.ts`: zakładki na desktopie i akordeon na iPhone SE z klawiaturą;
  - bez JS akordeon: test klika każde `summary` i sprawdza widoczność treści;
  - wysokość `#uslugi` stała między `domcontentloaded` a `networkidle`;
  - axe w obu motywach.

---

## 6. Weryfikacja (każdy PR)
- `cd apps/web && pnpm qa`.
- `cd apps/web && pnpm build && CI=1 pnpm test:e2e` (produkcyjny build, wszystkie urządzenia).
- Ręcznie w `pnpm dev`:
  - przełączenie motywu i odświeżenie;
  - przejście klawiszem Tab po całej stronie;
  - reduced motion w DevTools;
  - wyłączony JS;
  - 375 px.
- Zrzuty 375 i 1440 px w obu motywach, co najmniej 2 rundy poprawek, Twoja akceptacja przed
  otwarciem PR.
