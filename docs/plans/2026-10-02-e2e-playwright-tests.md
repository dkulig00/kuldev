# Testy E2E (Playwright) dla apps/web

## Kontekst

Projekt `apps/web` ma już solidne pokrycie testami jednostkowymi (Vitest) dla
komponentów i metadanych, ale nic nie weryfikuje realnego zachowania w
przeglądarce: przekierowań językowych (`/` → `/pl`/`/en`), 404 dla
nieobsługiwanych locale (`/de` — zaległość z planu fundamentu
`docs/plans/2026-10-01-foundation-studio-i18n.md`), przełącznika języka,
scrollowania do sekcji kontaktu, braku poziomego scrolla na mobile (reguła
"mobile-first: 375px" z `CLAUDE.md`) oraz dostępności (WCAG 2.1 AA). Braki te
mogą ujawnić się dopiero na produkcji. Celem jest dodanie suity E2E w
Playwright, uruchamianej jako osobny krok CI (nie część `pnpm qa`, bo to
wolniejsze testy przeglądarkowe), pokrywającej te scenariusze na czterech
profilach urządzeń.

Repo nie ma obecnie żadnej konfiguracji Playwright/Cypress — będzie to
pierwsza taka integracja. Zgoda na nowe zależności deweloperskie
`@playwright/test` i `@axe-core/playwright` została już udzielona przez
użytkownika.

**Sprawdzona zgodność wersji** (przez `npm view`):
- `@playwright/test@1.63.0` — najnowsza wersja, wymaga Node ≥ 18 (repo ma
  Node 24 przez `.nvmrc`).
- `@axe-core/playwright@4.13.0` — peer dependency `playwright-core: >=1.0.0`
  (spełnione), wewnętrznie używa `axe-core@~4.13.0`, który obsługuje tagi
  `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` potrzebne do sprawdzenia WCAG 2.1 AA.

## Zmiany

### 1. `apps/web/playwright.config.ts` (nowy plik)

Konfiguracja z `testDir: './e2e'`, `baseURL: 'http://localhost:3000'`,
`trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`.

- `forbidOnly: !!process.env.CI` — blokuje przypadkowy merge `test.only`.
- `retries: process.env.CI ? 1 : 0` — w CI jeden retry na niestabilność
  środowiska (np. timing animacji).
- `reporter: [['list'], ['html', { open: 'never' }]]` — `html` oznacza w
  raporcie testy, które przeszły dopiero po retry, jako *flaky* (widoczne
  przy `retries > 0`); `list` daje czytelny output w logu CI.

`webServer`:
- `command`: `process.env.CI ? 'pnpm start' : 'pnpm dev'` — w CI appka jest
  budowana osobnym krokiem (`pnpm build`) przed uruchomieniem testów, więc
  `webServer` tylko ją startuje; lokalnie reużywa/odpala `pnpm dev`.
- `url: 'http://localhost:3000'`, `reuseExistingServer: !process.env.CI`
- `timeout: 120_000` (120 s na start serwera, zapas na `pnpm start` po
  zimnym buildzie)
- `env: { SITE_URL: 'http://localhost:3000' }` (wymagane przez
  `getSiteUrl()` w `src/config/site.ts`, używane w `generateMetadata`)

`projects` (z `@playwright/test`'s `devices`):
- `Desktop Chrome` → `devices['Desktop Chrome']`
- `Pixel` → `devices['Pixel 7']` (Android, Chromium)
- `iPhone` → `devices['iPhone 14']` (WebKit)
- `iPhone SE` → `devices['iPhone SE']` (WebKit, viewport 375×667 — jedyny z
  czterech profili faktycznie na granicy reguły "mobile-first 375px" z
  `CLAUDE.md`; `Pixel 7` i `iPhone 14` mają szersze viewporty)

### 2. `apps/web/e2e/*.spec.ts` (nowe pliki)

Korzystają z istniejących, już zbadanych elementów: `routing.locales` (`pl`,
`en`) z `src/i18n/routing.ts`, `LanguageSwitcher` (`nav[aria-label="Language
switcher"]`), CTA `href="#kontakt"` (`src/app/[locale]/page.tsx`), sekcja
`#kontakt` z linkiem `mailto:kontakt@kuldev.pl` (`src/components/Contact.tsx`),
oraz `alternates.languages` w `src/app/[locale]/layout.tsx`.

- **`locale-redirect.spec.ts`** — `test.use({ locale: 'pl-PL' })` →
  `goto('/')` → URL kończy się na `/pl`; analogicznie `en-US` → `/en`;
  `goto('/de')` → `response.status() === 404`.
- **`language-switcher.spec.ts`** — na `/pl` klik linku `EN` w przełączniku →
  URL `/en` i zmiana treści (np. `<html lang="en">` lub inny tekst CTA);
  analogicznie w drugą stronę.
- **`cta-contact.spec.ts`** (dla `pl` i `en`) — klik CTA „Wyceń
  projekt”/„Get a quote” → `#kontakt` widoczne w viewport
  (`toBeInViewport()`); link mailto ma `href="mailto:kontakt@kuldev.pl"`.
- **`layout-overflow.spec.ts`** (dla `pl` i `en`, na wszystkich 4 projektach
  Playwright, w tym `iPhone SE` jako właściwy test reguły 375px) —
  `document.documentElement.scrollWidth <= window.innerWidth`.
- **`seo-hreflang.spec.ts`** (dla `pl` i `en`) — w `<head>` obecne
  `link[rel="alternate"][hreflang="pl"]`, `hreflang="en"`,
  `hreflang="x-default"` z poprawnymi `href`.
- **`accessibility.spec.ts`** (dla `pl` i `en`) — `AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()` →
  `violations` puste.

### 3. `apps/web/package.json`

- `devDependencies`: `"@playwright/test": "^1.63.0"`,
  `"@axe-core/playwright": "^4.13.0"`.
- Nowy skrypt: `"test:e2e": "playwright test"` — **nie** dodawany do `qa`.

Uwaga: `tsconfig.json` ma `include: ["**/*.ts", "**/*.tsx", ...]` bez
wykluczenia katalogu `e2e/`, więc pliki testowe będą automatycznie objęte
przez `pnpm typecheck`/`pnpm lint`/`pnpm format:check` (czyli przez `pnpm
qa`) — to pożądane (statyczna poprawność kodu testów), różni się od
uruchamiania samych testów Playwright, którego `qa` nie obejmuje.

### 4. `apps/web/.gitignore` i `.prettierignore`

Dodanie `/test-results`, `/playwright-report`, `/blob-report` do sekcji
`# testing` w `.gitignore` oraz do `.prettierignore` (obok istniejących
wpisów), żeby wygenerowane raporty nie trafiały do repo ani do
`format:check`.

### 5. `.github/workflows/ci.yml` — nowy job `e2e`

Zgodnie z konwencją repo: identyfikator jobu bez pola `name:` (ADR
`0004-ci-no-path-filters.md` + plan `2026-10-02-ci-github-actions.md` —
stabilne ID dla branch protection), `defaults.run.working-directory:
apps/web`, akcje przypięte do pełnego SHA z wersją w komentarzu, pnpm przez
`pnpm/action-setup` + `actions/setup-node` (cache wbudowany przez
`cache: pnpm`), bez `paths:`/`paths-ignore:` (ten sam powód co istniejące
joby).

```yaml
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    defaults:
      run:
        working-directory: apps/web
    env:
      SITE_URL: http://localhost:3000
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1

      - uses: pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413 # v6.1.0
        with:
          package_json_file: apps/web/package.json

      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version-file: apps/web/.nvmrc
          cache: pnpm
          cache-dependency-path: apps/web/pnpm-lock.yaml

      - run: pnpm install --frozen-lockfile

      - uses: actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ hashFiles('apps/web/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-playwright-

      - run: pnpm exec playwright install --with-deps chromium webkit

      - run: pnpm build

      - run: pnpm exec playwright test

      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        if: failure()
        with:
          name: playwright-report
          path: |
            apps/web/playwright-report/
            apps/web/test-results/
          retention-days: 7
```

Build appki to osobny krok (`pnpm build`) przed `pnpm exec playwright
test` — w CI `webServer.command` to tylko `pnpm start` (patrz p. 1), więc
serwer startuje od razu na gotowym buildzie zamiast budować się w tle przy
starcie pierwszego testu. Instalujemy tylko `chromium` i `webkit` (profile
`Pixel`, `iPhone`, `iPhone SE` też korzystają z tych dwóch silników) —
Firefox nie jest używany przez żaden projekt.

### 6. `CLAUDE.md` (root)

Dodanie pod `## Commands`:
```
- Web E2E tests (Playwright, not part of `qa`): `cd apps/web && pnpm test:e2e`
```

## Commity

1. `docs: add E2E Playwright test plan` — zapis tego planu w
   `docs/plans/2026-10-02-e2e-playwright-tests.md`.
2. `test(web): add Playwright E2E test suite` — nowe zależności,
   `playwright.config.ts`, `e2e/*.spec.ts`, skrypt `test:e2e`, wpisy w
   `.gitignore`/`.prettierignore`.
3. `ci: add Playwright E2E job to workflow` — nowy job `e2e` w `ci.yml`
   (plik repo-wide, bez scope — jak istniejący commit `9661d32`).
4. `docs: document E2E test command in CLAUDE.md` — jedna linijka w
   `## Commands`.

## Weryfikacja

1. Lokalnie: `cd apps/web && pnpm install` (po dodaniu zależności), potem
   `pnpm exec playwright install --with-deps` (jednorazowo).
2. `pnpm test:e2e` — reużywa `pnpm dev`, jeśli już działa (`reuseExistingServer`),
   w przeciwnym razie odpala własny serwer deweloperski. Sprawdzić, że
   wszystkie scenariusze przechodzą na 4 projektach (Desktop Chrome, Pixel,
   iPhone, iPhone SE).
3. Celowo zepsuć jeden scenariusz (np. zmienić `href` CTA) i potwierdzić, że
   test faluje oraz że `playwright-report/`/`test-results/` zawierają trace
   i zrzut ekranu.
4. `pnpm qa` — upewnić się, że nadal przechodzi (pliki w `e2e/` są
   lintowane/typowane, ale same testy Playwright się nie uruchamiają).
5. Push na branch `test/e2e-playwright` (już istnieje) i sprawdzić w
   zakładce Actions, że nowy job `e2e` się uruchamia, poprawnie cache'uje
   przeglądarki przy drugim uruchomieniu, i — w razie wymuszonego
   niepowodzenia — publikuje artefakt `playwright-report`.
