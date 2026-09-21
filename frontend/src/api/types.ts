export interface Supplier {
  id: number;
  legalName: string;
  commercialName: string;
  taxId: string;
  phone: string;
  email: string;
  website?: string | null;
  address: string;
  countryCode: string;
  countryName?: string | null;
  annualRevenue: number;
  lastEditedAt: string;
  createdAt: string;
}

export interface SupplierInput {
  legalName: string;
  commercialName: string;
  taxId: string;
  phone: string;
  email: string;
  website?: string | null;
  address: string;
  countryCode: string;
  annualRevenue: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Country {
  code: string;
  name: string;
}

export interface ScreeningSource {
  key: string;
  displayName: string;
  available: boolean;
}

export interface ScreeningHit {
  name: string;
  attributes: Record<string, string>;
}

export interface SourceScreeningResult {
  source: string;
  sourceDisplayName: string;
  query: string;
  hits: number;
  results: ScreeningHit[];
  error?: string | null;
}

export interface ScreeningResponse {
  supplierId: number;
  entityName: string;
  retrievedAtUtc: string;
  sources: SourceScreeningResult[];
}

export interface ApiError {
  message: string;
  errors?: string[];
}
