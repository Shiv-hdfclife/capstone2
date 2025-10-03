import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { name, email, username, password, phoneNumber } = await req.json();

    // Basic validation
    if (!name || !email || !username || !password || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    console.log('📤 Attempting signup with:', {
      name,
      email,
      username,
      phone: phoneNumber.substring(0, 3) + "XXXXXXX" // Log partial phone for security
    });

    // Forward signup request to backend API
    const res = await axios.post("http://192.168.254.77:8089/register", {
      name: name.trim(),
      email: email.trim(),
      username: username.trim(),
      password: password.trim(),
      phone: phoneNumber.trim()
    });

    console.log('✅ Signup API response received:', {
      status: res.status,
      success: res.data.success || true
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: res.data.user || { username, email, name }
    });

  } catch (error: any) {
    console.error('❌ Signup API error:', error.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || error.message || "Signup failed. Please try again."
      },
      { status: error.response?.status || 500 }
    );
  }
}
