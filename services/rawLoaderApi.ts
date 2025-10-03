export type RawLoader = {
  id: string;
  Date: string;
  LoaderID: string;
  LoaderName: string;
  LoaderType: string;
  Partner: string;
  Pending: number;
  TotalMembers: number;
  Status: string;
  ErrorRows: number;
  TransformedCount: number;
  filePath?: string;
  actions?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

// API wrapper using fetch
const apiCall = async (url: string, options = {}) => {
  const response = await fetch(url, 
  //   {
  //   headers: { 'Content-Type': 'application/json' },
  //   ...options,
  // }
);
  
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
    const params = new URLSearchParams();
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    // Use the correct API endpoint
    const url = `http://192.168.254.74:8989/api/partners/raw-loaders${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiCall(url);
    
    // Handle the actual API response structure
    if (!response.success || !response.data) {
      throw new Error('Invalid API response structure');
    }

    // Map the actual API response structure
    const normalized = response.data.map((loader: any) => ({
      id: loader.id,
      Date: loader.createdAt || loader.importedAt,
      LoaderID: loader.id,
      LoaderName: loader.filename,
      LoaderType: determineLoaderType(loader.configId),
      Partner: getPartnerName(loader.partnerId),
      Pending: Array.isArray(loader.errorRows) ? loader.errorRows.length : 0,
      TotalMembers: loader.rowCount || 0,
      Status: loader.status,
      ErrorRows: Array.isArray(loader.errorRows) ? loader.errorRows.length : 0,
      TransformedCount: loader.transformedCount || 0,
      filePath: loader.gridFSFileId,
      actions: "Download",
    }));

    // Apply search filter on frontend if needed
    let filteredData = normalized;
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredData = normalized.filter((loader: RawLoader) => 
        loader.LoaderName.toLowerCase().includes(searchLower) ||
        loader.LoaderID.toLowerCase().includes(searchLower) ||
        loader.LoaderType.toLowerCase().includes(searchLower) ||
        loader.Partner.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination on frontend
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: filteredData.length,
      page: page,
      pageSize: pageSize,
    };
  } catch (error: any) {
    console.error('Fetch raw loaders failed:', error);
    throw error;
  }
};

// Helper function to determine loader type based on configId
const determineLoaderType = (configId: string): string => {
  const typeMap: { [key: string]: string } = {
    "68de6962f4aebb03bcea2989": "Insurance Policies",
    "68de638df4aebb03bcea297c": "Motor Policies", 
    "68de6220f4aebb03bcea2977": "General Policies"
  };
  return typeMap[configId] || "Unknown";
};

// Helper function to get partner name based on partnerId
const getPartnerName = (partnerId: number): string => {
  const partnerMap: { [key: number]: string } = {
    13: "HDFC Partner",
    99: "Motor Partner", 
    123: "Insurance Partner"
  };
  return partnerMap[partnerId] || `Partner ${partnerId}`;
};

// Download loader file
export const downloadLoaderFile = async (loaderId: string, fileName: string): Promise<void> => {
  try {
    const response = await fetch(`http://192.168.254.74:8989/api/partners/raw-loaders/${loaderId}/download`, {
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