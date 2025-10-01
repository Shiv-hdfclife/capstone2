import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Call backend API
    const res = await axios.post("http://192.168.254.77:8089/login", {
      username,
      password,
    });
    console.log('Backend response:', res);

    const data = res.data;

    // Extract tokens from response headers
    const accessToken = res.headers['Access-token'];
    const refreshToken = res.headers['Refresh-token'];

    console.log('Login successful, tokens received:', {
      accessToken: accessToken ? 'Present' : 'Missing',
      refreshToken: refreshToken ? 'Present' : 'Missing'
    });

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: data.user || data,
      message: "Login successful"
    });

    // Set tokens in HTTP-only cookies
    if (accessToken) {
      response.cookies.set("AccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60, // 15 minutes (typical access token lifetime)
      });
    }

    if (refreshToken) {
      response.cookies.set("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days (typical refresh token lifetime)
      });
    }

    return response;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || error.message || "Login failed"
      },
      { status: error.response?.status || 500 }
    );
  }
}
