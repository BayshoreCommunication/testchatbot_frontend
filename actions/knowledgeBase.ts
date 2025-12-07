"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface KnowledgeBaseInfo {
  id: string;
  companyName: string;
  sources: string[];
  totalSources: number;
  quality: "high" | "medium" | "low";
  qualityPercentage: number;
  createdAt: string;
  updatedAt: string;
  vectorStoreId: string;
  status: string;
}

interface CheckKnowledgeBaseResponse {
  success: boolean;
  hasKnowledgeBase: boolean;
  knowledgeBase?: KnowledgeBaseInfo;
  message?: string;
}

interface BuildKnowledgeBaseResponse {
  success: boolean;
  message?: string;
  knowledgeBase?: {
    id: string;
    companyName: string;
    sources: string[];
    totalSources: number;
    quality: string;
    qualityPercentage: number;
    vectorStoreId: string;
  };
  error?: string;
}

/**
 * Check if user has existing knowledge base
 */
export async function checkKnowledgeBaseAction(token: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/web-search/check-knowledge-base`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data: CheckKnowledgeBaseResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        hasKnowledgeBase: false,
        message: data.message || "Failed to check knowledge base",
      };
    }

    return data;
  } catch (error) {
    console.error("Check knowledge base error:", error);
    return {
      success: false,
      hasKnowledgeBase: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Build new knowledge base from company website
 */
export async function buildKnowledgeBaseAction(
  token: string,
  companyName: string,
  website: string,
  additionalUrls?: string[]
) {
  try {
    const response = await fetch(`${API_URL}/api/web-search/knowledgebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        companyName,
        website,
        additionalUrls,
        model: "gpt-5",
      }),
      cache: "no-store",
    });

    const data: BuildKnowledgeBaseResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || data.message || "Failed to build knowledge base",
      };
    }

    return data;
  } catch (error) {
    console.error("Build knowledge base error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Update existing knowledge base with new sources
 */
export async function updateKnowledgeBaseAction(
  token: string,
  additionalUrls: string[]
) {
  try {
    const response = await fetch(`${API_URL}/api/web-search/knowledgebase`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        additionalUrls,
      }),
      cache: "no-store",
    });

    const data: BuildKnowledgeBaseResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.error || data.message || "Failed to update knowledge base",
      };
    }

    return data;
  } catch (error) {
    console.error("Update knowledge base error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Delete knowledge base
 */
export async function deleteKnowledgeBaseAction(token: string) {
  try {
    const response = await fetch(`${API_URL}/api/web-search/knowledgebase`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.error || data.message || "Failed to delete knowledge base",
      };
    }

    return data;
  } catch (error) {
    console.error("Delete knowledge base error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
