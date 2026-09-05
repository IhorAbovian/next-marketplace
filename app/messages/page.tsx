import { getUserChats } from "@/lib/actions";
import { getAuthenticatedUser } from "@/lib/auth";
import MessagesClient from "@/components/MessagesClient";

type MessagesPageProps = {
  searchParams: Promise<{ chat?: string }>;
};

export default async function MessagesPage({
  searchParams,
}: MessagesPageProps) {
  const { chat } = await searchParams;
  const [chats, user] = await Promise.all([
    getUserChats(),
    getAuthenticatedUser(),
  ]);

  return (
    <div className="container max-w-5xl mx-auto px-4 pt-8 pb-12">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <MessagesClient
        chats={chats}
        initialChatId={chat ?? null}
        currentUserId={user.id}
      />
    </div>
  );
}
