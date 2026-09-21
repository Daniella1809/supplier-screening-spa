import type { AxiosError } from 'axios';
import type { ApiError } from '../api/types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function extractApiErrors(error: unknown): string[] {
  const axiosErr = error as AxiosError<ApiError>;
  const data = axiosErr?.response?.data;
  if (data) {
    if (data.errors && data.errors.length > 0) return data.errors;
    if (data.message) return [data.message];
  }
  if (axiosErr?.message) return [axiosErr.message];
  return ['Ocurrió un error inesperado. Intente nuevamente.'];
}
