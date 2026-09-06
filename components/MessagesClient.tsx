"use client";

import { useEffect, useState } from "react";
import { MessageCircleIcon, SearchIcon, SendIcon } from "lucide-react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, debounce } from "@/lib/utils";
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
  const [filteredChats, setFilteredChats] = useState<ChatPreview[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    initialChatId,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  // poll the selected chat's messages
  useEffect(() => {
    if (!selectedChatId) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const loadMessages = async () => {
      const data = await getChatMessages(selectedChatId);

      if (cancelled) return;

      setMessages(data);

      timeoutId = setTimeout(loadMessages, 4000);
    };

    loadMessages();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [selectedChatId]);

  useEffect(() => {
    const filteredChats = chats
      .filter((chat) => {
        if (filter === "my-ads") return chat.isSeller;
        if (filter === "replying-to") return !chat.isSeller;

        return true;
      })
      .filter((chat) =>
        chat.title.toLowerCase().includes(search.toLowerCase()),
      );

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredChats(filteredChats);
  }, [search, filter, chats]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChatId || !draft.trim()) return;

    const message = await sendChatMessage(selectedChatId, draft);

    setMessages((prev) => [...prev, message]);
    setDraft("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const debouncedHandleSearchChange = debounce(handleSearchChange, 300);

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const displayedMessages = selectedChatId ? messages : [];

  return (
    <div>
      <ToggleGroup
        aria-label="Filter messages"
        value={[filter]}
        onValueChange={(value) => {
          const next = value[0] as (typeof FILTERS)[number]["value"];
          if (next) setFilter(next);
        }}
        className="rounded-full bg-muted p-1 mb-6"
      >
        {FILTERS.map((f) => (
          <ToggleGroupItem
            key={f.value}
            value={f.value}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl border shadow-sm overflow-hidden h-[70vh] min-h-125">
        {/* Left: search + chat list */}
        <div className="md:col-span-1 border-r flex flex-col min-h-0 bg-card">
          <div className="p-3 border-b">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search chats..."
                aria-label="Search chats"
                onChange={debouncedHandleSearchChange}
                className="rounded-full border-transparent bg-muted pl-9 focus-visible:bg-background"
              />
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto p-2 space-y-1">
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
                    "w-full flex items-center gap-3 text-left rounded-xl px-3 py-2.5 transition-colors hover:bg-muted",
                    selectedChatId === chat.id && "bg-primary/10",
                  )}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: selected chat dialog */}
        <div className="md:col-span-2 flex flex-col min-h-0 bg-muted/30">
          {!selectedChat ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-6">
              <MessageCircleIcon className="size-10 text-muted-foreground/30" />
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-sm text-muted-foreground">
                Choose a chat from the list to view messages
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 border-b flex items-center gap-3 bg-card">
                <p className="font-medium text-sm">{selectedChat.title}</p>
              </div>

              <MessageScrollerProvider>
                <MessageScroller className="flex-1 min-h-0">
                  <MessageScrollerViewport>
                    <MessageScrollerContent className="p-4 gap-3">
                      {displayedMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                          <MessageCircleIcon className="size-8 text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">
                            No messages yet. Say hello!
                          </p>
                        </div>
                      )}

                      {displayedMessages.map((message, index) => {
                        const isOwnMessage = message.senderId === currentUserId;
                        const isLast = index === displayedMessages.length - 1;

                        return (
                          <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                            scrollAnchor={isLast}
                            className={cn(
                              "flex animate-in fade-in slide-in-from-bottom-2 duration-300",
                              isOwnMessage ? "justify-end" : "justify-start",
                            )}
                          >
                            <Bubble
                              align={isOwnMessage ? "end" : "start"}
                              variant={isOwnMessage ? "default" : "muted"}
                            >
                              <BubbleContent
                                className={cn(
                                  "shadow-sm",
                                  isOwnMessage
                                    ? "rounded-2xl rounded-br-md"
                                    : "rounded-2xl rounded-bl-md",
                                )}
                              >
                                {message.content}
                              </BubbleContent>
                            </Bubble>
                          </MessageScrollerItem>
                        );
                      })}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>

                  <MessageScrollerButton direction="end" />
                </MessageScroller>
              </MessageScrollerProvider>

              <form
                onSubmit={handleSend}
                className="flex items-end gap-2 border-t bg-card p-3"
              >
                <Textarea
                  className="h-24 field-sizing-fixed resize-none rounded-2xl border-transparent bg-muted shadow-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/40"
                  placeholder="Type your message..."
                  aria-label="Message"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />

                <Button
                  type="submit"
                  size="icon-lg"
                  aria-label="Send message"
                  disabled={!draft.trim()}
                  className="rounded-full shrink-0"
                >
                  <SendIcon />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
