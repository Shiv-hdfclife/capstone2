import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward signup request to backend API
    const res = await axios.post("http://10.62.201.200:8080/auth/signup", body);

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.response?.data || "Signup failed" },
      { status: error.response?.status || 500 }
    );
  }
}
