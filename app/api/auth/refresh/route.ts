import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: "No refresh token found" },
                { status: 401 }
            );
        }

        // Call backend refresh endpoint
        const res = await axios.post("http://10.62.201.200:8080/auth/refresh", {}, {
            headers: {
                "Refresh-token": refreshToken,
            },
        });

        // Extract new tokens from response headers
        const newAccessToken = res.headers['access-token'];
        const newRefreshToken = res.headers['refresh-token'];

        console.log('Token refresh successful:', {
            accessToken: newAccessToken ? 'Present' : 'Missing',
            refreshToken: newRefreshToken ? 'Present' : 'Missing'
        });

        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Tokens refreshed successfully"
        });

        // Update tokens in cookies
        if (newAccessToken) {
            response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 15 * 60, // 15 minutes
            });
        }

        if (newRefreshToken) {
            response.cookies.set("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
        }

        return response;
    } catch (error: any) {
        console.error('Token refresh error:', error.response?.data || error.message);

        // Clear invalid tokens
        const response = NextResponse.json(
            { success: false, message: "Token refresh failed" },
            { status: 401 }
        );

        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
    }
}