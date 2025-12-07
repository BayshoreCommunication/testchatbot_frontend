"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

/**
 * Server Action: Trigger Unified Scraping Process
 * This executes strictly on the server side, keeping tokens secure.
 */
export async function runUnifiedScraping(companyName: string, token?: string) {
  if (!token) {
    return { success: false, message: "Authentication required. Please verify your email." };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/unified-scraping/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Pass the JWT token
      },
      body: JSON.stringify({ 
        companyName: companyName,
        maxUrls: 5 // Default limit
      }),
      cache: 'no-store', // Ensure we don't cache the result
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Scraping process failed");
    }

    return data; // Contains { success: true, data: { searchResults, knowledgeBase, ... } }

  } catch (error: any) {
    console.error("Server Action Error:", error.message);
    return { success: false, message: error.message };
  }
}
