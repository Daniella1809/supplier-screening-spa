import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import type { Supplier } from '../api/types';
import { suppliersApi } from '../api/client';
import { extractApiErrors } from '../utils/format';

interface Props {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ConfirmDeleteDialog({ open, supplier, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!supplier) return;
    setDeleting(true);
    setError(null);
    try {
      await suppliersApi.remove(supplier.id);
      onDeleted();
    } catch (err) {
      setError(extractApiErrors(err).join(' '));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Eliminar proveedor</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          ¿Está seguro de que desea eliminar al proveedor{' '}
          <strong>{supplier?.legalName}</strong>? Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Cancelar
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
          {deleting ? <CircularProgress size={22} /> : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
