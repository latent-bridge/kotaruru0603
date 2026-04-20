import { PageHeader } from "@/components/PageHeader";
import { ScheduleView } from "@/components/ScheduleView";

export default function SchedulePage() {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1200px] mx-auto">
      <PageHeader prefix="// DEPLOYMENT" title="配信スケジュール" />
      <ScheduleView />
    </div>
  );
}
