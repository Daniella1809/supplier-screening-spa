import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Tooltip,
  Alert,
  Snackbar,
  Link,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import type { Country, Supplier } from '../api/types';
import { countriesApi, suppliersApi } from '../api/client';
import { formatCurrency, formatDateTime, extractApiErrors } from '../utils/format';
import SupplierFormDialog from '../components/SupplierFormDialog';
import SupplierViewDialog from '../components/SupplierViewDialog';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import ScreeningDialog from '../components/ScreeningDialog';

type DialogKind = 'create' | 'edit' | 'view' | 'delete' | 'screening' | null;

export default function SuppliersPage() {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'lastEditedAt', sort: 'desc' }]);

  const [dialog, setDialog] = useState<DialogKind>(null);
  const [active, setActive] = useState<Supplier | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sort = sortModel[0];
      const query = {
        ...(searchInput.trim() && { search: searchInput.trim() }),
        sortBy: sort?.field ?? 'lastEditedAt',
        sortDir: (sort?.sort as 'asc' | 'desc') ?? 'desc',
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      };
      
      const res = await suppliersApi.list(query);
      setRows(res.items);
      setRowCount(res.total);
    } catch (err) {
      setError(extractApiErrors(err).join(' '));
    } finally {
      setLoading(false);
    }
  }, [searchInput, sortModel, paginationModel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  useEffect(() => {
    countriesApi.list().then(setCountries).catch(() => setCountries([]));
  }, []);

  const closeDialog = () => {
    setDialog(null);
    setActive(null);
  };

  const handleSaved = () => {
    closeDialog();
    setToast('Proveedor guardado correctamente.');
    fetchData();
  };

  const handleDeleted = () => {
    closeDialog();
    setToast('Proveedor eliminado.');
    fetchData();
  };

  const columns = useMemo<GridColDef<Supplier>[]>(
    () => [
      { 
        field: 'legalName', 
        headerName: 'Razón Social', 
        flex: 1.5, 
        minWidth: 200 
      },
      { 
        field: 'commercialName', 
        headerName: 'Nombre Comercial', 
        flex: 1.2, 
        minWidth: 160 
      },
      { 
        field: 'taxId', 
        headerName: 'ID Tributaria', 
        width: 140 
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 180
      },
      {
        field: 'phone',
        headerName: 'Teléfono',
        width: 140
      },
      {
        field: 'address',
        headerName: 'Dirección',
        flex: 1.2,
        minWidth: 200
      },
      {
        field: 'countryName',
        headerName: 'País',
        width: 120,
        valueGetter: (_v, row) => row.countryName ?? row.countryCode,
      },
      {
        field: 'annualRevenue',
        headerName: 'Facturación Anual',
        width: 160,
        type: 'number',
        valueFormatter: (value: number) => formatCurrency(value),
      },
      {
        field: 'website',
        headerName: 'Sitio Web',
        width: 120,
        sortable: false,
        renderCell: (params) =>
          params.value ? (
            <Link href={params.value as string} target="_blank" rel="noopener noreferrer">
              Ver
            </Link>
          ) : (
            '—'
          ),
      },
      {
        field: 'createdAt',
        headerName: 'Fecha Creación',
        width: 160,
        valueFormatter: (value: string) => formatDateTime(value),
      },
      {
        field: 'lastEditedAt',
        headerName: 'Última Edición',
        width: 160,
        valueFormatter: (value: string) => formatDateTime(value),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        width: 180,
        getActions: (params) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="Ver">
                <VisibilityIcon />
              </Tooltip>
            }
            label="Ver"
            onClick={() => {
              setActive(params.row);
              setDialog('view');
            }}
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title="Editar">
                <EditIcon />
              </Tooltip>
            }
            label="Editar"
            onClick={() => {
              setActive(params.row);
              setDialog('edit');
            }}
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title="Screening OFAC">
                <FactCheckIcon color="secondary" />
              </Tooltip>
            }
            label="Screening"
            onClick={() => {
              setActive(params.row);
              setDialog('screening');
            }}
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title="Eliminar">
                <DeleteIcon color="error" />
              </Tooltip>
            }
            label="Eliminar"
            onClick={() => {
              setActive(params.row);
              setDialog('delete');
            }}
          />,
        ],
      },
    ],
    [],
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Inventario de Proveedores
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setActive(null);
            setDialog('create');
          }}
        >
          Nuevo Proveedor
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Buscar proveedor (cualquier campo: nombre, email, país, dirección, etc.)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          fullWidth
          size="small"
          placeholder="Ej: Cuba, Andina, 20123456789, contacto@empresa.com..."
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model.length ? model : [{ field: 'lastEditedAt', sort: 'desc' }])}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          sx={{ minHeight: 400 }}
        />
      </Paper>

      <SupplierFormDialog
        open={dialog === 'create' || dialog === 'edit'}
        supplier={dialog === 'edit' ? active : null}
        countries={countries}
        onClose={closeDialog}
        onSaved={handleSaved}
      />
      <SupplierViewDialog open={dialog === 'view'} supplier={active} onClose={closeDialog} />
      <ConfirmDeleteDialog
        open={dialog === 'delete'}
        supplier={active}
        onClose={closeDialog}
        onDeleted={handleDeleted}
      />
      <ScreeningDialog open={dialog === 'screening'} supplier={active} onClose={closeDialog} />

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}