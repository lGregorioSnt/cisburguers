// ARQUIVO CORRIGIDO: /src/app/estoque/page.tsx
"use client";

import React, { useState } from "react";
import Link from 'next/link';
import {
    Box, Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip, TextField, Divider, Button
} from "@mui/material";
import { 
    Dashboard as DashboardIcon, 
    People, 
    History,
    Inventory,
    Warning,
    CheckCircle,
    Error,
    Add
} from "@mui/icons-material";

// --- Constantes ---
const PRIMARY_COLOR = "#FF9800";
const SECONDARY_COLOR = "#212121";
const DANGER_COLOR = "#D32F2F";
const SUCCESS_COLOR = "#388E3C";
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

// --- Dados Mockados do Estoque ---
const mockEstoque = [
    { id: 'CARNE-P-180', nome: 'Blend de Carne 180g', qtd: 0, status: 'Crítico', nivelMin: 20 },
    { id: 'PAO-BRIOCHE', nome: 'Pão Brioche', qtd: 45, status: 'Alerta', nivelMin: 40 },
    { id: 'QUEIJO-CHED', nome: 'Queijo Cheddar (Fatias)', qtd: 150, status: 'OK', nivelMin: 50 },
    { id: 'BACON-KG', nome: 'Bacon (Kg)', qtd: 10, status: 'OK', nivelMin: 5 },
    { id: 'ALFACE-UND', nome: 'Alface Americana (Und)', qtd: 8, status: 'Alerta', nivelMin: 10 },
    { id: 'BATATA-CONG-KG', nome: 'Batata Congelada (Kg)', qtd: 30, status: 'OK', nivelMin: 20 },
    { id: 'REFR-LATA-350', nome: 'Refrigerante Lata 350ml', qtd: 80, status: 'OK', nivelMin: 50 },
];

// ############# CORREÇÃO AQUI #############
// A função de status agora retorna 'icon: undefined' no caso padrão,
// em vez de 'icon: null'.
const getEstoqueStatus = (status: string) => {
    if (status === "OK") return { color: SUCCESS_COLOR, icon: <CheckCircle sx={{ fontSize: 18 }} /> };
    if (status === "Alerta") return { color: PRIMARY_COLOR, icon: <Warning sx={{ fontSize: 18 }} /> };
    if (status === "Crítico") return { color: DANGER_COLOR, icon: <Error sx={{ fontSize: 18 }} /> };
    return { color: 'default', icon: undefined }; // <-- CORRIGIDO DE null PARA undefined
};
// #########################################


// --- Componente da Página ---
export default function EstoquePage() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppNavbar />

      <Box component="main" sx={{ flexGrow: 1, px: 4, py: 4, ml: { xs: '80px', sm: '80px' }, mt: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: SECONDARY_COLOR }}>
              Gestão de Estoque
            </Typography>
            <Button variant="contained" startIcon={<Add />} sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: '#E65100' }}}>
                Registrar Entrada
            </Button>
        </Box>

        {/* Filtros */}
        <Paper elevation={2} sx={{ p: 2, mb: 4, display: 'flex', gap: 2, borderRadius: '12px' }}>
            <TextField 
                label="Buscar por Nome ou SKU" 
                variant="outlined" 
                size="small" 
                sx={{ flexGrow: 1 }}
            />
            <TextField
                select
                label="Filtrar por Status"
                defaultValue="todos"
                size="small"
                SelectProps={{ native: true }}
                sx={{ minWidth: 200 }}
            >
                <option value="todos">Todos os Status</option>
                <option value="critico">Crítico</option>
                <option value="alerta">Alerta</option>
                <option value="ok">OK</option>
            </TextField>
        </Paper>

        {/* Tabela de Estoque */}
        <Box component={Paper} elevation={3} sx={{ borderRadius: "12px", overflow: 'hidden' }}>
            {/* Cabeçalho */}
            <Box sx={{ display: 'flex', fontWeight: 'bold', backgroundColor: '#e0e0e0', p: 1.5 }}>
                <Box sx={{ width: '25%' }}>SKU</Box>
                <Box sx={{ width: '35%' }}>Item</Box>
                <Box sx={{ width: '15%' }}>Status</Box>
                <Box sx={{ width: '10%' }}>Qtd Atual</Box>
                <Box sx={{ width: '15%' }}>Nível Mínimo</Box>
            </Box>
            {/* Linhas */}
            {mockEstoque.map((item) => {
                const statusInfo = getEstoqueStatus(item.status);
                const isProblem = item.status === 'Crítico' || item.status === 'Alerta';
                
                return (
                    <Box 
                        key={item.id} 
                        sx={{ 
                            display: 'flex', alignItems: 'center', p: 1.5, borderTop: '1px solid #eee',
                            backgroundColor: item.status === 'Crítico' ? 'rgba(211, 47, 47, 0.1)' : 'inherit',
                            '&:hover': { backgroundColor: '#f9f9f9' }
                        }}
                    >
                        <Box sx={{ width: '25%', fontWeight: 500, color: 'text.secondary' }}>{item.id}</Box>
                        <Box sx={{ width: '35%', fontWeight: 'bold' }}>{item.nome}</Box>
                        <Box sx={{ width: '15%' }}>
                            <Chip 
                                icon={statusInfo.icon} // Esta linha agora recebe 'undefined' em vez de 'null'
                                label={item.status}
                                variant="outlined"
                                size="small"
                                sx={{ color: statusInfo.color, borderColor: statusInfo.color, fontWeight: 500 }}
                            />
                        </Box>
                        <Box sx={{ width: '10%', fontWeight: 'bold', color: isProblem ? DANGER_COLOR : 'text.primary' }}>
                            {item.qtd}
                        </Box>
                        <Box sx={{ width: '15%', color: 'text.secondary' }}>{item.nivelMin}</Box>
                    </Box>
                )
            })}
        </Box>
      </Box>
    </Box>
  );
}