# Nakładka deweloperska „zaznacz i skomentuj dla AI” (apps/web)

Status: zrealizowane, scalone w PR #12 (commit `4dd5c44` na `main`).

## Kontekst

Deweloper chce wskazać na stronie problem myszką albo dotykiem zamiast opisywać
go słownie. Nakładka działa wyłącznie w `pnpm dev`, zapisuje uwagę jako plik JSON
w `.ai-feedback/` (katalog główny repo, w `.gitignore`), a asystent AI czyta te
pliki i wprowadza zmiany.

Pierwszy komponent kliencki (`'use client'`) i pierwszy Route Handler w `apps/web`.

## Zrealizowano

- **Oznaczanie komponentów:** `devComponentProps(name, file)` (`src/lib/dev-feedback/component-tag.ts`)
  na korzeniach `Header`, `Hero`, `Contact`, `Footer`, `LanguageSwitcher`. Atrybuty
  tylko w `development`. Test `component-tagging.test.ts` sprawdza zgodność nazwy
  i ścieżki z plikiem.
- **Nakładka:** przycisk (min. 44 px, `aria-pressed`), skrót `Ctrl+.`, podświetlenie
  komponentu pod kursorem (`pointermove`), przechwycenie kliknięcia w fazie capture,
  okno `<dialog>` z selektorem, nazwą komponentu i fragmentem tekstu, wysyłka z
  nagłówkiem `Content-Type: application/json`, komunikat sukcesu (`StatusMessage`).
- **Logika DOM** (`dom-inspect.ts`): `findNearestComponent`, `buildSelector`,
  `extractTextSnippet`, `isOverlayElement`.
- **Endpoint** `POST /api/dev-feedback`: 404 poza `development`, 415 dla złego
  Content-Type, 403 dla Origin niezgodnego z Host (z portem), 413 dla body
  powyżej 50 kB (sprawdzane nagłówkiem i faktycznym rozmiarem), 400 dla złego JSON
  lub pól, 201 po zapisie.
- **Walidacja** (`validation.ts`): limity długości zgodne ze specyfikacją,
  `textSnippet` przycinany zamiast odrzucany, `componentFile` opcjonalne,
  `resolveRepoRoot()` znajduje katalog z `.git`, `toFileSlug()` daje bezpieczną nazwę pliku.
- **Zapis** (`storage.ts`): `${Date.now()}-${slug}.json` w `.ai-feedback/`, z kontrolą
  `isInsideDir` przed zapisem i polem `status: "open"`.
- **Konfiguracja:** `allowedDevOrigins` z `DEV_ALLOWED_ORIGINS` (`next.config.ts`,
  parsowanie w `dev-origins.ts`), wpis w `.env.example`.
- **ADR:** `docs/decisions/0007-dev-feedback-csrf.md`.
- **Testy:** Vitest (jednostkowe i komponentowe) oraz Playwright: `dev-feedback-save.spec.ts`
  (tryb dev, osobny config `playwright.dev.config.ts`) i `dev-feedback-prod-absence.spec.ts`
  (build produkcyjny, `CI=1`).
- **CI:** w jobie `web` weryfikacja, że marker nie trafił do `.next/static`; w jobie
  `e2e` uruchomienie testu zapisu w trybie dev.

## Odstępstwa od specyfikacji (decyzje podjęte w trakcie)

1. **`fetch` z nagłówkiem `Content-Type`.** Przykład w specyfikacji go pomijał, co
   dawałoby zawsze 415.
2. **`testIgnore` w `playwright.config.ts`.** Bez tego test zapisu trafiłby do CI
   z buildem produkcyjnym. Plik nie był na liście specyfikacji.
3. **Dynamiczny import nakładki w `layout.tsx`.** Sam warunek na `NODE_ENV` przy
   statycznym imporcie zostawiał kod nakładki w bundlu produkcyjnym (wykryte grepem
   na `.next/static`). Test E2E sprawdzał tylko HTML i tego nie wyłapał.
4. **`maxDepth = 10` w `resolveRepoRoot`.** Przy 6 funkcja nie dochodziła do katalogu
   z `.git` (test wykrył błąd).
5. **Helpery poza `route.ts`.** Next pozwala eksportować z `route.ts` wyłącznie
   handlery HTTP, więc zapis jest w `storage.ts`.
6. **`dataset` zamiast `getAttribute`, `<dialog>` zamiast `role="dialog"`,
   `<output>` zamiast `role="status"`.** Zalecenia SonarQube.
7. **Komunikat sukcesu** to pastylka z ikoną na górze środka (`StatusMessage`), a nie
   krótka informacja przy przycisku. Komponent ma warianty `success` i `error`, żeby
   błędy korzystały z tego samego wyglądu.
8. **Stub `showModal` w testach.** jsdom nie implementuje metod `<dialog>`.

## Weryfikacja

- `pnpm qa`: 16 plików, 76 testów, zielone.
- `pnpm test:e2e`: 48 passed, 8 skipped (testy produkcyjne wymagają `CI=1`).
- `pnpm test:e2e:dev-feedback`: zapis pliku, odczyt pól, usunięcie pliku po teście.
- `CI=1 pnpm exec playwright test e2e/dev-feedback-prod-absence.spec.ts`: 8/8.
- `grep -rl "__KULDEV_DEV_FEEDBACK_OVERLAY__" .next/static`: brak wyniku po buildzie produkcyjnym.
- CI na PR #12: `api`, `web`, `e2e` zielone.

## Otwarte

- Ręczne sprawdzenie na szerokości 375 px z dotykiem (punkt w opisie PR).
- Opcjonalnie: test z telefonu w sieci LAN z `DEV_ALLOWED_ORIGINS`.
