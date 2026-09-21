import axios from 'axios';
import type {
  Country,
  PagedResult,
  ScreeningResponse,
  ScreeningSource,
  Supplier,
  SupplierInput,
} from './types';


const baseURL = import.meta.env.PROD
  ? window.location.origin
  : (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080');

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export interface SupplierQuery {
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const suppliersApi = {
  list: async (query: SupplierQuery): Promise<PagedResult<Supplier>> => {
    const { data } = await api.get<PagedResult<Supplier>>('/api/suppliers', { params: query });
    return data;
  },
  get: async (id: number): Promise<Supplier> => {
    const { data } = await api.get<Supplier>(`/api/suppliers/${id}`);
    return data;
  },
  create: async (input: SupplierInput): Promise<Supplier> => {
    const { data } = await api.post<Supplier>('/api/suppliers', input);
    return data;
  },
  update: async (id: number, input: SupplierInput): Promise<Supplier> => {
    const { data } = await api.put<Supplier>(`/api/suppliers/${id}`, input);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/suppliers/${id}`);
  },
  screening: async (id: number, sources: string[]): Promise<ScreeningResponse> => {
    const { data } = await api.get<ScreeningResponse>(`/api/suppliers/${id}/screening`, {
      params: { sources: sources.join(',') },
    });
    return data;
  },
};

export const countriesApi = {
  list: async (): Promise<Country[]> => {
    const { data } = await api.get<Country[]>('/api/countries');
    return data;
  },
};

export const sourcesApi = {
  list: async (): Promise<ScreeningSource[]> => {
    const { data } = await api.get<ScreeningSource[]>('/api/sources');
    return data;
  },
};
