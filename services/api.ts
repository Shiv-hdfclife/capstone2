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

// Fetch all partners (paginated)
export const fetchPartners = async (): Promise<PaginatedResponse<Partner>> => {
  try {
    const res = await axiosInstance.get(`/partners`);
    const raw = res.data;

    const normalized = (raw.partners || []).map((p: any) => ({
      id: p.id,
      PartnerName: p.name,
      email: p.email,
      Type: p.partnerType,
      phone: p.contactNumber,
      PAN: p.panNumber,
      GST: p.gstinNumber,
      ContactAddress: p.address,
      DateofAgreement: p.dateOfAgreement,
      Location: p.location, // only if present
      actions: ["View", "Edit"],
    }));

    return {
      data: normalized,
      total: normalized.length,
      page: 1,
      pageSize: normalized.length,
    };
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
    const payload = {
      name: data.PartnerName,
      email: data.email,
      partnerType: data.Type,
      contactNumber: data.phone,
      address: data.ContactAddress,
      dateOfAgreement: data.DateofAgreement,
      gstinNumber: data.GST,
      panNumber: data.PAN,
    };

    const res = await axiosInstance.post("/partner", payload);
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
    const res = await axiosInstance.patch(`/partners/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update partner",
    };
  }
};

