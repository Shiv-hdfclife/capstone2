// app/api/hello/route.js
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
    // Handle GET requests
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'World';
    return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
}
