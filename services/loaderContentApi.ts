// export type LoaderContent = {
//   id: string;
//   name: string;
//   partner: string;
//   loaderType: string;
//   uploadDate: string;
//   totalMembers: number;
//   pendingMembers: number;
//   approvedMembers: number;
//   rejectedMembers: number;
//   status: string;
// };

// export type MemberRecord = {
//   id: number;
//   rcd: string;
//   lan: string;
//   memberName: string;
//   status: string;
//   reason: string;
//   policyNo?: string;
//   sum: number;
// };

// export type PaginatedMemberResponse = {
//   data: MemberRecord[];
//   total: number;
//   page: number;
//   pageSize: number;
// };

// // API wrapper using fetch
// const apiCall = async (url: string, options = {}) => {
//   const response = await fetch(url, {
//     headers: { 'Content-Type': 'application/json' },
//     ...options,
//   });
  
//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//   }
//   return response.json();
// };

// // Fetch loader details by ID
// export const fetchLoaderContent = async (loaderId: string): Promise<LoaderContent> => {
//   try {
//     const response = await apiCall(`/api/loader-content/${loaderId}`);
    
//     return {
//       id: response.id,
//       name: response.loaderName || response.name,
//       partner: response.partnerName || response.partner,
//       loaderType: response.loaderType || response.type,
//       uploadDate: response.uploadDate || response.createdAt,
//       totalMembers: response.totalMembers || 0,
//       pendingMembers: response.pendingMembers || 0,
//       approvedMembers: response.approvedMembers || 0,
//       rejectedMembers: response.rejectedMembers || 0,
//       status: response.status || 'Active',
//     };
//   } catch (error) {
//     console.error('Fetch loader content failed:', error);
//     throw error;
//   }
// };

// // Fetch member records for a specific loader
// export const fetchMemberRecords = async (
//   loaderId: string,
//   page: number = 1,
//   pageSize: number = 10,
//   status: string = "",
//   search: string = ""
// ): Promise<PaginatedMemberResponse> => {
//   try {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       pageSize: pageSize.toString(),
//     });
    
//     if (status && status !== "All Status") {
//       params.append('status', status);
//     }
    
//     if (search.trim()) {
//       params.append('search', search.trim());
//     }

//     const response = await apiCall(`/api/loader-content/${loaderId}/records?${params.toString()}`);
    
//     const normalized = (response.records || response.data || []).map((record: any) => ({
//       id: record.id,
//       rcd: record.rcd || record.recordDate,
//       lan: record.lan || record.loanAccountNumber,
//       memberName: record.memberName || record.name,
//       status: record.status,
//       reason: record.reason || record.remarks,
//       policyNo: record.policyNumber || record.policyNo,
//       sum: record.sumAssured || record.sum || 0,
//     }));

//     return {
//       data: normalized,
//       total: response.total || normalized.length,
//       page: response.page || page,
//       pageSize: response.pageSize || pageSize,
//     };
//   } catch (error) {
//     console.error('Fetch member records failed:', error);
//     throw error;
//   }
// };



export type LoaderContent = {
  id: string;
  name: string;
  partner: string;
  loaderType: string;
  uploadDate: string;
  totalMembers: number;
  pendingMembers: number;
  approvedMembers: number;
  rejectedMembers: number;
  issuedMembers: number;
  status: string;
};

export type MemberRecord = {
  id: number;
  rcd: string;
  lan: string;
  memberName: string;
  status: string;
  reason: string;
  policyNo?: string;
  sum: number;
  lifeFlag?: string;
  relation?: string;
  planName?: string;
  salutation?: string;
  sex?: string;
  dob?: string;
  mobile?: string;
  email?: string;
  riskTerm?: number;
  loanTerm?: number;
  interestRate?: number;
};

export type PaginatedMemberResponse = {
  data: MemberRecord[];
  total: number;
  page: number;
  pageSize: number;
};

// API wrapper using fetch
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

// Fetch loader details by ID
export const fetchLoaderContent = async (loaderId: string): Promise<LoaderContent> => {
  try {
    // Get raw loader info
    const rawResponse = await apiCall(`http://192.168.254.74:8989/api/partners/raw-loaders`);
    if (!rawResponse.success || !rawResponse.data) {
      throw new Error('Failed to fetch raw loaders');
    }
    
    const loader = rawResponse.data.find((item: any) => item.id === loaderId);
    if (!loader) {
      throw new Error('Loader not found');
    }

    // Get transformed records to calculate counts
    const transformedResponse = await apiCall(`http://192.168.254.74:8989/api/partners/transformed-records`);
    const transformedData = transformedResponse.success ? 
      transformedResponse.data?.find((item: any) => item.sourceImportId === loaderId) : null;
    
    // Get failed records
    const failedResponse = await apiCall(`http://192.168.254.74:8989/api/partners/failed-records`);
    const failedData = failedResponse.success ? 
      failedResponse.data?.find((item: any) => item.sourceImportId === loaderId) : null;
    
    const transformedCount = transformedData?.records?.length || 0;
    const failedCount = failedData?.totalFailedRecords || 0;
    
    return {
      id: loader.id,
      name: loader.filename,
      partner: getPartnerName(loader.partnerId),
      loaderType: determineLoaderType(loader.configId),
      uploadDate: loader.createdAt,
      totalMembers: loader.rowCount || 0,
      pendingMembers: Math.max(0, (loader.rowCount || 0) - transformedCount - failedCount),
      approvedMembers: transformedCount,
      rejectedMembers: failedCount,
      issuedMembers: transformedCount, // Same as approved for now
      status: loader.status,
    };
  } catch (error) {
    console.error('Fetch loader content failed:', error);
    throw error;
  }
};

// Fetch ALL member records for a specific loader
export const fetchMemberRecords = async (
  loaderId: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
): Promise<PaginatedMemberResponse> => {
  try {
    // Get both transformed and failed records
    const [transformedResponse, failedResponse] = await Promise.all([
      apiCall(`http://192.168.254.74:8989/api/partners/transformed-records`),
      apiCall(`http://192.168.254.74:8989/api/partners/failed-records`)
    ]);
    
    const transformedData = transformedResponse.success ? 
      transformedResponse.data?.find((item: any) => item.sourceImportId === loaderId) : null;
    const failedData = failedResponse.success ? 
      failedResponse.data?.find((item: any) => item.sourceImportId === loaderId) : null;
    
    let allRecords: MemberRecord[] = [];
    
    // Add transformed records (Approved/Issued)
    if (transformedData?.records) {
      const transformedRecords = transformedData.records.map((record: any, index: number) => ({
        id: index + 1,
        rcd: record.issueDate || record.dob || new Date().toISOString(),
        lan: record.policyNumber || `LAN-${index + 1}`,
        memberName: record.customerName || "",
        status: "Approved",
        reason: "",
        policyNo: record.policyNumber,
        sum: record.sumAssured || record.premium || 0,
        lifeFlag: record.planName || record.product || "",
        relation: record.relation,
        planName: record.planName,
        salutation: record.salutation,
        sex: record.sex,
        dob: record.dob,
        mobile: record.mobile,
        email: record.email,
        riskTerm: record.riskTerm,
        loanTerm: record.loanTerm,
        interestRate: record.interestRate,
      }));
      allRecords = [...allRecords, ...transformedRecords];
    }
    
    // Add failed records (Rejected)
    if (failedData?.failedRecords) {
      const failedRecords = failedData.failedRecords.map((record: any, index: number) => ({
        id: allRecords.length + index + 1,
        rcd: record.rawData["Issue Date"] || new Date().toISOString(),
        lan: `LAN-${allRecords.length + index + 1}`,
        memberName: record.rawData["Customer Name"] || "",
        status: "Rejected",
        reason: record.errors?.join(", ") || "",
        policyNo: record.rawData["Policy Number"] || "",
        sum: record.rawData["Premium"] || record.rawData["Sum Assured"] || 0,
        lifeFlag: record.rawData["Product"] || record.rawData["Plan Name"] || "",
        mobile: record.rawData["Mobile"],
      }));
      allRecords = [...allRecords, ...failedRecords];
    }
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      allRecords = allRecords.filter(record => 
        record.memberName.toLowerCase().includes(searchLower) ||
        record.lan.toLowerCase().includes(searchLower) ||
        record.policyNo?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = allRecords.slice(startIndex, endIndex);
    
    return {
      data: paginatedRecords,
      total: allRecords.length,
      page: page,
      pageSize: pageSize,
    };
  } catch (error) {
    console.error('Fetch member records failed:', error);
    throw error;
  }
};

// Fetch ISSUED records only
export const fetchIssuedRecords = async (
  loaderId: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
): Promise<PaginatedMemberResponse> => {
  try {
    const transformedResponse = await apiCall(`http://192.168.254.74:8989/api/partners/transformed-records`);
    const transformedData = transformedResponse.success ? 
      transformedResponse.data?.find((item: any) => item.sourceImportId === loaderId) : null;
    
    let records: MemberRecord[] = [];
    
    if (transformedData?.records) {
      records = transformedData.records.map((record: any, index: number) => ({
        id: index + 1,
        rcd: record.issueDate || record.dob || new Date().toISOString(),
        lan: record.policyNumber || `LAN-${index + 1}`,
        memberName: record.customerName || "",
        status: "Issued",
        reason: "",
        policyNo: record.policyNumber,
        sum: record.sumAssured || record.premium || 0,
        lifeFlag: record.planName || record.product || "",
        relation: record.relation,
        planName: record.planName,
        salutation: record.salutation,
        sex: record.sex,
        dob: record.dob,
        mobile: record.mobile,
        email: record.email,
      }));
    }
    
    // Apply search and pagination
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      records = records.filter(record => 
        record.memberName.toLowerCase().includes(searchLower) ||
        record.lan.toLowerCase().includes(searchLower) ||
        record.policyNo?.toLowerCase().includes(searchLower)
      );
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = records.slice(startIndex, endIndex);
    
    return {
      data: paginatedRecords,
      total: records.length,
      page: page,
      pageSize: pageSize,
    };
  } catch (error) {
    console.error('Fetch issued records failed:', error);
    throw error;
  }
};

// Fetch REJECTED records only
export const fetchRejectedRecords = async (
  loaderId: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
): Promise<PaginatedMemberResponse> => {
  try {
    const failedResponse = await apiCall(`http://192.168.254.74:8989/api/partners/failed-records`);
    const failedData = failedResponse.success ? 
      failedResponse.data?.find((item: any) => item.sourceImportId === loaderId) : null;
    
    let records: MemberRecord[] = [];
    
    if (failedData?.failedRecords) {
      records = failedData.failedRecords.map((record: any, index: number) => ({
        id: index + 1,
        rcd: record.rawData["Issue Date"] || new Date().toISOString(),
        lan: `LAN-${index + 1}`,
        memberName: record.rawData["Customer Name"] || "",
        status: "Rejected",
        reason: record.errors?.join(", ") || "",
        policyNo: record.rawData["Policy Number"] || "",
        sum: record.rawData["Premium"] || record.rawData["Sum Assured"] || 0,
        lifeFlag: record.rawData["Product"] || record.rawData["Plan Name"] || "",
        mobile: record.rawData["Mobile"],
      }));
    }
    
    // Apply search and pagination
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      records = records.filter(record => 
        record.memberName.toLowerCase().includes(searchLower) ||
        record.lan.toLowerCase().includes(searchLower) ||
        record.policyNo?.toLowerCase().includes(searchLower)
      );
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = records.slice(startIndex, endIndex);
    
    return {
      data: paginatedRecords,
      total: records.length,
      page: page,
      pageSize: pageSize,
    };
  } catch (error) {
    console.error('Fetch rejected records failed:', error);
    throw error;
  }
};

// Helper functions
const determineLoaderType = (configId: string): string => {
  const typeMap: { [key: string]: string } = {
    "68de6962f4aebb03bcea2989": "Insurance Policies",
    "68de638df4aebb03bcea297c": "Motor Policies",
    "68de6220f4aebb03bcea2977": "General Policies"
  };
  return typeMap[configId] || "Unknown";
};

const getPartnerName = (partnerId: number): string => {
  const partnerMap: { [key: number]: string } = {
    13: "HDFC Partner",
    99: "Motor Partner", 
    123: "Insurance Partner"
  };
  return partnerMap[partnerId] || `Partner ${partnerId}`;
};