import axiosInstance from "@/lib/api-client";
import axios from "axios";


export const partnerData = async () => {
    try {
        const res = await axiosInstance.get('/api/partners/{partnerId}/')
        return res.data;
    } catch (error: any) {
        throw {
            status: error.response?.status || 500,
            message: error.response?.data?.message || "Failed to fetch users",
        }
    }
}

// New function to fetch partners list from BFF
export const fetchPartners = async () => {
    try {
        const res = await fetch('/api/partner/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error: any) {
        throw {
            status: error.status || 500,
            message: error.message || "Failed to fetch partners",
        }
    }
}

export const uploadFile = async (file: File, documentType: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);

        // const res = await axiosInstance.post('/api/upload', formData, {
        const res = await axiosInstance.post('configs/api/partners/{partnerId}/loader-transformation-configs/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error: any) {
        throw {
            status: error.response?.status || 500,
            message: error.response?.data?.message || "File upload failed",
        }
    }
}

export const uploadRawLoader = async (file: File, documentType: string, partnerId: string, configId: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);

        const res = await axiosInstance.post(`/api/partners/${partnerId}/configs/${configId}/loader-data/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data
    } catch (error: any) {
        throw {
            status: error.response?.status || 500,
            message: error.response?.data?.message || "Raw loader upload failed",
        }
    }
}