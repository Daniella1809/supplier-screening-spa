import { z } from 'zod';

export const supplierSchema = z.object({
  legalName: z
    .string()
    .trim()
    .min(2, 'La razón social debe tener al menos 2 caracteres.')
    .max(250, 'La razón social no puede superar los 250 caracteres.'),
  commercialName: z
    .string()
    .trim()
    .min(2, 'El nombre comercial debe tener al menos 2 caracteres.')
    .max(250, 'El nombre comercial no puede superar los 250 caracteres.'),
  taxId: z
    .string()
    .trim()
    .regex(/^\d{11}$/, 'La identificación tributaria debe tener exactamente 11 dígitos numéricos.'),
  phone: z
    .string()
    .trim()
    .min(6, 'El número telefónico es demasiado corto.')
    .max(30, 'El número telefónico no puede superar los 30 caracteres.')
    .regex(/^[+()\-\s\d]+$/, 'El número telefónico solo puede contener dígitos y los símbolos + ( ) - .'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio.')
    .email('El correo electrónico no tiene un formato válido.')
    .max(200, 'El correo electrónico no puede superar los 200 caracteres.'),
  website: z
    .string()
    .trim()
    .url('El sitio web debe ser una URL válida (ej. https://ejemplo.com).')
    .max(300, 'El sitio web no puede superar los 300 caracteres.')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .min(3, 'La dirección debe tener al menos 3 caracteres.')
    .max(500, 'La dirección no puede superar los 500 caracteres.'),
  countryCode: z
    .string()
    .trim()
    .length(2, 'Seleccione un país de la lista.'),
  annualRevenue: z
    .number({ invalid_type_error: 'La facturación anual debe ser un número.' })
    .min(0, 'La facturación anual debe ser un valor positivo.')
    .max(999999999999.99, 'La facturación anual excede el máximo permitido.'),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
