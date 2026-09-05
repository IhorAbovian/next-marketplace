"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getChatMessages, sendChatMessage } from "@/lib/actions";
import type { ChatMessage } from "@/generated/prisma/browser";

type ChatPreview = {
  id: string;
  title: string;
  lastMessage: string;
  isSeller: boolean;
};

const FILTERS = [
  { value: "all", label: "All Messages" },
  { value: "my-ads", label: "My Ads" },
  { value: "replying-to", label: "Replying To" },
] as const;

type MessagesClientProps = {
  chats: ChatPreview[];
  initialChatId: string | null;
  currentUserId: string;
};

export default function MessagesClient({
  chats,
  initialChatId,
  currentUserId,
}: MessagesClientProps) {
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]["value"]>("all");
  const [search, setSearch] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    initialChatId,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  // poll the selected chat's messages
  useEffect(() => {
    if (!selectedChatId) return;

    const loadMessages = async () => {
      setMessages(await getChatMessages(selectedChatId));
    };

    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [selectedChatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatId || !draft.trim()) return;

    const message = await sendChatMessage(selectedChatId, draft);
    setMessages((prev) => [...prev, message]);
    setDraft("");
  };

  const filteredChats = chats
    .filter((chat) => chat.title.toLowerCase().includes(search.toLowerCase()))
    .filter((chat) => {
      if (filter === "my-ads") return chat.isSeller;
      if (filter === "replying-to") return !chat.isSeller;
      return true;
    });

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const displayedMessages = selectedChatId ? messages : [];

  return (
    <>
      <fieldset className="flex gap-2 mb-6" aria-label="Filter messages">
        {FILTERS.map((f) => (
          <label
            key={f.value}
            className={cn(
              "cursor-pointer rounded-lg border px-4 py-2 text-sm transition-colors",
              filter === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            <input
              type="radio"
              name="msgFilter"
              value={f.value}
              checked={filter === f.value}
              onChange={() => setFilter(f.value)}
              className="sr-only"
            />
            {f.label}
          </label>
        ))}
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-lg overflow-hidden min-h-125">
        {/* Left: search + chat list */}
        <div className="md:col-span-1 border-r flex flex-col">
          <div className="p-3 border-b">
            <Input
              type="search"
              placeholder="Search chats..."
              aria-label="Search chats"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ul className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">
                No chats found
              </li>
            )}
            {filteredChats.map((chat) => (
              <li key={chat.id}>
                <button
                  type="button"
                  aria-label={`Open chat with ${chat.title}`}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b hover:bg-muted transition-colors",
                    selectedChatId === chat.id && "bg-muted",
                  )}
                >
                  <p className="font-medium text-sm">{chat.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: selected chat dialog */}
        <div className="md:col-span-2 flex flex-col">
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a chat to start messaging
            </div>
          ) : (
            <>
              <div className="p-3 border-b">
                <p className="font-medium text-sm">{selectedChat.title}</p>
              </div>

              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
                {displayedMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Say hello!
                  </p>
                )}
                {displayedMessages.map((message) => {
                  const isOwnMessage = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        isOwnMessage ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm max-w-4/5",
                          !isOwnMessage && "bg-muted",
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={handleSend}
                className="p-3 border-t flex flex-col gap-2"
              >
                <textarea
                  className="w-full border rounded p-2 max-h-40 resize-none overflow-y-auto"
                  placeholder="Type your message..."
                  aria-label="Message"
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <Button
                  type="submit"
                  aria-label="Send message"
                  className="self-end"
                >
                  Send
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
