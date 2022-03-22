import React from 'react';

export function ErrorAlert({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
      <div className="flex items-center justify-between gap-4">
        <p>{message}</p>
        {onRetry ? (
          <button type="button" className="underline" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}
