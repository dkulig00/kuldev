# Fundament animacji (Motion) dla apps/web — kierunek „Studio”

## Kontekst

Kierunek „Studio” (ADR 0002) zakłada stronę z charakterem, ale `apps/web` nie ma
dziś animacji poza CSS-owym `slide-down` w nakładce deweloperskiej (już z
`motion-reduce:animate-none`). Zanim pojawią się kolejne sekcje, potrzebny jest
wspólny fundament: jedna biblioteka, małe prymitywy i reguły pilnujące dostępności,
wydajności i tego, że treść nigdy nie czeka na JavaScript. Bez tego każdy komponent
dokładałby własne efekty („fade-up na każdej sekcji”, które ADR 0002 i skill
frontend-design odradzają).

W fundamencie są tylko prymitywy z realnym użyciem na stronie: `MotionProvider`
i `Reveal` (użyty w sekcji Contact). Animacja zależna od pozycji przewijania
(`ScrollTransform`) trafi do PR-a z sekcją Usługi.

## Ustalenia techniczne

- `motion` **14.0.0** (dist-tag `latest`), peer `react ^18.0.0 || ^19.0.0` →
  zgodne z React 19.3 i Next 16.3 (pliki z `motion/react` muszą mieć `'use client'`).
- Rozmiar: pełny `motion.*` ≈ 34 kB; `m.*` z `motion/react-m` + `LazyMotion`
  ≈ 4,6 kB na pierwszy render; `domAnimation` +15 kB (animacje, warianty, gesty);
  `domMax` +25 kB (drag, layout) — **nie używamy**.
- `domAnimation` ładowane **asynchronicznie** (`features={() => import('./features')…}`),
  poza ścieżką krytyczną. `LazyMotion strict` rzuca błąd przy pełnym `motion.*`.
- `MotionConfig reducedMotion="user"` wyłącza transformacje i layout, ale **zostawia
  opacity** — dlatego `Reveal` sam sprawdza `useReducedMotion()` i wtedy nic nie animuje.
- `initial={{ opacity: 0 }}` trafia do HTML z SSR jako inline style — dlatego
  `Reveal` go **nie używa** (patrz niżej).
- Do potwierdzenia po instalacji w `node_modules/motion`: warianty z
  `transition: { duration: 0 }` i `useInView` działają z `m.*` + async `domAnimation`.

## Jak `Reveal` nie ukrywa treści (wejście przez `/pl#kontakt`)

Zasada: **ukryć można tylko element, którego użytkownik w tej chwili nie widzi,
i tylko tym samym kodem, który potem go pokaże.**

1. **SSR i pierwszy render:** `m.div` z `initial={false}` i wariantem `visible`
   (`opacity: 1`, `y: 0`) → HTML zawiera widoczną treść. Bez JS, przy wolnym JS
   i przed hydratacją wszystko jest widoczne.
2. **Po hydratacji** (`useLayoutEffect`, raz) funkcja `shouldArmReveal()` decyduje,
   czy uzbroić animację. Uzbraja **tylko gdy wszystkie** warunki są spełnione:
   - brak `prefers-reduced-motion: reduce`,
   - element jest w całości poniżej dolnej krawędzi viewportu
     (`getBoundingClientRect().top > window.innerHeight`) — elementy w widoku lub
     nad nim (np. po przewinięciu przez przeglądarkę) zostają widoczne,
   - `location.hash` nie wskazuje na sam element, jego przodka ani potomka
     (`/pl#kontakt`, linki wysyłane klientom, CTA „Wyceń projekt”).
3. **Stan uzbrojony:** `animate = inView ? 'visible' : 'hidden'`, gdzie `inView`
   pochodzi z `useInView(ref, { once: true, amount: 0.3 })` (żywy stan, nie
   jednorazowy odczyt). Wariant `hidden` ma `transition: { duration: 0 }`, więc
   element znika natychmiast — ale tylko kiedy jest poza widokiem.
4. **Wolny lub nieudany chunk z animacjami:** zarówno ukrycie, jak i pokazanie
   wykonuje `domAnimation`. Jeśli chunk się nie załaduje, element nigdy nie zostanie
   ukryty. Jeśli załaduje się późno, a użytkownik zdążył przewinąć do elementu,
   `inView === true` → wariant `visible` (no-op), bez mignięcia.
5. Atrybut `data-reveal="static" | "armed"` — do testów i debugowania.

Konsekwencja: nie potrzeba reguł CSS z `!important` ani `<noscript>`.

## Zasady (ADR 0008 + CLAUDE.md)

1. `prefers-reduced-motion` respektowane globalnie: `MotionConfig reducedMotion="user"`
   - `useReducedMotion()` w prymitywach. Bez animacji strona jest kompletna.
2. Animujemy wyłącznie `transform` (x, y, scale, rotate) i `opacity`; typy props
   prymitywów nie przyjmują innych właściwości.
3. Treść widoczna bez czekania na JS: żaden stan ukryty w HTML z SSR; ukrywanie
   tylko po hydratacji i tylko poza viewportem; Hero bez animacji wejścia.
4. Animowane fragmenty to małe komponenty klienckie w `src/components/motion/`;
   sekcje zostają Server Components i tylko owijają treść.
5. Import `motion`/`motion/*` dozwolony wyłącznie w `src/components/motion/`
   (ESLint). Żadnych innych bibliotek animacji ani płynnego przewijania.
6. Ruch niewywołany przez użytkownika — oszczędnie: jeden zaplanowany moment,
   nie efekt na każdej sekcji (ADR 0002).
7. Nowy prymityw trafia do `src/components/motion/` dopiero razem z pierwszym
   realnym użyciem.

## Zmiany

### 1. Zależność

- `cd apps/web && pnpm add motion@14.0.0` (zgoda na tę jedną zależność; wersja
  przypięta jak `next`/`react`).

### 2. Prymitywy — `apps/web/src/components/motion/` (nowe pliki)

- `features.ts`: `export default domAnimation`.
- `MotionProvider.tsx` (`'use client'`): `<LazyMotion features={loadFeatures} strict>`
  - `<MotionConfig reducedMotion="user">`; `children` przechodzą przez props, więc
    sekcje pozostają Server Components.
- `reveal-logic.ts`: czysta funkcja
  `shouldArmReveal({ top, viewportHeight, hash, element, reducedMotion })` —
  testowalna bez przeglądarki.
- `Reveal.tsx` (`'use client'`): logika z sekcji wyżej; props: `children`,
  opcjonalnie `y` (domyślnie 16) i `delay`.
- `index.ts`: eksport `MotionProvider`, `Reveal`.
- `component-tagging.test.ts` bez zmian (skanuje tylko `src/components/*.tsx`).

### 3. `apps/web/src/app/[locale]/layout.tsx`

- `{children}` (wewnątrz `NextIntlClientProvider`) owinięte w `<MotionProvider>`.

### 4. `apps/web/src/components/Contact.tsx` — pierwsze użycie

- Dalej Server Component: nagłówek, akapit i przycisk w jednym `<Reveal>`;
  `<section id="kontakt">` zostaje na zewnątrz (cel kotwicy nigdy nie jest ukryty,
  a `shouldArmReveal` widzi hash na przodku).
- `Hero.tsx` bez zmian.

### 5. `apps/web/eslint.config.mjs`

- Do istniejącego `no-restricted-imports` dodać `patterns` blokujące `motion`,
  `motion/*`, `framer-motion` (komunikat z odnośnikiem do ADR 0008), z zachowaniem
  reguły `next/font/google`; osobny blok `files: ['src/components/motion/**']`
  dopuszczający te importy.

### 6. Testy

**Vitest**

- `vitest.setup.ts`: mock `window.matchMedia` (sterowalna flaga reduced motion)
  i `IntersectionObserver` (jsdom ich nie ma).
- `reveal-logic.test.ts`: element w viewporcie → nie uzbraja; nad viewportem → nie;
  poniżej → tak; hash na elemencie / przodku / potomku → nie; reduced motion → nie.
- `Reveal.test.tsx`:
  - `renderToString` → HTML bez `opacity:0`;
  - element poza viewportem (mock `getBoundingClientRect`) → `data-reveal="armed"`;
    w viewporcie lub przy reduced motion → `"static"`;
  - `LazyMotion` z loaderem, który nigdy się nie rozwiązuje → mimo uzbrojenia
    brak `opacity: 0` (symulacja nieudanego chunka).
- `MotionProvider.test.tsx`: renderuje dzieci; `motion.div` wewnątrz rzuca błąd (`strict`).
- `Contact.test.tsx`: aktualizacja — treść w wrapperze `[data-reveal]`, `#kontakt` na sekcji.

**Playwright**

- `playwright.config.ts`: `use.reducedMotion: 'reduce'` globalnie
  (`playwright.dev.config.ts` dziedziczy przez `...base`).
- `e2e/motion-reduced.spec.ts` (pl, en; wszystkie projekty, w tym iPhone SE 375 px):
  - Hero `h1` i treść Contact mają `opacity: 1`, `transform: none`, Contact
    z `data-reveal="static"` także po przewinięciu;
  - `test.use({ javaScriptEnabled: false })`: Hero i Contact widoczne bez JS.
- `e2e/motion-full.spec.ts` (`test.use({ reducedMotion: 'no-preference' })`):
  - `goto('/pl#kontakt')` → treść kontaktu od razu `opacity: 1`; skrypt
    `addInitScript` próbkuje w `requestAnimationFrame` minimalne opacity
    `[data-reveal]` przez 1,5 s po załadowaniu → minimum musi wynosić 1
    (wykrywa mignięcie, nie tylko stan końcowy); `data-reveal="static"`;
  - `goto('/pl')` przy niskim viewporcie (np. 375×400, z asercją wstępną, że
    Contact jest poza widokiem) → `data-reveal="armed"`, opacity 0; po przewinięciu
    do `#kontakt` → `expect.poll` dochodzi do opacity 1.

### 7. Dokumentacja

- `docs/decisions/0008-motion-foundation.md` (EN, format jak 0007: Context /
  Decision / Risk if ignored / Revisit when): zasady 1–7, strategia `Reveal`
  (ukrywanie po hydratacji, tylko poza viewportem, nie przy hash), `m` + async
  `domAnimation`, zakaz innych bibliotek animacji i smooth scroll.
- `CLAUDE.md`: sekcja `## Motion` — krótka lista zasad + odnośnik do ADR 0008.

## Commity

1. `docs: add motion foundation plan` — zapis tego planu w
   `docs/plans/2026-10-07-motion-foundation.md`.
2. `docs: add ADR 0008 motion foundation and rules in CLAUDE.md` — ADR 0008
   i sekcja `## Motion`.
3. `feat(web): add motion dependency and MotionProvider` — `pnpm add motion`,
   `features.ts`, `MotionProvider.tsx`, owinięcie w `layout.tsx`, test providera.
4. `chore(web): restrict motion imports to src/components/motion` — reguła ESLint.
5. `feat(web): add Reveal primitive and use it in contact section` —
   `reveal-logic.ts`, `Reveal.tsx`, `index.ts`, zmiana `Contact.tsx`, testy Vitest.
6. `test(web): run e2e with reduced motion and verify content visibility` —
   `reducedMotion` w configu, `motion-reduced.spec.ts`, `motion-full.spec.ts`.

## Weryfikacja

1. `cd apps/web && pnpm qa` — zielone (format, lint, typecheck, Vitest).
2. `cd apps/web && pnpm build` — JS strony głównej przed/po: oczekiwane ~+5 kB
   w ścieżce krytycznej, `domAnimation` w osobnym chunku.
3. `cd apps/web && pnpm test:e2e` — wszystkie projekty.
4. Ręcznie (`pnpm dev`): `/pl` z przewinięciem do Contact; `/pl#kontakt` (brak
   mignięcia); DevTools → Rendering → `prefers-reduced-motion: reduce`; JS wyłączony;
   DevTools → Network → zablokowany chunk `domAnimation` (treść widoczna);
   throttling „Slow 4G” + szybkie przewinięcie.
5. Import `motion/react` w np. `Hero.tsx` → błąd ESLint.
