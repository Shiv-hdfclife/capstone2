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
  issuedMembers: number; // Add issued count
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
  lifeFlag?: string; // Add life flag field
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
    const response = await apiCall(`/api/loader-content/${loaderId}`);
    
    return {
      id: response.id,
      name: response.loaderName || response.name,
      partner: response.partnerName || response.partner,
      loaderType: response.loaderType || response.type,
      uploadDate: response.uploadDate || response.createdAt,
      totalMembers: response.totalMembers || 0,
      pendingMembers: response.pendingMembers || 0,
      approvedMembers: response.approvedMembers || 0,
      rejectedMembers: response.rejectedMembers || 0,
      issuedMembers: response.issuedMembers || 0, // Add issued count
      status: response.status || 'Active',
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
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await apiCall(`/api/loader-content/${loaderId}/records?${params.toString()}`);
    
    const normalized = (response.records || response.data || []).map((record: any) => ({
      id: record.id,
      rcd: record.rcd || record.recordDate,
      lan: record.lan || record.loanAccountNumber,
      memberName: record.memberName || record.name,
      status: record.status,
      reason: record.reason || record.remarks || '',
      policyNo: record.policyNumber || record.policyNo,
      sum: record.sumAssured || record.sum || 0,
      lifeFlag: record.lifeFlag || record.life_flag,
    }));

    return {
      data: normalized,
      total: response.total || normalized.length,
      page: response.page || page,
      pageSize: response.pageSize || pageSize,
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
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await apiCall(`/api/loader-content/${loaderId}/issued?${params.toString()}`);
    
    const normalized = (response.records || response.data || []).map((record: any) => ({
      id: record.id,
      rcd: record.rcd || record.recordDate,
      lan: record.lan || record.loanAccountNumber,
      memberName: record.memberName || record.name,
      status: 'Issued', // Force status as issued
      reason: record.reason || record.remarks || '',
      policyNo: record.policyNumber || record.policyNo,
      sum: record.sumAssured || record.sum || 0,
      lifeFlag: record.lifeFlag || record.life_flag,
    }));

    return {
      data: normalized,
      total: response.total || normalized.length,
      page: response.page || page,
      pageSize: response.pageSize || pageSize,
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
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (search.trim()) {
      params.append('search', search.trim());
    }

    const response = await apiCall(`/api/loader-content/${loaderId}/rejected?${params.toString()}`);
    
    const normalized = (response.records || response.data || []).map((record: any) => ({
      id: record.id,
      rcd: record.rcd || record.recordDate,
      lan: record.lan || record.loanAccountNumber,
      memberName: record.memberName || record.name,
      status: 'Rejected', // Force status as rejected
      reason: record.reason || record.remarks || '',
      policyNo: record.policyNumber || record.policyNo,
      sum: record.sumAssured || record.sum || 0,
      lifeFlag: record.lifeFlag || record.life_flag,
    }));

    return {
      data: normalized,
      total: response.total || normalized.length,
      page: response.page || page,
      pageSize: response.pageSize || pageSize,
    };
  } catch (error) {
    console.error('Fetch rejected records failed:', error);
    throw error;
  }
};