import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import type { Supplier } from '../api/types';
import { formatCurrency, formatDateTime } from '../utils/format';

interface Props {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Grid item xs={12} sm={6}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{children || '—'}</Typography>
    </Grid>
  );
}

export default function SupplierViewDialog({ open, supplier, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle del proveedor</DialogTitle>
      <DialogContent dividers>
        {supplier && (
          <Grid container spacing={2}>
            <Field label="Razón social">{supplier.legalName}</Field>
            <Field label="Nombre comercial">{supplier.commercialName}</Field>
            <Field label="Identificación tributaria">{supplier.taxId}</Field>
            <Field label="Teléfono">{supplier.phone}</Field>
            <Field label="Correo electrónico">
              <Link href={`mailto:${supplier.email}`}>{supplier.email}</Link>
            </Field>
            <Field label="Sitio web">
              {supplier.website ? (
                <Link href={supplier.website} target="_blank" rel="noopener noreferrer">
                  {supplier.website}
                </Link>
              ) : (
                '—'
              )}
            </Field>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Field label="País">{supplier.countryName ?? supplier.countryCode}</Field>
            <Field label="Facturación anual">{formatCurrency(supplier.annualRevenue)}</Field>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Dirección física
              </Typography>
              <Typography variant="body1">{supplier.address}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Field label="Fecha de creación">{formatDateTime(supplier.createdAt)}</Field>
            <Field label="Última edición">{formatDateTime(supplier.lastEditedAt)}</Field>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
