import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const file = formData.get("avatar") as File;
  
  if (!file) return new Response("No file", { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Получаем расширение из имени файла или определяем по MIME-типу
  const ext = file.name.split(".").pop()?.toLowerCase() || 
    (file.type === "image/png" ? "png" : 
     file.type === "image/jpeg" ? "jpg" : 
     file.type === "image/gif" ? "gif" : "webp");
  
  const userId = session.user.userId || session.user.id;
  
  const filename = `avatar-${userId}-${Date.now()}.${ext}`;
  const path = join(process.cwd(), "public", "uploads", filename);
  
  await writeFile(path, buffer);
  
  // Удаляем старый аватар если есть
  if (session.user.image?.startsWith("/uploads/avatar-")) {
    try {
      await unlink(join(process.cwd(), "public", session.user.image));
    } catch {}
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: { image: `/uploads/${filename}` }
  });

  return Response.json({ url: `/uploads/${filename}` });
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.userId || session.user.id;

  if (session.user.image?.startsWith("/uploads/avatar-")) {
    try {
      await unlink(join(process.cwd(), "public", session.user.image));
    } catch {}
  }

  await prisma.user.update({
    where: { id: userId },
    data: { image: null }
  });

  return new Response("OK");
}