"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import {
    Box, Paper, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Divider
} from "@mui/material";
import { 
    Dashboard as DashboardIcon, 
    Warning, 
    CheckCircle, 
    SwapCalls, 
    Cancel, 
    People, 
    Timer, 
    History,
    Inventory
} from "@mui/icons-material";
import { keyframes } from '@mui/system';

// --- Importando o estado global E A INTERFACE ---
// Assumindo que a interface RupturaData foi definida e exportada em '../estadoGlobal' ou em outro arquivo.
// Estou usando o nome RupturaData que você definiu no estado global (globalState.ts)
import { globalRupturaState, RupturaData } from '../estadoGlobal';


// --- Constantes de Design ---
const PRIMARY_COLOR = "#FF9800"; 
const SECONDARY_COLOR = "#212121"; // Preto (Texto/Fundo Principal)
const DANGER_COLOR = "#D32F2F"; 
const SUCCESS_COLOR = "#388E3C";
const NAV_BACKGROUND_COLOR = "#FF9800"; 

// Corrigido para usar 'as const' para tipagem absoluta no TypeScript
const modalStyle = { position: "absolute" as const, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: '90%', sm: 700 }, bgcolor: "background.paper", borderRadius: "16px", boxShadow: 24, p: 4, outline: 'none' };

const blink = keyframes`
  0% { background-color: rgba(211, 47, 47, 0.1); }
  50% { background-color: rgba(255, 152, 0, 0.4); }
  100% { background-color: rgba(211, 47, 47, 0.1); }
`;

// Dados Mockados (Contexto Lanchonete)
const initialOrders = [
    { id: 2051, cliente: 'App Delivery', status: 'Cozinha', local: 'Chapa 1', tempo_inicio: '10:00', risco: 'baixo' },
    { id: 2052, cliente: 'Mesa 4', status: 'Montagem', local: 'Estação 2', tempo_inicio: '10:15', risco: 'baixo' },
    { id: 2053, cliente: 'Balcão', status: 'Finalização', local: 'Balcão', tempo_inicio: '09:45', risco: 'baixo' },
];

// --- SIMULAÇÃO (Removida daqui, agora é importada) ---

// --- Componentes Auxiliares ---
const KpiCard = ({ title, value, icon, color, subValue }: { title: string, value: string, icon: React.ReactNode, color: string, subValue: string }) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', borderLeft: `5px solid ${color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 250, flexGrow: 1, animation: title === 'Pedidos em Risco' && value !== '0' ? `${blink} 1s infinite` : 'none' }}>
    <Box>
      <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">{title}</Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ color }}>{value}</Typography>
      <Typography variant="caption" color="textSecondary">{subValue}</Typography>
    </Box>
    <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
  </Paper>
);

// CORRIGIDO: Tipagem e contraste do texto de detalhe
const AlertaSidebar = ({ ruptura, handleOpenActionModal }: { ruptura: RupturaData, handleOpenActionModal: (r: RupturaData | null) => void }) => (
  <Paper 
      elevation={10} 
      sx={{ 
          position: 'fixed', 
          top: 100, 
          right: 20, 
          width: 300, 
          p: 2, 
          backgroundColor: DANGER_COLOR, 
          color: 'white', // Mantém o título do alerta e ícone brancos para destaque
          borderRadius: '12px',
          zIndex: 20,
          animation: `${blink} 1.5s infinite`,
      }}
  >
      <Typography variant="h6"  fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Warning sx={{ mr: 1 }} /> ALERTA CRÍTICO
      </Typography>
      <Divider sx={{ backgroundColor: 'white', mb: 1 }} />
      {/* Detalhes do alerta agora estão em preto (SECONDARY_COLOR) para melhor contraste */}
      <Typography variant="body2" sx={{ color: SECONDARY_COLOR }}>
          **Pedido #{ruptura.pedido_id}**
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: SECONDARY_COLOR }}>
          **Falta:** {ruptura.item_nome}
      </Typography>
      <Button 
          variant="contained" 
          fullWidth 
          onClick={() => handleOpenActionModal(ruptura)}
          sx={{ mt: 1, backgroundColor: SECONDARY_COLOR, color: 'white', fontWeight: 'bold', '&:hover': { backgroundColor: '#444' } }}
      >
          TRATAR AGORA
      </Button>
  </Paper>
);


// --- Componente Principal do Dashboard do Carlos ---
export default function CarlosDashboard() {
  const [orders, setOrders] = useState(initialOrders);
  const [isNavOpen, setIsNavOpen] = useState(false);
  // CORRIGIDO: Aplicando a tipagem RupturaData
  const [rupturaAlert, setRupturaAlert] = useState<RupturaData | null>(null); 
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  // CORRIGIDO: Aplicando a tipagem RupturaData
  const [selectedRupture, setSelectedRupture] = useState<RupturaData | null>(null);

  // CORRIGIDO: Aplicando a tipagem RupturaData
  const handleOpenActionModal = (ruptura: RupturaData | null) => {
    setSelectedRupture(ruptura);
    setIsActionModalOpen(true);
    setRupturaAlert(null); 
  };

  const handleCloseActionModal = () => {
    setSelectedRupture(null);
    setIsActionModalOpen(false);
  };

  const handleResolveRupture = (action: string) => {
    // Verificação de segurança, pois selectedRupture pode ser null
    if (!selectedRupture) return; 

    setOrders(prev => prev.map(order => order.id === selectedRupture.pedido_id ? { ...order, risco: 'baixo', status: 'Reabastecendo', local: 'Ações Gerenciais' } : order));
    
    // Reseta o estado global (notifica o funcionário)
    globalRupturaState.isRupturaActive = false;
    globalRupturaState.rupturaData = null;

    setSelectedRupture(null);
    setIsActionModalOpen(false);
    
    alert(`Ação de "${action}" registrada. O problema está sendo resolvido.`);
  };


  // EFEITO: Monitora o estado global (AGORA FUNCIONA)
  useEffect(() => {
    const checkGlobalRupture = () => {
        // Lê o estado global importado
        if (globalRupturaState.isRupturaActive && globalRupturaState.rupturaData && !rupturaAlert && !isActionModalOpen) {
            
            // Garantindo que a tipagem do RupturaData está correta
            const currentRupturaData = globalRupturaState.rupturaData as RupturaData;

            setRupturaAlert(currentRupturaData);
            
            setOrders(prev => {
                if (prev.find(o => o.id === currentRupturaData.pedido_id)) {
                    return prev.map(order => order.id === currentRupturaData.pedido_id ? { ...order, risco: 'alto', status: 'Em RUPTURA' } : order);
                }
                return [{ 
                    id: currentRupturaData.pedido_id, 
                    cliente: 'App Delivery', 
                    status: 'Em RUPTURA', 
                    local: currentRupturaData.local_reportado, 
                    tempo_inicio: new Date().toLocaleTimeString().substring(0, 5), 
                    risco: 'alto' 
                }, ...prev];
            });
        }
    };
    const interval = setInterval(checkGlobalRupture, 1000);
    return () => clearInterval(interval);
  }, [rupturaAlert, isActionModalOpen]); 


  // --- RENDERIZAÇÃO ---
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Navegação Lateral */}
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
            { text: "Estoque", href: "../estoque", icon: <Inventory /> }   // <- LINK NOVO
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

      {/* Alerta Lateral (Etapa 2) */}
      {rupturaAlert && <AlertaSidebar ruptura={rupturaAlert} handleOpenActionModal={handleOpenActionModal} />}

      {/* Conteúdo Principal (Dashboard - Etapa 1) */}
      <Box component="main" sx={{ flexGrow: 1, px: 4, py: 4, ml: { xs: '80px', sm: '80px' }, mt: 0 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: SECONDARY_COLOR }}>
          Painel de Gerência - Supervisor Carlos
        </Typography>

        {/* Cards de KPI (Flexbox) */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <KpiCard title="Pedidos em Risco" value={orders.filter(o => o.risco === 'alto').length.toString()} icon={<Warning />} color={DANGER_COLOR} subValue="FALTAS DE INSUMOS ATIVAS" />
          <KpiCard title="Tempo Médio (Fila)" value="5:30 min" icon={<Timer />} color={SUCCESS_COLOR} subValue="Tempo ideal para entrega" />
          <KpiCard title="Funcionários Ativos" value="6" icon={<People />} color={PRIMARY_COLOR} subValue="Cozinha e Montagem" />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" color={SECONDARY_COLOR}>Fila de Produção (em tempo real)</Typography>
            <Button
                variant="outlined"
                component={Link}
                href="../dashboarduser" 
                sx={{ borderColor: NAV_BACKGROUND_COLOR, color: NAV_BACKGROUND_COLOR }}
            >
                Ver Estação de Montagem
            </Button>
        </Box>
        
        {/* Lista de Pedidos Ativos (Simulação de Tabela usando Box/Paper) */}
        <Box component={Paper} elevation={3} sx={{ borderRadius: "12px", mb: 4, overflow: 'hidden' }}>
            {/* Cabeçalho */}
            <Box sx={{ display: 'flex', fontWeight: 'bold', backgroundColor: '#e0e0e0', p: 1.5 }}>
                <Box sx={{ width: '10%' }}>ID</Box>
                <Box sx={{ width: '25%' }}>Cliente</Box>
                <Box sx={{ width: '25%' }}>Status</Box>
                <Box sx={{ width: '20%' }}>Estação</Box>
                <Box sx={{ width: '20%' }}>Ação</Box>
            </Box>
            {/* Linhas de Pedidos */}
            {orders.map((order) => (
                <Box 
                    key={order.id} 
                    sx={{ 
                        display: 'flex', alignItems: 'center', p: 1.5, borderTop: '1px solid #eee', 
                        cursor: order.risco === 'alto' ? 'pointer' : 'default', 
                        backgroundColor: order.risco === 'alto' ? 'rgba(211, 47, 47, 0.1)' : 'inherit',
                        animation: order.risco === 'alto' ? `${blink} 2s infinite` : 'none',
                        '&:hover': { backgroundColor: order.risco === 'alto' ? 'rgba(255, 152, 0, 0.2)' : '#f9f9f9' }
                    }}
                    onClick={() => order.risco === 'alto' && globalRupturaState.rupturaData && handleOpenActionModal(globalRupturaState.rupturaData)} // Puxa os dados do global
                >
                    <Box sx={{ width: '10%', fontWeight: 'bold', color: order.risco === 'alto' ? DANGER_COLOR : SECONDARY_COLOR }}>{order.id}</Box>
                    <Box sx={{ width: '25%' }}>{order.cliente}</Box>
                    <Box sx={{ width: '25%' }}>{order.status}</Box>
                    <Box sx={{ width: '20%' }}>{order.local}</Box>
                    <Box sx={{ width: '20%' }}>
                        {order.risco === 'alto' ? 
                            <Button size="small" variant="contained" sx={{ backgroundColor: PRIMARY_COLOR }} onClick={(e) => { e.stopPropagation(); globalRupturaState.rupturaData && handleOpenActionModal(globalRupturaState.rupturaData); }}>
                                TRATAR
                            </Button> 
                            : 'OK'
                        }
                    </Box>
                </Box>
            ))}
        </Box>
      </Box>

      {/* MODAL: Painel de Ação (Etapa 3) */}
      <Modal open={isActionModalOpen} onClose={handleCloseActionModal} aria-labelledby="modal-acao-ruptura-title">
        <Box sx={modalStyle}>
          {selectedRupture && (
            <>
              <Typography id="modal-acao-ruptura-title" variant="h5" fontWeight="bold" color={DANGER_COLOR} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 1 }} /> TRATATIVA CRÍTICA - PEDIDO #{selectedRupture.pedido_id}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
                Ruptura reportada por **{selectedRupture.funcionario}** às {selectedRupture.horario}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ minWidth: 200, flex: 1 }}>
                    <Typography variant="body1" fontWeight="bold" color={SECONDARY_COLOR}>Insumo Crítico:</Typography>
                    <Typography variant="h6" color={DANGER_COLOR}>{selectedRupture.item_nome}</Typography>
                    <Typography variant="body2" color="textSecondary">SKU: {selectedRupture.item_sku} | Qtd: {selectedRupture.quantidade}</Typography>
                </Box>
                <Box sx={{ minWidth: 200, flex: 1 }}>
                    <Typography variant="body1" fontWeight="bold" color={SECONDARY_COLOR}>Local e Contexto:</Typography>
                    <Typography variant="body2">Estação Reportada: **{selectedRupture.local_reportado}**</Typography>
                    <Typography variant="body2" color={PRIMARY_COLOR} fontWeight="bold" sx={{ mt: 1 }}>
                        <SwapCalls sx={{ fontSize: 16, mr: 0.5 }} /> Plano de Backup: {selectedRupture.alternativa_estoque}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                        Histórico: {selectedRupture.historico_item}
                    </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: 3, mb: 3 }} />
              <Typography variant="h6" fontWeight="bold" color={SECONDARY_COLOR} sx={{ mb: 2 }}>
                Ações Imediatas:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Button 
                    variant="contained" 
                    onClick={() => handleResolveRupture('Substituição Rápida/Reabastecimento')}
                    startIcon={<CheckCircle />}
                    sx={{ backgroundColor: SUCCESS_COLOR, '&:hover': { backgroundColor: '#307D32' }, color: 'white', flexGrow: 1 }}
                >
                    Substituir/Reabastecer Agora
                </Button>
                <Button 
                    variant="contained" 
                    onClick={() => handleResolveRupture('Ajuste de Estoque (Cancelamento)')}
                    startIcon={<Cancel />}
                    sx={{ backgroundColor: DANGER_COLOR, '&:hover': { backgroundColor: '#A51C30' }, flexGrow: 1 }}
                >
                    Cancelar Item / Notificar Vendas
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
