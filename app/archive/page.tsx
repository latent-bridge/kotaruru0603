import { PageHeader } from "@/components/PageHeader";
import { ArchiveGrid } from "@/components/ArchiveGrid";

export default function ArchivePage() {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1200px] mx-auto">
      <PageHeader prefix="// VOD LOG" title="配信アーカイブ" />
      <ArchiveGrid />
    </div>
  );
}
