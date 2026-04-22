import { PageHeader } from "@/components/PageHeader";
import { GoodsGrid } from "@/components/GoodsGrid";

export default function GoodsPage() {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1200px] mx-auto">
      <PageHeader prefix="// SUPPLY DROP" title="オフィシャルグッズ" />
      <GoodsGrid />
    </div>
  );
}
