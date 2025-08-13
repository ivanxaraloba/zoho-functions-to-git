import React from 'react';

import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex h-svh max-w-lg flex-col items-center justify-center text-center mx-auto">
      <h1 className="text-foreground mb-4 text-3xl font-bold">Access Forbidden</h1>
      <p className="text-muted-foreground mb-2">
        You don&apos;t have permission to access this application.
      </p>
      <p className="text-muted-foreground text-sm">
        If you believe this is a mistake, please contact the administrator at
        ivanxara@loba.com
      </p>

      <Link
        href="/login"
        className="text-muted-foreground mt-8 text-center text-xs underline"
      >
        go back to login page
      </Link>
    </div>
  );
}
