interface StatusMessageProps {
  variant: 'success' | 'error';
  children: React.ReactNode;
}

// Small inline status with an icon. Used for save results now, and for errors later.
export function StatusMessage({
  variant,
  children,
}: Readonly<StatusMessageProps>) {
  const isSuccess = variant === 'success';

  return (
    <output
      className={`bg-surface border-ink/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow ${
        isSuccess ? 'text-green-700' : 'text-red-700'
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-4"
        fill="currentColor"
      >
        {isSuccess ? (
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l4 4 6.8-6.8a1 1 0 0 1 1.2 0z" />
        ) : (
          <path d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4z" />
        )}
      </svg>
      {children}
    </output>
  );
}
