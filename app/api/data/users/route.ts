import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
