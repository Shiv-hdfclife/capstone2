export type RawLoader = {
  id: number;
  Date: string;
  LoaderID: string;
  LoaderName: string;
  LoaderType: string;
  Partner: string;
  Pending: number;
  TotalMembers: number;
  filePath?: string;
  actions?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

// Simple API wrapper using fetch (uses Next.js proxy)
const apiCall = async (url: string, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Fetch all raw loaders
export const fetchRawLoaders = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
): Promise<PaginatedResponse<RawLoader>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    // This will use the Next.js proxy to the correct backend
    const response = await apiCall(`/api/raw-loaders?${params.toString()}`);
    
    // Normalize the data structure based on what your backend returns
    const normalized = (response.loaders || response.data || []).map((loader: any) => ({
      id: loader.id,
      Date: loader.uploadDate || loader.createdAt || loader.date,
      LoaderID: loader.loaderId || loader.id.toString(),
      LoaderName: loader.loaderName || loader.name,
      LoaderType: loader.loaderType || loader.type,
      Partner: loader.partnerName || loader.partner,
      Pending: loader.pendingCount || loader.pending || 0,
      TotalMembers: loader.totalMembers || loader.memberCount || 0,
      filePath: loader.filePath || loader.downloadUrl,
      actions: "Download",
    }));

    return {
      data: normalized,
      total: response.total || normalized.length,
      page: response.page || page,
      pageSize: response.pageSize || pageSize,
    };
  } catch (error: any) {
    console.error('Fetch raw loaders failed:', error);
    throw error;
  }
};

// Download loader file
export const downloadLoaderFile = async (loaderId: string, fileName: string): Promise<void> => {
  try {
    const response = await fetch(`/api/raw-loaders/${loaderId}/download`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Default export for compatibility
export default {
  get: async (url: string) => apiCall(url),
  post: async (url: string, data: any) => apiCall(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};