import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Get tokens from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Call backend logout if needed with tokens
    if (accessToken) {
      await axios.post("http://10.62.201.200:8080/auth/logout", {}, {
        headers: {
          "Access-token": accessToken,
          "Refresh-token": refreshToken,
        },
      });
    }

    // Clear cookies
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error: any) {
    // Even if backend logout fails, clear local cookies
    const response = NextResponse.json(
      { success: true, message: "Logged out locally" },
      { status: 200 }
    );

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }
}
