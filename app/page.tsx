"use client";
import { useEffect, useRef, useState } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
  timestamp?: number;
};

// Simple function to format message text with basic markdown support
function formatMessageText(text: string, sender: "user" | "ai"): string {
  if (sender === "user") {
    // Don't format user messages
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Escape HTML first
  let formatted = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Convert **bold** to <strong>
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Convert bullet points • to proper list format
  formatted = formatted.replace(/^• (.+)$/gm, "<div style='margin-left: 16px; margin-top: 4px;'>• $1</div>");

  // Add some spacing between paragraphs (double newlines)
  formatted = formatted.replace(/\n\n/g, "<br/><br/>");

  // Single newlines
  formatted = formatted.replace(/\n/g, "<br/>");

  return formatted;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Assistant ID - you can make this configurable or get from environment
  const ASSISTANT_ID = "asst_BCf70jDt0jllFYXxW3Ptm56n";

  // On mount, get or create orgId and threadId
  useEffect(() => {
    let threadIdValue: string | null = null;
    try {
      let orgId = localStorage.getItem("organizationId");
      if (!orgId) {
        orgId = "org-" + Math.random().toString(36).slice(2) + Date.now();
        localStorage.setItem("organizationId", orgId);
      }
      setOrganizationId(orgId);

      // Get existing threadId or create new one
      const existingThreadId = localStorage.getItem("threadId");
      threadIdValue =
        existingThreadId &&
        existingThreadId !== "null" &&
        existingThreadId !== "undefined" &&
        existingThreadId.trim() !== "" &&
        existingThreadId.startsWith("thread_")
          ? existingThreadId
          : null;
      setThreadId(threadIdValue);
    } catch (storageError) {
      console.warn("Failed to access localStorage:", storageError);
      // Set defaults if localStorage fails
      setOrganizationId(
        "org-" + Math.random().toString(36).slice(2) + Date.now()
      );
      setThreadId(null);
      threadIdValue = null;
    }

    setHistoryLoading(true);
    // Only fetch history if we have a valid threadId
    if (threadIdValue) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask/history/${threadIdValue}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.history)) setMessages(data.history);
        })
        .catch((error) => {
          console.warn("Failed to load chat history:", error);
        })
        .finally(() => setHistoryLoading(false));
    } else {
      // No threadId yet, just show empty chat
      setHistoryLoading(false);
    }
  }, []);

  const startNewChat = async () => {
    setMessages([]);
    setThreadId(null);
    try {
      localStorage.removeItem("threadId");
      // Create a new thread immediately
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask/thread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.threadId) {
        setThreadId(data.threadId);
        localStorage.setItem("threadId", data.threadId);
      } else {
        console.warn("Failed to create new thread:", data.error);
      }
    } catch (error) {
      console.warn("Failed to create new thread:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !organizationId) return;
    const userMsg = { sender: "user" as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistantId: ASSISTANT_ID,
          message: input,
          threadId: threadId || null,
          organizationId,
        }),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update threadId if it's a new thread or different
      if (data.threadId) {
        if (
          data.threadId !== threadId &&
          typeof data.threadId === "string" &&
          data.threadId.startsWith("thread_")
        ) {
          setThreadId(data.threadId);
          try {
            localStorage.setItem("threadId", data.threadId);
          } catch (storageError) {
            console.warn(
              "Failed to store threadId in localStorage:",
              storageError
            );
          }
        } else if (data.threadId !== threadId) {
          console.warn("Invalid threadId format received:", data.threadId);
        }
      } else if (threadId && !data.threadId) {
        // Backend didn't return threadId but we sent one - thread might be invalid
        console.warn("Thread might be invalid, clearing local session");
        setThreadId(null);
        try {
          localStorage.removeItem("threadId");
        } catch (storageError) {
          console.warn(
            "Failed to clear threadId from localStorage:",
            storageError
          );
        }
      }

      // Add AI response to messages
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: data.answer || "No response from assistant" },
      ]);

      if (data.organizationId && data.organizationId !== organizationId) {
        setOrganizationId(data.organizationId);
        try {
          localStorage.setItem("organizationId", data.organizationId);
        } catch (storageError) {
          console.warn(
            "Failed to store organizationId in localStorage:",
            storageError
          );
        }
      }
    } catch (e) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: "Error: " + (e instanceof Error ? e.message : String(e)),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (historyLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80, fontSize: 20 }}>
        Loading chat history...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 0,
        border: "1px solid #eee",
        borderRadius: 10,
        boxShadow: "0 2px 12px #0001",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid #eee",
          background: "#f7f7f7",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          fontWeight: 600,
          fontSize: 20,
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>AI Assistant Chat</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {threadId && (
            <span
              style={{
                fontSize: 12,
                color: "#666",
                fontWeight: 400,
              }}
            >
              Session: {threadId.slice(-8)}
            </span>
          )}
          <button
            onClick={startNewChat}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              background: "#0070f3",
              color: "#fff",
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            New Chat
          </button>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#f4f6fa",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 16px",
                borderRadius: 18,
                background: msg.sender === "user" ? "#0070f3" : "#e5e7eb",
                color: msg.sender === "user" ? "#fff" : "#222",
                fontSize: 16,
                boxShadow:
                  msg.sender === "user"
                    ? "0 2px 8px #0070f322"
                    : "0 2px 8px #0001",
                marginLeft: msg.sender === "user" ? 40 : 0,
                marginRight: msg.sender === "ai" ? 40 : 0,
                whiteSpace: "pre-wrap",
                lineHeight: "1.5",
              }}
              dangerouslySetInnerHTML={{
                __html: formatMessageText(msg.text, msg.sender),
              }}
            />

          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 16px",
                borderRadius: 18,
                background: "#e5e7eb",
                color: "#222",
                fontSize: 16,
                fontStyle: "italic",
                marginRight: 40,
                opacity: 0.7,
              }}
            >
              AI is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: "flex",
          gap: 8,
          padding: 16,
          borderTop: "1px solid #eee",
          background: "#fafbfc",
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 18,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: "0 22px",
            borderRadius: 18,
            background: loading || !input.trim() ? "#b3b3b3" : "#0070f3",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: 16,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
