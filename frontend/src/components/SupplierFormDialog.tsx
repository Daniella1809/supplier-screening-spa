import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { supplierSchema, type SupplierFormValues } from '../utils/validation';
import type { Country, Supplier } from '../api/types';
import { suppliersApi } from '../api/client';
import { extractApiErrors } from '../utils/format';

interface Props {
  open: boolean;
  supplier: Supplier | null; // null = crear
  countries: Country[];
  onClose: () => void;
  onSaved: () => void;
}

const emptyValues: SupplierFormValues = {
  legalName: '',
  commercialName: '',
  taxId: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  countryCode: '',
  annualRevenue: 0,
};

export default function SupplierFormDialog({ open, supplier, countries, onClose, onSaved }: Props) {
  const isEdit = supplier !== null;
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      setServerErrors([]);
      if (supplier) {
        reset({
          legalName: supplier.legalName,
          commercialName: supplier.commercialName,
          taxId: supplier.taxId,
          phone: supplier.phone,
          email: supplier.email,
          website: supplier.website ?? '',
          address: supplier.address,
          countryCode: supplier.countryCode,
          annualRevenue: supplier.annualRevenue,
        });
      } else {
        reset(emptyValues);
      }
    }
  }, [open, supplier, reset]);

  const onSubmit = async (values: SupplierFormValues) => {
    setSaving(true);
    setServerErrors([]);
    try {
      const payload = {
        ...values,
        website: values.website ? values.website : null,
      };
      if (isEdit && supplier) {
        await suppliersApi.update(supplier.id, payload);
      } else {
        await suppliersApi.create(payload);
      }
      onSaved();
    } catch (err) {
      setServerErrors(extractApiErrors(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Editar proveedor' : 'Nuevo proveedor'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          {serverErrors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {serverErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="legalName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Razón social"
                    fullWidth
                    required
                    error={!!errors.legalName}
                    helperText={errors.legalName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="commercialName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre comercial"
                    fullWidth
                    required
                    error={!!errors.commercialName}
                    helperText={errors.commercialName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="taxId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Identificación tributaria"
                    fullWidth
                    required
                    inputProps={{ maxLength: 11, inputMode: 'numeric' }}
                    error={!!errors.taxId}
                    helperText={errors.taxId?.message ?? '11 dígitos numéricos'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Número telefónico"
                    fullWidth
                    required
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Sitio web"
                    fullWidth
                    placeholder="https://ejemplo.com"
                    error={!!errors.website}
                    helperText={errors.website?.message ?? 'Opcional'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dirección física"
                    fullWidth
                    required
                    multiline
                    minRows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="País"
                    select
                    fullWidth
                    required
                    error={!!errors.countryCode}
                    helperText={errors.countryCode?.message}
                  >
                    <MenuItem value="">
                      <em>Seleccione un país</em>
                    </MenuItem>
                    {countries.map((c) => (
                      <MenuItem key={c.code} value={c.code}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="annualRevenue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Facturación anual"
                    type="number"
                    fullWidth
                    required
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    inputProps={{ step: '0.01', min: 0 }}
                    error={!!errors.annualRevenue}
                    helperText={errors.annualRevenue?.message ?? 'Formato contabilidad (USD)'}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={22} /> : isEdit ? 'Guardar cambios' : 'Crear proveedor'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
