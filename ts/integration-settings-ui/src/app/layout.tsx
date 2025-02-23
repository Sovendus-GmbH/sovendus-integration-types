import type { JSX, ReactNode } from "react";

export const metadata = {
  title: "Preview ENV for sovendus plugin settings ui",
  description: "Using Next.js <3",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
