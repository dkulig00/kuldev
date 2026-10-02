# CI w GitHub Actions (.github/workflows/ci.yml)

## Kontekst

Repo (dkulig00/kuldev) nie ma jeszcze żadnego CI — brak katalogu .github. Dw
niezależne aplikacje (apps/api — Laravel, apps/web — Next.js) mają już lokalne
polecenia QA (composer qa, pnpm qa), ale nic nie weryfikuje ich automatycznie na
pull requestach ani na main. Celem jest dodanie dwóch równoległych jobów CI,
będą można ustawić jako wymagane statusy (required checks) na PR-ach, plus plik
.nvmrc (którego projekt jeszcze nie ma) i badge statusu w README.

Ustalone z użytkownikiem:

- Dane dostępowe do Postgresa w CI i w apps/api/.env.example mają odzwiercie
  rzeczywisty lokalny docker-compose.yml (kuldev / secret), a nie domyślne
  wartości Laravela (root / puste hasło).
- .nvmrc przypina tylko major Node (24), bez konkretnego patcha.

Zmiany

1. apps/api/.env.example — aktualizacja na pgsql zgodny z docker-compose

Obecnie plik ma DB_CONNECTION=sqlite i zakomentowane, nieaktualne wartości (port
3306, baza laravel). Zmienić na:

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=kuldev
DB_USERNAME=kuldev
DB_PASSWORD=secret

(Pozostałe zmienne w .env.example bez zmian.) phpunit.xml już nadpisuje
DB_DATABASE=kuldev_test dla testów — host/user/password zostają takie jak w .env.

2. .github/workflows/ci.yml — nowy plik

Wspólne ustawienia:
on:
pull_request:
push:
branches: [main]

permissions:
contents: read

concurrency:
group: ${{ github.workflow }}-${{ github.event.pull_request.number || gith
cancel-in-progress: true

Job api — identyfikator joba to stałe api (bez pola name:, żeby wyświetlana
nazwa wymaganego sprawdzenia nigdy się nie zmieniła przy bumpach PHP/Postgresa —
zmiana nazwy checku odłącza go od reguł branch protection i blokuje PR-y):

- timeout-minutes: 15.
- services.postgres: image: postgres:18, env POSTGRES_USER: kuldev,
  POSTGRES_PASSWORD: secret, POSTGRES_DB: kuldev_test, port 5432:5432,
  healthcheck pg_isready -U kuldev -d kuldev_test (interval/timeout/retries
  w standardowym wzorcu GH Actions).
- defaults.run.working-directory: apps/api.
- Kroki:
  a. actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  b. shivammathur/setup-php@f3e473d116dcccaddc5834248c87452386958240 # 2.37.2
  z php-version: '8.5', extensions: mbstring, bcmath, pgsql, pdo_pgsql, i
  coverage: none.
  c. actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0 — cache
  katalogu cache Composera (~/.cache/composer, domyślny cache-dir Compose
  Ubuntu), key z hashFiles('apps/api/composer.lock'). To cache'uje pobrane
  pakiety, nie vendor/ — composer install i tak doinstaluje vendor/ z
  cache'u, ale sam katalog vendor nie jest persystowany między runami.
  d. composer install --no-interaction --prefer-dist --no-progress
  e. cp .env.example .env && php artisan key:generate --ansi
  f. composer qa (czyli pint --test, rector --dry-run, phpstan analyse, pest
  — baza kuldev_test przez serwis Postgres powyżej).

Job web — identyfikator joba to stałe web (bez pola name:, z tego samego
powodu co wyżej):

- timeout-minutes: 15.
- defaults.run.working-directory: apps/web.
- env.SITE_URL: http://localhost:3000 (ustawiane na poziomie joba — potrzebne dla
  pnpm build; testy ustawiają SITE_URL sam w kodzie testowym).
- Kroki:
  a. actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  b. pnpm/action-setup@d9184bf108216479bc5a137cc391f4d7b14c870b # v6.1.0
  z package_json_file: apps/web/package.json (czyta wersję pnpm z pola
  packageManager, obecnie pnpm@12.8.1).
  c. actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
  z node-version-file: apps/web/.nvmrc, cache: pnpm,
  cache-dependency-path: apps/web/pnpm-lock.yaml.
  d. pnpm install --frozen-lockfile
  e. pnpm qa (format:check, lint, typecheck, test)
  f. pnpm build

Wszystkie akcje third-party przypięte do pełnego commit SHA z wersją w komentarzu
(zgodnie z zaleceniem hardening GitHuba), wersje potwierdzone na dziś (2026-
przez GitHub API / dokumentację akcji.

3. apps/web/.nvmrc — nowy plik

Zawartość: 24 (tylko major, zgodnie z decyzją — lokalnie zainstalowane jest
v24.21.0, ale przypinamy tylko major).

4. .github/dependabot.yml — nowy plik

Aktualizacje akcji w .github/workflows/ co tydzień, żeby przypięte SHA nie
zastarzały się bezterminowo:

version: 2
updates:

- package-ecosystem: github-actions
  directory: /
  schedule:
  interval: weekly

5. README.md — badge CI

Plik ma obecnie tylko # kuldev.pl. Dodać pod tytułem:

[![CI](https://github.com/dkulig00/kuldev/actions/workflows/ci.yml/badge.svg0/kuldev/actions/workflows/ci.yml)

Commity

Zgodnie z regułą „jedna zmiana = jeden commit”:

1. Zapisanie tego planu w docs/plans/2026-10-02-ci-github-actions.md (konwen
   z CLAUDE.md) — pierwszy krok implementacji, osobny commit
   docs: add CI implementation plan.
2. fix(api): align .env.example with local docker-compose postgres credentials
3. ci: add GitHub Actions workflow for api and web (+ .nvmrc + dependabot.yml)
4. docs: add CI status badge to README

Weryfikacja

1. Lokalnie: docker compose up -d, potem cd apps/api && composer qa i
   cd apps/web && pnpm qa && pnpm build — upewnić się, że zmiana .env.example nie
   psuje lokalnego composer qa (trzeba realnie skopiować nowy .env.example do
   .env w swoim środowisku deweloperskim, jeśli dotąd był inny).
2. Po pushu/PR: sprawdzić w zakładce Actions na GitHubie, że obie joby (api, web)
   przechodzą na zielono, oraz że job api faktycznie łączy się z serwisem Postgres
   (nie z żadną bazą SQLite).
3. Sprawdzić, że drugi push na ten sam PR anuluje poprzedni w toku bieg (zakładka
   Actions — poprzedni run powinien dostać status „cancelled”).
4. W ustawieniach repo (Settings → Branches → branch protection dla main) dodać
   checki api i web jako wymagane statusy — to
   wymaga co najmniej jednego przebiegu workflow na gałęzi, żeby nazwy były widoczne
   na liście (poza zakresem tego PR-a, do zrobienia ręcznie przez użytkownik
5. Zweryfikować badge w README — po pierwszym pushu na main powinien pokazywać
   aktualny status (może chwilę zająć, zanim GitHub wygeneruje pierwszy SVG).
