import {api} from './api'
export interface SHCCommittee {
  _id: string;
  founder_email: string;
  committee_name: string;
  notes?: string;
  committee_email: string;
  committee_phone_number: string;
  committee_first_name: string;
  committee_last_name: string;
  status: 'activated' | 'deactivated';
  createdAt: string;
  updatedAt: string;
}

export interface SHCCommitteesResponse {
  data: SHCCommittee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SHCCommitteesParams {
  search?: string;
  status?: 'activated' | 'deactivated';
  page?: number;
  limit?: number;
}

export interface CreateCommitteeRequest {
  committee_name: string;
  notes?: string;
  committee_email: string;
  committee_phone_number: string;
  committee_first_name: string;
  committee_last_name: string;
  _id?:string
}

const API_BASE_URL = '/v1/sexual_harassment_management'
export const shcAPI = {
  // Get all SHC committees with filters
  getCommittees: async (params: SHCCommitteesParams = {}): Promise<SHCCommitteesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`${API_BASE_URL}?${searchParams}`);
    
    if (response.status > 300) {
      throw new Error('Failed to fetch SHC committees');
    }
    
    return response.data;
  },

  // Get single SHC committee by ID
  getCommitteeById: async (id: string): Promise<SHCCommittee> => {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    
    if (response.status > 300) {
      throw new Error('Failed to fetch committee details');
    }
    
    return response.data;
  },

  // Create new committee
  createCommittee: async (data: CreateCommitteeRequest): Promise<SHCCommittee> => {
    const response = await api.post(`${API_BASE_URL}`, data);
    
    if (response.status > 300) {
      throw new Error('Failed to create committee');
    }
    
    return response.data;
  },

  // Update committee status
  updateCommitteeStatus: async (id: string, status: 'activated' | 'deactivated'): Promise<SHCCommittee> => {
    const response = await api.patch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (response.status > 300) {
      throw new Error('Failed to fetch committee details');
    }
    
    return response.data;
  },
  activateCommitteeStatus: async (id: string, status: 'activated' | 'deactivated'): Promise<SHCCommittee> => {
    const response = await api.patch(`${API_BASE_URL}/${id}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (response.status > 300) {
      throw new Error('Failed to fetch committee details');
    }
    
    return response.data;
  },
  deactivateCommitteeStatus: async (id: string, status: 'activated' | 'deactivated'): Promise<SHCCommittee> => {
    const response = await api.patch(`${API_BASE_URL}/${id}/deactivate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (response.status > 300) {
      throw new Error('Failed to fetch committee details');
    }
    
    return response.data;
  },
};
