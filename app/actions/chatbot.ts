"use server";

interface ChatbotResponse {
  answer: string;
  session_id: string;
  mode: string;
  sources?: string[];
}

interface ChatbotActionResponse {
  error?: string;
  ok: boolean;
  data?: ChatbotResponse;
}

export async function askChatbot(
  question: string,
  sessionId: string,
  apiKey?: string
): Promise<ChatbotActionResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined in environment variables.");
    return { error: "Internal server error.", ok: false };
  }

  // Use provided API key or fallback to default for testing
  // TODO: Make this dynamic based on user's organization
  const organizationApiKey =
    apiKey || "org_sk_3ca4feb8c1afe80f73e1a40256d48e7c";

  try {
    const response = await fetch(`${apiUrl}/api/chatbot/ask-langgraph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": organizationApiKey,
      },
      body: JSON.stringify({
        question,
        session_id: sessionId,
        "mode": "agents"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error:
          errorData.detail ||
          errorData.message ||
          "Failed to get chatbot response.",
        ok: false,
      };
    }

    const data: ChatbotResponse = await response.json();

    return {
      ok: true,
      data,
    };
  } catch (error) {
    console.error("Error calling chatbot API:", error);
    return {
      error: "An unexpected error occurred while contacting the chatbot.",
      ok: false,
    };
  }
}
