import { Topbar } from "@/components/Topbar";
import { Footer } from "@/components/Footer";

export default function LegacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="legacy-shell">
      <Topbar />
      {children}
      <Footer />
    </div>
  );
}
