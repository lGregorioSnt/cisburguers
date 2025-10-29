// ARQUIVO NOVO: /src/app/historico/page.tsx
"use client";

import React, { useState } from "react";
import Link from 'next/link';
import {
    Box, Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip, TextField, Divider
} from "@mui/material";
import { 
    Dashboard as DashboardIcon, 
    People, 
    History,
    Inventory
} from "@mui/icons-material";

// --- Constantes ---
const SECONDARY_COLOR = "#212121";
const NAV_BACKGROUND_COLOR = "#FF9800";

// --- Navbar (Componente Simulado) ---
const AppNavbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    return (
        <Box
            component="nav"
            sx={{
            width: isNavOpen ? 200 : 80,
            backgroundColor: NAV_BACKGROUND_COLOR, 
            color: SECONDARY_COLOR,
            display: "flex",
            flexDirection: "column",
            borderRight: `5px solid ${SECONDARY_COLOR}`, 
            transition: (theme) => theme.transitions.create("width", { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
            overflowX: "hidden",
            position: 'fixed',
            height: '100vh',
            zIndex: 10
            }}
            onMouseEnter={() => setIsNavOpen(true)}
            onMouseLeave={() => setIsNavOpen(false)}
        >
            <List sx={{ p: 1, mt: 8 }}>
                {[
                { text: "Gerência", href: "/dashboard-geral", icon: <DashboardIcon /> },
                            { text: "Funcionários", href: "../funcativos", icon: <People /> },
                            { text: "Histórico", href: "../hist", icon: <History /> }, // <- LINK ATUALIZADO
                            { text: "Estoque", href: "../estoque", icon: <Inventory /> }   // <- LINK NOVO
                ].map((item) => (
                <ListItem key={item.text} disablePadding sx={{ display: "block", textDecoration: 'none', color: 'inherit' }}>
                    <ListItemButton 
                        component={Link} 
                        href={item.href}
                        sx={{ minHeight: 48, justifyContent: isNavOpen ? "initial" : "center", px: 2.5, borderRadius: "8px", mb: 1, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }}>
                    <ListItemIcon sx={{ minWidth: 0, mr: isNavOpen ? 3 : "auto", justifyContent: "center", color: SECONDARY_COLOR }}>
                        {item.icon}
                    </ListItemIcon>
                    {isNavOpen && <ListItemText primary={item.text} sx={{ opacity: isNavOpen ? 1 : 0, color: SECONDARY_COLOR }} />}
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
        </Box>
    );
};

// --- Dados Mockados do Histórico ---
const mockHistorico = [
    { id: 2049, cliente: 'Mesa 2', status: 'Entregue', data: '29/10/2025 10:15', total: 'R$ 45,50' },
    { id: 2048, cliente: 'App Delivery', status: 'Entregue', data: '29/10/2025 10:10', total: 'R$ 72,00' },
    { id: 2047, cliente: 'Balcão', status: 'Cancelado', data: '29/10/2025 10:05', total: 'R$ 18,90' },
    { id: 2046, cliente: 'Mesa 4', status: 'Entregue', data: '29/10/2025 10:02', total: 'R$ 120,00' },
    { id: 2045, cliente: 'App Delivery', status: 'Entregue', data: '29/10/2025 09:55', total: 'R$ 35,00' },
];

const getHistoryStatusColor = (status: string) => {
    if (status === "Entregue") return "success";
    if (status === "Cancelado") return "error";
    return "default";
};

// --- Componente da Página ---
export default function HistoricoPage() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppNavbar />

      <Box component="main" sx={{ flexGrow: 1, px: 4, py: 4, ml: { xs: '80px', sm: '80px' }, mt: 0 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: SECONDARY_COLOR }}>
          Histórico de Pedidos
        </Typography>

        {/* Filtros */}
        <Paper elevation={2} sx={{ p: 2, mb: 4, display: 'flex', gap: 2, borderRadius: '12px' }}>
            <TextField 
                label="Buscar por ID do Pedido" 
                variant="outlined" 
                size="small" 
                sx={{ flexGrow: 1 }}
            />
            <TextField
                label="Filtrar por Data"
                variant="outlined"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
            />
        </Paper>

        {/* Tabela de Histórico */}
        <Box component={Paper} elevation={3} sx={{ borderRadius: "12px", overflow: 'hidden' }}>
            {/* Cabeçalho */}
            <Box sx={{ display: 'flex', fontWeight: 'bold', backgroundColor: '#e0e0e0', p: 1.5 }}>
                <Box sx={{ width: '15%' }}>ID Pedido</Box>
                <Box sx={{ width: '25%' }}>Cliente</Box>
                <Box sx={{ width: '20%' }}>Status</Box>
                <Box sx={{ width: '25%' }}>Data/Hora</Box>
                <Box sx={{ width: '15%' }}>Valor Total</Box>
            </Box>
            {/* Linhas */}
            {mockHistorico.map((pedido) => (
                <Box 
                    key={pedido.id} 
                    sx={{ 
                        display: 'flex', alignItems: 'center', p: 1.5, borderTop: '1px solid #eee',
                        '&:hover': { backgroundColor: '#f9f9f9' }
                    }}
                >
                    <Box sx={{ width: '15%', fontWeight: 'bold' }}>#{pedido.id}</Box>
                    <Box sx={{ width: '25%' }}>{pedido.cliente}</Box>
                    <Box sx={{ width: '20%' }}>
                        <Chip 
                            label={pedido.status} 
                            color={getHistoryStatusColor(pedido.status)} 
                            size="small" 
                        />
                    </Box>
                    <Box sx={{ width: '25%' }}>{pedido.data}</Box>
                    <Box sx={{ width: '15%', fontWeight: 'bold' }}>{pedido.total}</Box>
                </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}