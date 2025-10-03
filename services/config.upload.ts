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
        console.log("Fetching partners from BFF...");
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

//config upload
export const uploadFile = async (file: File, documentType: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);

        // Always use partnerId 123 for upload URL
        const res = await axios.post('http://192.168.254.74:8081/configs/api/partners/123/loader-transformation-configs/upload', formData, {
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

//raw loader upload
export const uploadRawLoader = async (file: File, documentType: string, partnerId: string, configId: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);

        // const res = await axios.post('http://192.168.254.74:8989/api/partners/123/configs/68de6962f4aebb03bcea2989/loader-data/upload', formData, {
        const res = await axios.post('http://192.168.254.74:8989/api/partners/99/configs/68de638df4aebb03bcea297c/loader-data/upload', formData, {
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

// Function to fetch loader configurations for a partner
export const fetchLoaderConfigs = async (partnerId: string) => {
    try {
        console.log(`Fetching loader configs for partner ${partnerId}... (using hardcoded partnerId: 123)`);

        // Always use partnerId 123 for fetching configs
        const res = await fetch(`http://192.168.254.74:8081/configs/api/partner/123/configs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('✅ Loader configs fetched successfully:', data);

        return {
            success: true,
            configs: data,
            message: "Loader configurations fetched successfully"
        };
    } catch (error: any) {
        console.error('❌ Error fetching loader configs:', error);
        throw {
            status: error.status || 500,
            message: error.message || "Failed to fetch loader configurations",
        }
    }
}

// Function to download file using excelFileId
export const downloadFile = async (excelFileId: string) => {
    try {
        console.log(`Downloading file with ID: ${excelFileId}`);

        // Always use partnerId 123 for download URL
        const downloadUrl = `http://192.168.254.74:8081/api/partners/123/files/${excelFileId}/download`;

        const res = await fetch(downloadUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Get the blob data for download
        const blob = await res.blob();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Try to get filename from Content-Disposition header, fallback to default
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = `file_${excelFileId}.xlsx`;

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }

        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('✅ File download initiated successfully');
        return {
            success: true,
            message: "File download initiated successfully"
        };
    } catch (error: any) {
        console.error('❌ Error downloading file:', error);
        throw {
            status: error.status || 500,
            message: error.message || "Failed to download file",
        }
    }
}