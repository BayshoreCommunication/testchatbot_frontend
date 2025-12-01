"use server";

import { auth } from "@/auth";
import { revalidateTag, revalidatePath, unstable_cache } from "next/cache";

interface UserDataResponse {
  error?: string;
  ok: boolean;
  data?: any;
}

export async function getUserData(): Promise<UserDataResponse> {
  const session = await auth();

  // Check for authentication and access token
  if (!session?.user?.accessToken) {
    return {
      error: "User is not authenticated.",
      ok: false,
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session?.user?.accessToken || ""}`,
        },
        next: { tags: ["userDataUpdate"], revalidate: 360 },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch user data:", errorData);
      return {
        error: errorData?.message || "Failed to fetch user data.",
        ok: false,
        data: null,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data: data?.payload?.user || null,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      ok: false,
      data: null,
    };
  }
}

export async function getUserDataTest(
  headers: HeadersInit
): Promise<UserDataResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        method: "GET",
        headers,
        next: { tags: ["userDataCache"], revalidate: 360 }, // Cache with a tag
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData?.message || "Failed to fetch user data.",
        ok: false,
        data: null,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data: data?.payload?.user || null,
    };
  } catch (error) {
    return {
      error: "An unexpected error occurred. Please try again later.",
      ok: false,
      data: null,
    };
  }
}

export async function updateUserData(
  updateData: {
    companyName?: string;
    companyType?: string;
    website?: string;
    avatar?: string;
  }
): Promise<UserDataResponse> {
  const session = await auth();

  // Check for authentication and access token
  if (!session?.user?.accessToken) {
    return {
      error: "User is not authenticated.",
      ok: false,
    };
  }

  try {
    // Make the API request to update user data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session.user.accessToken}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    // TODO: Fix revalidateTag for Next.js 16
    // revalidateTag("userDataUpdate");

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData?.message || "Failed to update user data.",
        ok: false,
      };
    }

    // Parse the response data if the update is successful
    const data = await response.json();
    return {
      ok: true,
      data: data?.payload?.user || null,
    };
  } catch (error) {
    // Log unexpected errors
    console.error("Error updating user data:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      ok: false,
    };
  }
}

// Get all user list

export async function getAllUserData(
  search: string = "",
  page: number = 1,
  limit: number = 10000
): Promise<UserDataResponse> {
  const session = await auth();

  if (!session?.user?.accessToken) {
    return {
      error: "User is not authenticated.",
      ok: false,
    };
  }

  try {
    const query = new URLSearchParams({
      search: search,
      page: page.toString(),
      limit: limit.toString(),
    }).toString();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session.user.accessToken}`,
        },
        next: {
          tags: [""],
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch user data:", errorData);
      return {
        error: errorData?.message || "Failed to fetch user data.",
        ok: false,
        data: null,
      };
    }

    const data = await response.json();

    return {
      ok: true,
      data: data?.payload || null,
    };
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return {
      error:
        error?.message ||
        "An unexpected error occurred. Please try again later.",
      ok: false,
      data: null,
    };
  }
}

export async function userDeletedById(id: string): Promise<UserDataResponse> {
  const session = await auth();

  if (!session?.user?.accessToken) {
    return {
      error: "User is not authenticated.",
      ok: false,
      data: null,
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session.user.accessToken}`,
        },
      }
    );
    // TODO: Fix revalidateTag for Next.js 16
    // revalidateTag("userDelete");

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to delete user:", errorData);
      return {
        error: errorData?.message || "Failed to delete user.",
        ok: false,
        data: null,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data: data?.payload || null,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      ok: false,
      data: null,
    };
  }
}

// User delted by id

export async function userSubscriptionByIds(
  userId: string,
  search: string = "52",
  page: number = 1,
  limit: number = 5,
  searchOption: string = "all"
): Promise<UserDataResponse> {
  const session = await auth();

  if (!session?.user?.accessToken) {
    return {
      error: "User is not authenticated.",
      ok: false,
      data: null,
    };
  }

  try {
    // Construct query parameters with all required values
    const queryParams = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
      searchOption: searchOption.toString(),
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${userId}?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session.user.accessToken}`,
        },
      }
    );

    // TODO: Fix revalidateTag for Next.js 16
    // revalidateTag("userUpdate");

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch subscription data:", errorData);
      return {
        error: errorData?.message || "Failed to fetch subscription data.",
        ok: false,
        data: null,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data: data?.payload || null,
    };
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      ok: false,
      data: null,
    };
  }
}

export async function userSubscriptionById(
  userId: string,
  search: string = "",
  page: number = 1,
  limit: number = 10000
): Promise<UserDataResponse> {
  const session = await auth();

  if (!session?.user?.accessToken) {
    return {
      error: "User is not authenticated.",
      ok: false,
    };
  }

  try {
    const queryParams = new URLSearchParams({
      search: search,
      page: page.toString(),
      limit: limit.toString(),
    }).toString();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${userId}?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${session.user.accessToken}`,
        },
        next: {
          tags: [""],
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch user data:", errorData);
      return {
        error: errorData?.message || "Failed to fetch user data.",
        ok: false,
        data: null,
      };
    }

    const data = await response.json();

    return {
      ok: true,
      data: data?.payload || null,
    };
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return {
      error:
        error?.message ||
        "An unexpected error occurred. Please try again later.",
      ok: false,
      data: null,
    };
  }
}

export const getCachedAllUsersData = unstable_cache(
  async (headers) => await getUserDataTest(headers), // Ensure async
  ["userDataCache"],
  { revalidate: 360 }
);

export const getCachedUserData = unstable_cache(
  async (headers) => await getAllUserData(headers), // Ensure async
  ["userDataCache"],
  { revalidate: 360 }
);
