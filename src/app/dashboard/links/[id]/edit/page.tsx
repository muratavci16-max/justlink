import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLinkById } from "@/lib/links";
import { DashboardHeader } from "@/components/dashboard/header";
import { LinkForm } from "@/components/forms/link-form";

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const link = await getLinkById(id, user!.id);

  if (!link) notFound();

  return (
    <div>
      <DashboardHeader
        title="Edit Link"
        description={`Editing — ${link.name}`}
      />
      <div className="max-w-2xl">
        <LinkForm mode="edit" link={link} />
      </div>
    </div>
  );
}
