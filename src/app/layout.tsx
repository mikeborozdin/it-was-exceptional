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
      <body className="bg-black p-3 min-h-screen text-white flex flex-col space-y-10">
        {/* <div>
          <Link className="text-white font-extrabold" href="/">
            💎 It is exceptional
          </Link>
        </div> */}
        <TopNavigation />
        <div className="px-3 md:px-10">{children}</div>
      </body>
    </html>
  );
}
