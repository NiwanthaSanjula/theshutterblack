import { redirect } from "next/navigation";

type AlbumWorkspacePageProps = {
    params: Promise<{ id: string }>
};

export default async function AlbumWorkspacePage({
    params
}: AlbumWorkspacePageProps) {
    const { id } = await params;

    redirect(`/admin/albums/${id}/edit`);
}