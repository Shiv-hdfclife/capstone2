import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        // Get tokens from cookies
        // const cookieStore = await cookies();
        // const accessToken = cookieStore.get("accessToken")?.value;
        // const refreshToken = cookieStore.get("refreshToken")?.value;

        // if (!accessToken) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "Authentication required",
        //         partners: []
        //     }, { status: 401 });
        // }

        // Use the correct backend URL to avoid CORS issues
        console.log("Entering bff");
        const backendUrl = process.env.BACKEND_API_URL;
        const response = await axios.get(`${backendUrl}/partners`);
        console.log("Backend response:", response);
        // Extract only the required fields (id and name) for frontend
        const simplifiedPartners = response.data.partners.map((partner: any) => ({
            id: partner.id,
            name: partner.name
        }));

        return NextResponse.json({
            success: true,
            message: "Partners fetched successfully",
            partners: simplifiedPartners
        });

    } catch (error: any) {
        console.error('Error fetching partners:', error);

        // Handle specific authentication errors
        if (error.response?.status === 401) {
            return NextResponse.json({
                success: false,
                message: "Authentication failed",
                partners: []
            }, { status: 401 });
        }


        return NextResponse.json({
            success: false,
            message: error.response?.data?.message || "Failed to fetch partners",
            partners: []
        }, {
            status: error.response?.status

        });
    }
}