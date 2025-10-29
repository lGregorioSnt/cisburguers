// ARQUIVO CORRIGIDO: /src/app/funcionario/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import Link from 'next/link';
import {
    Box, Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip
} from "@mui/material"; // 'Divider' não está aqui e não será usado
import { 
    Dashboard as DashboardIcon, 
    People, 
    History,
    Inventory,
    Person,
    Restaurant,
    PauseCircle
} from "@mui/icons-material";

// --- Constantes ---
const PRIMARY_COLOR = "#FF9800";
const SECONDARY_COLOR = "#212121";
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

// --- Dados Mockados dos Funcionários ---
const mockFuncionarios = [
    { id: 1, nome: "Marcos A.", status: "Ativo", tarefa: "Montando Pedido #2054", local: "Estação 2", icon: <Restaurant /> },
    { id: 2, nome: "Ana S.", status: "Ativo", tarefa: "Preparando Pedido #2051", local: "Chapa 1", icon: <Restaurant /> },
    { id: 3, nome: "João P.", status: "Ocioso", tarefa: "Aguardando Pedidos", local: "Balcão", icon: <Person /> },
    { id: 4, nome: "Carla M.", status: "Em Pausa", tarefa: "Horário de Almoço (10 min)", local: "Refeitório", icon: <PauseCircle /> },
    { id: 5, nome: "Ricardo F.", status: "Ativo", tarefa: "Finalizando Pedido #2053", local: "Balcão", icon: <Restaurant /> },
    { id: 6, nome: "Sofia B.", status: "Ativo", tarefa: "Fritando Batatas", local: "Fritadeira", icon: <Restaurant /> },
];

const getStatusColor = (status: string): "success" | "warning" | "default" => {
    if (status === "Ativo") return "success";
    if (status === "Ocioso") return "warning";
    return "default";
};

// --- Componente da Página ---
export default function FuncionariosPage() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppNavbar />

      <Box component="main" sx={{ flexGrow: 1, px: 4, py: 4, ml: { xs: '80px', sm: '80px' }, mt: 0 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: SECONDARY_COLOR }}>
          Status da Equipe (Em Tempo Real)
        </Typography>

        {/* Grade de Funcionários */}
        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3 
        }}>
            {mockFuncionarios.map((func) => (
                <Paper key={func.id} elevation={3} sx={{ p: 3, borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">{func.nome}</Typography>
                        <Chip 
                            label={func.status} 
                            color={getStatusColor(func.status)} 
                            size="small" 
                        />
                    </Box>
                    <Typography variant="body1" sx={{ flexGrow: 1, minHeight: '40px', mb: 2 }}> {/* Adicionei mb: 2 aqui para compensar o espaço */}
                        {func.tarefa}
                    </Typography>
                    
                    {/* <Divider sx={{ my: 2 }} />  <-- LINHA REMOVIDA */}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        {func.icon}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {func.local}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
      </Box>
    </Box>
  );
}