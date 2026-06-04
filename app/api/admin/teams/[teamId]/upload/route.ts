import { isCurrentUserTeamMember } from "@/lib/teams/is-team-coach";
import { buildTeamAssetPath, teamAssetPublicUrl, TEAM_ASSETS_BUCKET } from "@/lib/storage/team-assets";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const FILE_TYPES = new Set([
  ...IMAGE_TYPES,
  "application/pdf",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/x-wav",
]);

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const { teamId } = await params;
  if (!teamId) return NextResponse.json({ error: "Missing team" }, { status: 400 });

  const allowed = await isCurrentUserTeamMember(teamId);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "media").slice(0, 32);

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 5 MB)." }, { status: 400 });
  }

  const mime = file.type || "application/octet-stream";
  if (!FILE_TYPES.has(mime)) {
    return NextResponse.json({ error: "File type not supported." }, { status: 400 });
  }

  const extFromName = file.name.split(".").pop()?.toLowerCase();
  const ext =
    extFromName && extFromName.length <= 5
      ? extFromName
      : mime === "image/webp"
        ? "webp"
        : mime === "image/png"
          ? "png"
          : mime === "application/pdf"
            ? "pdf"
            : "jpg";

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const path = buildTeamAssetPath(teamId, folder, filename);

  const supabase = await createServerSupabase();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(TEAM_ASSETS_BUCKET).upload(path, buffer, {
    contentType: mime,
    upsert: false,
  });

  if (error) {
    const msg = error.message ?? "Upload failed";
    const friendly =
      /bucket not found/i.test(msg)
        ? "Storage bucket “team-assets” is missing. In Supabase SQL Editor, run supabase/RUN_TEAM_ASSETS_STORAGE.sql, then try again."
        : msg;
    return NextResponse.json({ error: friendly }, { status: 500 });
  }

  return NextResponse.json({
    url: teamAssetPublicUrl(path),
    path,
  });
}
