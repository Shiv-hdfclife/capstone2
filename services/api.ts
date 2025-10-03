import axiosInstance from "./apiClient";

export type Partner = {
  id: number;
  PartnerName?: string;
  email?: string;
  Type?: "INDIVIDUAL" | "COMPANY" | "GOVERNMENT" | "NON_PROFIT"; 
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
    // Use Next.js proxy: /api/partners → http://192.168.254.77:8088/partners
    const res = await axiosInstance.get(`/api/partners`);
    const raw = res.data;

    // Handle different response structures
    const partnersArray = raw.partners || raw.data || raw || [];
    
    const normalized = partnersArray.map((p: any) => ({
      id: p.id,
      PartnerName: p.name || p.partnerName || p.PartnerName,
      email: p.email,
      Type: p.partnerType || p.type || p.Type,
      phone: p.contactNumber || p.phone,
      PAN: p.panNumber || p.PAN,
      GST: p.gstinNumber || p.GST,
      ContactAddress: p.address || p.ContactAddress,
      DateofAgreement: p.dateOfAgreement || p.DateofAgreement,
      Location: p.address || p.contactAddress,
      actions: ["View", "Edit"],
    }));

    return {
      data: normalized,
      total: normalized.length,
      page: 1,
      pageSize: normalized.length,
    };
  } catch (error: any) {
    console.error('API Error:', error);
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch partners",
    };
  }
};

// Fetch single partner by ID
export const fetchPartnerById = async (id: number): Promise<Partner> => {
  try {
    // Use Next.js proxy: /api/partners/123 → http://192.168.254.77:8088/partners/123
    const res = await axiosInstance.get(`/api/partners/${id}`);
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch partner",
    };
  }
};

// Create a new partner
export const createPartner = async (data: Partial<Partner>, editorUsername?: string): Promise<Partner> => {
  try {
    // Convert partner type to backend enum format
    const convertPartnerType = (type: string | undefined): string | undefined => {
      if (!type) return undefined;
      
      const typeMap: { [key: string]: string } = {
        "Individual": "INDIVIDUAL",
        "Company": "COMPANY", 
        "Government": "GOVERNMENT",
        "Non-Profit": "NON_PROFIT",
        "INDIVIDUAL": "INDIVIDUAL",
        "COMPANY": "COMPANY",
        "GOVERNMENT": "GOVERNMENT", 
        "NON_PROFIT": "NON_PROFIT",
      };
      
      return typeMap[type] || type.toUpperCase();
    };

    const payload = {
      name: data.PartnerName,
      email: data.email,
      partnerType: convertPartnerType(data.Type),
      contactNumber: data.phone,
      address: data.ContactAddress,
      dateOfAgreement: data.DateofAgreement,
      gstinNumber: data.GST,
      panNumber: data.PAN,
    };

    console.log('Create payload:', payload);
    console.log('Create editor:', editorUsername);

    // Add X-Editor header to the POST request
    const res = await axiosInstance.post("/api/partner", payload, {
      headers: {
        'X-Editor': editorUsername || 'adminUser'
      }
    });
    
    return res.data;
  } catch (error: any) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to create partner",
    };
  }
};

// Update an existing partner
export const updatePartner = async (id: number, data: Partial<Partner>, editorUsername?: string): Promise<Partner> => {
  try {
    // Convert partner type to backend enum format
    const convertPartnerType = (type: string | undefined): string | undefined => {
      if (!type) return undefined;
      
      // Convert frontend display values to backend enum values
      const typeMap: { [key: string]: string } = {
        "Individual": "INDIVIDUAL",
        "Company": "COMPANY", 
        "Government": "GOVERNMENT",
        "Non-Profit": "NON_PROFIT",
        "INDIVIDUAL": "INDIVIDUAL",
        "COMPANY": "COMPANY",
        "GOVERNMENT": "GOVERNMENT", 
        "NON_PROFIT": "NON_PROFIT",
      };
      
      return typeMap[type] || type.toUpperCase();
    };

    // Convert frontend field names to backend expected format
    const payload = {
      id: id,
      name: data.PartnerName,
      email: data.email,
      partnerType: convertPartnerType(data.Type), // Convert to proper enum
      contactNumber: data.phone,
      address: data.ContactAddress,
      dateOfAgreement: data.DateofAgreement,
      gstinNumber: data.GST,
      panNumber: data.PAN,
    };

    console.log('Frontend data:', data);
    console.log('Backend payload:', payload);
    console.log('Editor username:', editorUsername);

    const res = await axiosInstance.patch(`/api/partner/${id}`, payload, {
      headers: {
        'X-Editor': editorUsername || 'adminUser' // Fallback to adminUser if no username provided
      }
    });


    return res.data;
  } catch (error: any) {
    console.error('Update Partner Error:', error);
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update partner",
    };
  }
};