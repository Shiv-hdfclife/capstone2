import axiosInstance from "./apiClient"; // shared Axios instance

export type Partner = {
  id: number;
  PartnerName?: string;
  email?: string;
  Type?: string;
  ContactAddress?: string;
  DateofAgreement?: string;
  phone?: string;
  Location?: string;
  PAN?: string;
  GST?: string;
  actions?: string[];
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};


export const fetchPartners = async (): Promise<PaginatedResponse<Partner>> => {
  try {
    const res = await axiosInstance.get(`/partners`);
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch partners",
    };
  }
};



// Fetch single partner by ID
export const fetchPartnerById = async (id: number): Promise<Partner> => {
  try {
    const res = await axiosInstance.get(`/partners/${id}`);
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch partner",
    };
  }
};

// Create a new partner
export const createPartner = async (data: Partial<Partner>): Promise<Partner> => {
  try {
    const res = await axiosInstance.post("/partners", data);
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to create partner",
    };
  }
};

// Update an existing partner
export const updatePartner = async (id: number, data: Partial<Partner>): Promise<Partner> => {
  try {
    const res = await axiosInstance.put(`/partners/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update partner",
    };
  }
};
