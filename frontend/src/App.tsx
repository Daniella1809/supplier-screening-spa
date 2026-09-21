import { AppBar, Toolbar, Typography, Container, Box, Chip } from '@mui/material';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import { Routes, Route, Navigate } from 'react-router-dom';
import SuppliersPage from './pages/SuppliersPage';

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <GppMaybeIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Debida Diligencia de Proveedores
          </Typography>
          <Chip label="Screening OFAC" color="secondary" size="small" variant="filled" />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<SuppliersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>

      <Box component="footer" sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="caption">
          Supplier Screening App · Cruce con listas de alto riesgo
        </Typography>
      </Box>
    </Box>
  );
}
