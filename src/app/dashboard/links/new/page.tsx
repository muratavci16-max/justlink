import { DashboardHeader } from "@/components/dashboard/header";
import { LinkForm } from "@/components/forms/link-form";

export default function NewLinkPage() {
  return (
    <div>
      <DashboardHeader
        title="Create Smart Link"
        description="Set up device-based routing for your new link."
      />
      <div className="max-w-2xl">
        <LinkForm mode="create" />
      </div>
    </div>
  );
}
