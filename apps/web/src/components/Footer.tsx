export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-ink/60 px-4 py-8 text-sm sm:px-6">
      <p>kuldev © {year}</p>
    </footer>
  );
}
