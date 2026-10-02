# Plan: fundament kuldev.pl — kierunek „Studio” + i18n PL/EN

## Kontekst

To nowe zadanie zastępuje wcześniejszy plan dwóch wariantów demo w `/lab` — teraz
budujemy **realny fundament** strony głównej w `apps/web`: tokeny wizualne kierunku
„Studio” (analogowy pulpit mikserski, metafora jako struktura informacji, nie
dekoracja), routing i18n PL/EN, minimalny layout (header/footer) i pierwszą treść
(Hero + Kontakt). To fundament, na którym kolejne zadania dopiszą dalsze sekcje
(usługi, realizacje, o mnie, FAQ) i rozbudują nawigację.

Kluczowe decyzje podjęte z użytkownikiem przed planowaniem:

- **i18n: next-intl**, nie własne rozwiązanie. next-intl 4.4.0+ deklaruje w
  `peerDependencies` wsparcie dla `next ^16.0.0` i `react ^19.0.0` (sprawdzone w
  rejestrze npm) — pokrywa naszą wersję Next 16.3.7 na poziomie majora. App Router w
  Next 16 nie ma wbudowanego routingu i18n (to istnieje tylko w Pages Routerze), więc
  i next-intl, i rozwiązanie własne wymagałyby tej samej struktury `[locale]` +
  `proxy.ts` — next-intl dodaje do tego poprawną negocjację `Accept-Language`,
  `useTranslations`/`getTranslations` i typowane klucze wiadomości. To nowa zależność
  w `package.json` — zaakceptowana explicite przez użytkownika.
- **ADR:** `docs/decisions/0001-stay-on-eslint-9.md` już istnieje na `main` (dodany
  przez użytkownika). Nowe ADR-y — `0002-visual-direction-studio.md` i
  `0003-i18n.md` — używają tego samego formatu: `# NNNN: Tytuł`, `Date`, `Status`,
  `## Context`, `## Decision`, `## Risk if ignored`, `## Revisit when`.
- **Nawigacja sterowana danymi:** jedna lista sekcji (`id` + klucz tłumaczenia) w
  `src/config/navigation.ts`. Header renderuje tylko pozycje z tej listy. Na razie
  lista zawiera wyłącznie `kontakt` — kolejne zadania dopiszą swoje pozycje, gdy
  powstaną kolejne sekcje.
- **Zakres strony głównej na tym etapie:** Hero + minimalna sekcja Kontakt
  (`id="kontakt"`: nagłówek, jedno zdanie, link `mailto:`). Adres e-mail jako
  konstanta w `src/config/contact.ts` (`kontakt@kuldev.pl` — wartość tymczasowa).
- **Menu mobilne: pominięte w tym zadaniu** (nawigacja ma jedną pozycję, nic do
  zwijania) — dodamy, gdy lista nawigacji się rozrośnie. Bez testów menu mobilnego.

## Ustalenia techniczne

- **Routing:** `src/i18n/routing.ts` (`defineRouting({ locales: ['pl','en'],
defaultLocale: 'pl' })`), `src/proxy.ts` (`createMiddleware(routing)` — w Next 16
  plik/eksport `middleware` jest przemianowany na `proxy`, next-intl już to wspiera),
  `src/i18n/navigation.ts` (lokalizowane `Link`/`usePathname`/`redirect`),
  `src/i18n/request.ts` (`getRequestConfig` ładujący `messages/<locale>.json`).
  `next.config.ts` owinięty `createNextIntlPlugin()`.
- **Restrukturyzacja `app/`:** wszystkie trasy żyją pod `app/[locale]/` (standardowy
  wzorzec next-intl „with i18n routing” — brak osobnego `app/layout.tsx`, bo nie ma
  żadnej trasy poza `[locale]`). To wymaga **usunięcia** obecnych
  `apps/web/src/app/layout.tsx` i `page.tsx` (wciąż domyślny szablon
  create-next-app) i zastąpienia ich przez `app/[locale]/layout.tsx` +
  `app/[locale]/page.tsx`. `globals.css` zostaje (ścieżka importu się zmienia), ale
  jego zawartość jest edytowana (patrz tokeny). To jedyne miejsce w tym zadaniu, gdzie
  świadomie zastępujemy istniejące pliki — to jest cel zadania („fundament”), nie
  izolowany wariant demo jak poprzednio w `/lab`.
- **Tokeny w `globals.css` (Tailwind v4 `@theme`):** zamiast dwóch tokenów CNA
  (`--color-background`/`--color-foreground` + blok `prefers-color-scheme: dark`,
  który usuwamy — „Studio” to jedna świadoma ciemna identyfikacja, nie adaptacyjny
  light/dark), definiujemy:

  ```css
  @theme inline {
    --color-background: #15130F;
    --color-panel: #221F19;
    --color-ink: #F3EFE6;
    --color-accent-amber: #FFB020;
    --color-accent-cyan: #4FD6C4;
    --font-display: var(--font-big-shoulders);
    --font-sans: var(--font-plex-sans);
    --font-mono: var(--font-plex-mono);
  }
  Komponenty używają generowanych klas (bg-background, text-ink,
  bg-accent-amber, font-display...), nigdy hex wprost. Reguła kontrastu: akcenty
  (accent-amber/accent-cyan) służą jako tło przycisków/aktywnych elementów
  zawsze z ciemnym tekstem (text-background) — nigdy jasny ink na akcencie
  (potwierdzone przeliczeniem wcześniej: ink na accent-cyan = 1.56:1, niedozwolone).

  ```

- Fonty: src/fonts.ts — Big_Shoulders_Display, IBM_Plex_Sans,
  IBM_Plex_Mono przez next/font/google (nie są nową zależnością w
  package.json — to część samego Next.js, tak jak już używane Geist/Geist Mono).
- Architektura komponentów — unikanie testowania async Server Components:
  tłumaczenia (getTranslations/getLocale) są pobierane wyłącznie w
  app/[locale]/layout.tsx i page.tsx (jedyne miejsca async), a następnie
  przekazywane jako proste propsy (stringi) do komponentów prezentacyjnych w
  src/components/ (Header, LanguageSwitcher, Footer, Hero, Contact) —
  te są synchronicznymi funkcjami, w pełni testowalnymi w RTL bez mockowania
  next-intl. Żaden komponent w tym zadaniu nie wymaga 'use client' (przełącznik
  języka to dwa statyczne linki next-intl, bez stanu).
- SEO: generateMetadata w app/[locale]/layout.tsx — title/description z
  wiadomości danego języka. metadataBase budowany z nowej zmiennej środowiskowej
  SITE_URL (new URL(process.env.SITE_URL)) — dodawana do apps/web/.env.example
  z wartością lokalną http://localhost:3000. alternates.languages z pełnymi
  adresami absolutnymi: { pl: '{SITE_URL}/pl', en: '{SITE_URL}/en', 'x-default': '{SITE_URL}/pl' } (x-default wskazuje na /pl jako domyślny język). Jeśli
  SITE_URL nie jest ustawione, kod rzuca czytelny błąd („Missing SITE_URL
  environment variable — see apps/web/.env.example") zamiast domyślnego błędu
  konstruktora URL — mała funkcja pomocnicza (np. getSiteUrl() w
  src/config/site.ts) czyta process.env.SITE_URL i waliduje jego obecność przed
  przekazaniem do new URL(...). Obie wersje
  językowe statycznie generowane (generateStaticParams zwracający
  routing.locales) — dokładną nazwę next-intl API do ustawienia request-locale dla
  statycznego renderowania potwierdzić w dokumentacji next-intl 4.14 w momencie
  implementacji (nazwa funkcji zmieniała się między wersjami).
- Nieobsługiwany język → 404: app/[locale]/layout.tsx eksportuje
  export const dynamicParams = false; — w połączeniu z generateStaticParams
  zwracającym wyłącznie ['pl', 'en'] to standardowe zachowanie Next.js App
  Routera: dowolny inny segment [locale] (np. /de) nie ma wygenerowanej strony i
  framework zwraca 404, bez potrzeby ręcznej walidacji w kodzie.
- Typowane klucze tłumaczeń: deklaracja typu (global.d.ts lub
  next-intl.d.ts w apps/web/) importująca messages/pl.json jako kanoniczny
  kształt wiadomości i rejestrująca go w mechanizmie augmentacji next-intl (dokładna
  nazwa modułu/interfejsu do potwierdzenia w dokumentacji next-intl 4.14 przy
  implementacji — API augmentacji typów zmieniało się między wersjami biblioteki).
  Efekt: literówka w kluczu przekazanym do useTranslations/getTranslations
  (np. t('hero.titel')) oblewa pnpm typecheck, bo próba odwołania się do
  nieistniejącego klucza nie przejdzie kontroli typów.

Struktura plików

apps/web/
.env.example (nowy: SITE_URL=http://localhost:3000)
next.config.ts (edytowany: createNextIntlPlugin)
global.d.ts (nowy: typowanie kluczy next-intl z messages/pl.json)
messages/
pl.json
en.json
src/
fonts.ts (nowy)
i18n/
routing.ts navigation.ts request.ts (nowe)
proxy.ts (nowy)
config/
navigation.ts (nowy: [{ id: 'kontakt', labelKey: 'nav.kontakt' }])
contact.ts (nowy: CONTACT_EMAIL = 'kontakt@kuldev.pl')
components/
Header.tsx LanguageSwitcher.tsx Footer.tsx Hero.tsx Contact.tsx (nowe)
app/
globals.css (edytowany: tokeny Studio, usunięcie prefers-color-scheme)
layout.tsx (USUNIĘTY)
page.tsx (USUNIĘTY)
[locale]/
layout.tsx (nowy: <html lang>, fonty, generateMetadata z metadataBase/hreflang/x-default,
generateStaticParams, dynamicParams = false)
page.tsx (nowy: pobiera tłumaczenia, renderuje Header → Hero → Contact → Footer)

CLAUDE.md (root, edytowany): doprecyzowanie sekcji „Language” — plany zapisywane w
docs/plans/ są po polsku, z datą w nazwie pliku (YYYY-MM-DD-slug.md); pozostała
dokumentacja repozytorium (ADR, README, komentarze w kodzie) zostaje po angielsku.

Treść (PL/EN, messages/pl.json i messages/en.json)

Klucze: metadata.title, metadata.description, nav.kontakt, hero.title,
hero.subtitle, hero.cta („Wyceń projekt” / "Get a quote"), contact.heading,
contact.body, contact.emailLabel. Treść zgodna z pozycjonowaniem: nowoczesna,
konkretna, z charakterem; bez ALL-CAPS etykiet, myślników, strzałek w CTA.

Testy (Vitest + RTL, zero nowych zależności testowych)

- Hero.test.tsx — tytuł/podtytuł z propsów, CTA „Wyceń projekt” z href="#kontakt".
- LanguageSwitcher.test.tsx — dwa linki (/pl, /en), aktywny język oznaczony
  (np. aria-current="page").
- Header.test.tsx — logo tekstowe „kuldev”, nawigacja renderuje pozycje z
  config/navigation.ts (obecnie tylko „Kontakt”), CTA obecne.
- Contact.test.tsx — nagłówek, treść, link mailto: zbudowany z CONTACT_EMAIL.
- Footer.test.tsx — nazwa firmy i rok w treści.
- metadata test dla app/[locale]/layout.tsx — generateMetadata dla pl i en
  zwraca poprawny title/description, metadataBase zbudowany z SITE_URL
  (ustawić process.env.SITE_URL w teście) oraz alternates.languages z pełnymi
  adresami pl/en/x-default (x-default → /pl); jeśli wywołanie
  generateMetadata w teście wymaga next-intl server context, zmockować
  next-intl/server (getTranslations) statycznym słownikiem — do rozstrzygnięcia
  przy implementacji.
- messages.test.ts — pl.json i en.json mają identyczny, spłaszczony zestaw
  kluczy (rekurencyjne porównanie ścieżek klucz-po-kluczu, posortowane) — wykrywa
  brakujące tłumaczenie w jednym z języków.
- locale-not-found.test.ts (lub test w [locale]/layout.test.tsx) — asercja
  strukturalna: generateStaticParams() zwraca wyłącznie [{locale:'pl'}, {locale:'en'}] i dynamicParams === false; to jest mechanizm, który sprawia, że
  Next.js zwraca 404 dla /de i innych nieobsługiwanych języków. Pełne
  potwierdzenie na poziomie HTTP (żądanie /de → status 404) wymagałoby testu
  e2e/integracyjnego na żywym serwerze — poza zakresem obecnego setupu
  Vitest/jsdom; do dodania później, jeśli w projekcie pojawi się Playwright lub
  podobne narzędzie.

Bez testów menu mobilnego (funkcja pominięta w tym zadaniu).

ADR

- docs/decisions/0002-visual-direction-studio.md — kontekst: potrzeba wyrazistej,
  nieszablonowej identyfikacji wizualnej; decyzja: paleta/typografia/metafora
  „Studio” jak wyżej; ryzyko: powrót do szablonowych domyślnych wyborów AI
  (krem+terakota, czarne tło+neon, karty SaaS); rewizja: przy formalnym rebrandingu
  lub gdy audyt dostępności znajdzie niepokryty wcześniej kontekst użycia akcentu.
- docs/decisions/0003-i18n.md — kontekst: potrzeba PL/EN, App Router bez
  wbudowanego i18n; decyzja: next-intl + [locale] + proxy.ts; ryzyko: błędy
  własnej negocjacji Accept-Language, gdyby zrezygnowano z next-intl; rewizja: gdyby
  potrzeby tłumaczeń pozostały trywialne na długo a koszt zależności przewyższył
  korzyści, lub next-intl przestał wspierać używaną wersję Next.js.

Oba pliki w formacie identycznym z docs/decisions/0001-stay-on-eslint-9.md.

Weryfikacja end-to-end

1. cd apps/web && pnpm dev → otworzyć / i potwierdzić przekierowanie na /pl
   Oba pliki w formacie identycznym z docs/decisions/0001-stay-on-eslint-9.md.

Weryfikacja end-to-end

1. cd apps/web && pnpm dev → otworzyć / i potwierdzić przekierowanie na /pl
   lub /en zgodnie z Accept-Language przeglądarki (zmienić język w DevTools, by
   sprawdzić obie ścieżki).
2. Sprawdzić /pl i /en przy szerokości 375px — header, Hero, Kontakt, footer w
   pełni użyteczne.
3. Sprawdzić przełącznik języka — zachowuje bieżącą stronę, podświetla aktywny język.
4. Sprawdzić kontrast (DevTools/axe) dla tekstu na tle i przycisku CTA na akcencie.
5. cd apps/web && pnpm qa (format:check, lint, typecheck, test) — zielono,
   włącznie z nowymi testami.

Commity

Małe, osobne, Conventional Commits ze scope web/docs, np.:
feat(web): add next-intl PL/EN routing foundation,
feat(web): add typed next-intl message keys and SITE_URL metadata,
feat(web): add Studio design tokens to globals.css,
feat(web): add header, footer, hero and contact section,
test(web): add messages key-parity and locale 404 structural tests,
docs: add ADR 0002 visual direction studio,
docs: add ADR 0003 i18n,
docs: add foundation plan,
docs: clarify plans language and naming convention in CLAUDE.md.
