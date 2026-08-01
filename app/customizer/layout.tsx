import type { ReactNode } from "react";

// Segment layout for /customizer — passes children straight through.
// The actual navbar/footer suppression is handled by ClientLayout in app/layout.tsx.
export default function CustomizerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
