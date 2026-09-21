import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { ScreeningResponse, ScreeningSource, Supplier } from '../api/types';
import { sourcesApi, suppliersApi } from '../api/client';
import { extractApiErrors } from '../utils/format';

interface Props {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
}

const MAX_SOURCES = 3;
const COLUMNS = ['Name', 'Address', 'Type', 'Program(s)', 'List', 'Score'];

export default function ScreeningDialog({ open, supplier, onClose }: Props) {
  const [sources, setSources] = useState<ScreeningSource[]>([]);
  const [selected, setSelected] = useState<string[]>(['ofac']);
  const [result, setResult] = useState<ScreeningResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    sourcesApi
      .list()
      .then((s) => {
        setSources(s);
        const available = s.filter((x) => x.available).map((x) => x.key);
        setSelected(available.length > 0 ? [available[0]] : []);
      })
      .catch(() => setSources([]));
  }, [open]);

  const runScreening = useCallback(
    async (keys: string[]) => {
      if (!supplier || keys.length === 0) return;
      setLoading(true);
      setError(null);
      try {
        const res = await suppliersApi.screening(supplier.id, keys);
        setResult(res);
      } catch (err) {
        setError(extractApiErrors(err).join(' '));
        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [supplier],
  );

  useEffect(() => {
    if (open && supplier && selected.length > 0) {
      runScreening(selected);
    }
  }, [open, supplier, selected]);

  const toggleSource = (key: string, available: boolean) => {
    if (!available) return;
    setSelected((prev) => {
      if (prev.includes(key)) {
        // No permitir quedarse sin ninguna fuente (mínimo 1).
        return prev.length === 1 ? prev : prev.filter((k) => k !== key);
      }
      if (prev.length >= MAX_SOURCES) return prev; // máximo 3
      return [...prev, key];
    });
  };

  const handleClose = () => {
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Screening — {supplier?.legalName}
        <Typography variant="body2" color="text.secondary">
          Cruce con listas de alto riesgo. Se busca por la razón social del proveedor.
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Fuentes (mínimo 1, máximo {MAX_SOURCES})
          </Typography>
          <FormGroup row>
            {sources.map((s) => (
              <FormControlLabel
                key={s.key}
                control={
                  <Checkbox
                    checked={selected.includes(s.key)}
                    disabled={!s.available || (!selected.includes(s.key) && selected.length >= MAX_SOURCES)}
                    onChange={() => toggleSource(s.key, s.available)}
                  />
                }
                label={
                  <Box component="span">
                    {s.displayName}{' '}
                    {!s.available && <Chip label="No disponible" size="small" sx={{ ml: 0.5 }} />}
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && result && (
          <Box>
            {result.sources.map((src) => (
              <Accordion key={src.source} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ flexGrow: 1 }}>{src.sourceDisplayName}</Typography>
                  {src.error ? (
                    <Chip label="Sin resultados" color="default" size="small" />
                  ) : (
                    <Chip
                      label={`${src.hits} coincidencia(s)`}
                      color={src.hits > 0 ? 'warning' : 'success'}
                      size="small"
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  {src.error ? (
                    <Alert severity="info">{src.error}</Alert>
                  ) : src.results.length === 0 ? (
                    <Alert severity="success">
                      No se encontraron coincidencias para "{src.query}" en esta fuente.
                    </Alert>
                  ) : (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {COLUMNS.map((c) => (
                              <TableCell key={c} sx={{ fontWeight: 600 }}>
                                {c}
                              </TableCell>
                            ))}
                            <TableCell sx={{ fontWeight: 600 }}>Detalle</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {src.results.map((hit, idx) => (
                            <TableRow key={idx} hover>
                              {COLUMNS.map((c) => (
                                <TableCell key={c}>{hit.attributes[c] ?? '—'}</TableCell>
                              ))}
                              <TableCell>
                                {hit.attributes['DetailsUrl'] ? (
                                  <Link
                                    href={hit.attributes['DetailsUrl']}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Ver
                                  </Link>
                                ) : (
                                  '—'
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => runScreening(selected)} disabled={loading || selected.length === 0}>
          Volver a buscar
        </Button>
        <Button onClick={handleClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
