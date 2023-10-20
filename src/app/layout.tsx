import { TopNavigation } from "@/lib/frontend/components/TopNavigation/TopNavigation";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "It is exceptional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>💎</text></svg>"
        />
        <meta property="og:title" content="It is exceptional" />
        <meta property="og:site_name" content="It is exceptional" />
        <meta property="og:url" content="https://www.exceptional.cc/" />
        <meta
          property="og:description"
          content="Find and share all the exceptional places"
        />
        <meta property="og:type" content="website" />
      </head>
      <body className="bg-black p-3 min-h-screen text-white flex flex-col space-y-10 md:w-1/2 md:m-auto">
        <TopNavigation />
        <div className="px-3 md:px-10">{children}</div>
      </body>
    </html>
  );
}
