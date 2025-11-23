"use client";
import { useEffect, useRef, useState } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
  timestamp?: number;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // On mount, get or create orgId and fetch history first
  useEffect(() => {
    let orgId = localStorage.getItem("organizationId");
    if (!orgId) {
      orgId = "org-" + Math.random().toString(36).slice(2) + Date.now();
      localStorage.setItem("organizationId", orgId);
    }
    setOrganizationId(orgId);
    setHistoryLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask/history/${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.history)) setMessages(data.history);
      })
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
        body: JSON.stringify({ question: input, organizationId }),
      });
      const data = await res.json();
      if (Array.isArray(data.history)) {
        setMessages(data.history);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { sender: "ai", text: data.answer || JSON.stringify(data) },
        ]);
      }
      if (data.organizationId && data.organizationId !== organizationId) {
        setOrganizationId(data.organizationId);
        localStorage.setItem("organizationId", data.organizationId);
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
        }}
      >
        Chatbot
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
              }}
            >
              {msg.text}
            </div>
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
