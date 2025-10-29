"use client";

import React, { useState, useEffect } from 'react';
// Removido Link de 'next/link' devido a erro de compilação
import { 
    Box, Paper, Typography, Button, TextField, Snackbar, Alert, Modal, 
    // Removido Divider, pois está importado mas não usado
} from '@mui/material';
import { Warning, Fastfood, Timer, Kitchen, Handshake } from '@mui/icons-material';

// --- DEFINIÇÕES DE ESTADO GLOBAL E TIPAGEM (MOVIMENTADAS PARA CÁ) ---

// Interface dos dados de Ruptura (necessária para tipagem)
interface RupturaData {
    pedido_id: number;
    item_sku: string;
    item_nome: string;
    quantidade: number;
    local_reportado: string;
    funcionario: string;
    horario: string;
    alternativa_estoque: string;
    historico_item: string;
}

// Dados iniciais (Base para o payload de alerta)
export const initialRupturaData: RupturaData = {
    pedido_id: 2054,
    item_sku: 'CARNE-P-180',
    item_nome: 'Blend de Carne 180g',
    quantidade: 1,
    local_reportado: 'Estação de Montagem 2',
    funcionario: 'Marcos A.',
    horario: new Date().toLocaleTimeString('pt-BR'),
    alternativa_estoque: 'Verificar Geladeira 3 ou usar blend 120g.',
    historico_item: 'Falta recorrente nos últimos 2 dias.',
};

// Objeto globalRupturaState simulado para este arquivo
export const globalRupturaState: {
    isRupturaActive: boolean;
    rupturaData: RupturaData | null;
} = {
    isRupturaActive: false,
    rupturaData: null,
};
// --- FIM DAS DEFINIÇÕES DE ESTADO GLOBAL ---

// --- Constantes de Design ---
const PRIMARY_COLOR = "#FF9800"; // Laranja (Ação)
const DANGER_COLOR = "#D32F2F"; // Vermelho (Alerta)
const SUCCESS_COLOR = "#388E3C"; // Verde (Meta)
const TEXT_COLOR_PRIMARY = "#212121"; // Preto para textos (Variável Renomeada)

// CORRIGIDO: de as "absolute" para as const para resolver o erro de tipagem.
const modalStyle = { position: "absolute" as const, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: '90%', sm: 500 }, bgcolor: "background.paper", borderRadius: "16px", boxShadow: 24, p: 4, outline: 'none' };

// Dados Mockados para o Funcionário
const funcionarioTasks = [
    { id: 2054, cliente: 'App Delivery', itens: 1, status: 'Em Andamento', produto: 'X-Burger Especial' },
    { id: 2055, cliente: 'Mesa 5', itens: 3, status: 'Próximo', produto: '3 Batatas Grandes' },
    { id: 2056, cliente: 'Balcão', itens: 2, status: 'Pendente', produto: 'Sanduíche Natural' },
];


// --- Componentes Auxiliares ---
const KpiCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', borderLeft: `5px solid ${color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200, flexGrow: 1, height: 120 }}>
      <Box>
        <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">{title}</Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ color }}>{value}</Typography>
      </Box>
      <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
    </Paper>
  );

// --- Componente Principal ---
export default function FuncionarioDashboard() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        pedido: '2054', 
        item: 'Blend de Carne 180g',
        local: 'Estação de Montagem 2'
    });
    // Tipagem explícita para o Snackbar
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [isLoading, setIsLoading] = useState(false);
    const [isRupturaActiveGlobally, setIsRupturaActiveGlobally] = useState(globalRupturaState.isRupturaActive);

    // EFEITO: Monitora o estado global
    useEffect(() => {
        const checkGlobalState = () => {
            setIsRupturaActiveGlobally(globalRupturaState.isRupturaActive);
        };
        const interval = setInterval(checkGlobalState, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReportRupture = () => {
        if (isRupturaActiveGlobally) {
            setNotification({ open: true, message: 'Alerta JÁ ESTÁ ATIVO! Aguarde a tratativa.', severity: 'error' });
            return;
        }
        setIsLoading(true);

        // Prepara os dados para enviar ao estado global (usando a interface RupturaData)
        const payload: RupturaData = {
            ...initialRupturaData, // Pega os dados base do arquivo global
            pedido_id: parseInt(formData.pedido),
            item_nome: formData.item,
            local_reportado: formData.local,
            horario: new Date().toLocaleTimeString('pt-BR')
        };
        
        // ATUALIZA O ESTADO GLOBAL (o gerente vai ver isso)
        globalRupturaState.isRupturaActive = true;
        globalRupturaState.rupturaData = payload;

        setTimeout(() => {
            setIsLoading(false);
            setIsReportModalOpen(false);
            setNotification({ open: true, message: `Falta de ${formData.item} reportada IMEDIATAMENTE!`, severity: 'success' });
            setIsRupturaActiveGlobally(true); 
        }, 500);
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 4 }}>
            
            {/* Botão de Alerta Fixo (Sempre visível) */}
            <Button
                onClick={() => setIsReportModalOpen(true)}
                variant="contained"
                startIcon={<Warning />}
                disabled={isRupturaActiveGlobally}
                sx={{ 
                    position: 'fixed', bottom: 20, right: 20, zIndex: 1000, 
                    // Fundo preto c/ texto branco quando ativo
                    backgroundColor: isRupturaActiveGlobally ? TEXT_COLOR_PRIMARY : DANGER_COLOR, 
                    color: 'white', fontWeight: 'bold', p: 2, borderRadius: '12px',
                    '&:hover': { backgroundColor: isRupturaActiveGlobally ? TEXT_COLOR_PRIMARY : '#A51C30' }
                }}
            >
                {isRupturaActiveGlobally ? 'AGUARDANDO TRATATIVA' : 'FALTA DE INSUMO CRÍTICO'}
            </Button>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color={TEXT_COLOR_PRIMARY}>
                    Estação de Montagem - Marcos A.
                </Typography>
                 <Button 
                    // Removido component={Link} e import Link, para evitar erro de compilação
                    component="a"
                    href="../dashboard-geral"
                    variant="outlined"
                    startIcon={<Handshake />}
                    sx={{ color: TEXT_COLOR_PRIMARY, borderColor: TEXT_COLOR_PRIMARY }}
                >
                    Acesso Gerência
                </Button>
            </Box>

            {/* Cards de Desempenho (Flexbox) */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                <KpiCard title="Pedidos na Fila" value={funcionarioTasks.length.toString()} icon={<Fastfood />} color={PRIMARY_COLOR} />
                <KpiCard title="Próxima Ação" value={funcionarioTasks[0].produto} icon={<Kitchen />} color={SUCCESS_COLOR} />
                <KpiCard title="Ticket Médio (Tempo)" value="1:45 min" icon={<Timer />} color={TEXT_COLOR_PRIMARY} /> 
            </Box>

            <Typography variant="h5" fontWeight="bold" color={TEXT_COLOR_PRIMARY} sx={{ mb: 2 }}>
                Fila de Pedidos para Montagem
            </Typography>

            {/* Lista de Tarefas (Simulação de Tabela usando Box/Paper) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Cabeçalho */}
                <Box  color={TEXT_COLOR_PRIMARY} sx={{ display: 'flex', fontWeight: 'bold', backgroundColor: '#e0e0e0', p: 1.5, borderRadius: '8px 8px 0 0' }}>
                    <Box sx={{ width: '15%', minWidth: 60 }}>ID</Box>
                    <Box sx={{ width: '35%' }}>Cliente</Box>
                    <Box sx={{ width: '20%' }}>Status</Box>
                    <Box sx={{ width: '30%' }}>Ação</Box>
                </Box>
                {/* Linhas de Pedidos */}
                {funcionarioTasks.map((task) => (
                    <Paper key={task.id} elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderBottom: '1px solid #ddd', '&:hover': { backgroundColor: '#fffbe6' } }}>
                        <Box sx={{ width: '15%', minWidth: 60, fontWeight: 'bold' }}>{task.id}</Box>
                        <Box sx={{ width: '35%' }}>{task.cliente}</Box>
                        <Box sx={{ width: '20%', color: task.status === 'Em Andamento' ? SUCCESS_COLOR : TEXT_COLOR_PRIMARY }}>
                            {task.status}
                        </Box>
                        <Box sx={{ width: '30%' }}>
                            <Button size="small" variant="contained" sx={{ backgroundColor: PRIMARY_COLOR, '&:hover': { backgroundColor: '#FFA726' } }}>
                                Concluir Item
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* MODAL DE REPORTAR RUPTURA */}
            <Modal open={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} aria-labelledby="modal-reportar-ruptura">
                <Box sx={modalStyle}>
                    <Typography id="modal-reportar-ruptura" variant="h5" fontWeight="bold" color={DANGER_COLOR} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Warning sx={{ mr: 1 }} /> REPORTAR RUPTURA DE INSUMO
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                        Dispare este alerta **imediatamente** para notificar o Supervisor Carlos e evitar o atraso do pedido.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField label="ID do Pedido Afetado" name="pedido" value={formData.pedido} onChange={handleFormChange} fullWidth required />
                        <TextField 
                            label="Insumo Faltante (Ex: Pão Brioche, Cheddar)" 
                            name="item" 
                            value={formData.item} 
                            onChange={handleFormChange} 
                            fullWidth 
                            required 
                        />
                        <TextField 
                            label="Local (Ex: Geladeira Principal, Chapa)" 
                            name="local" 
                            value={formData.local} 
                            onChange={handleFormChange} 
                            fullWidth 
                            required 
                        />
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleReportRupture}
                        disabled={isLoading || isRupturaActiveGlobally}
                        fullWidth
                        startIcon={<Warning />}
                        sx={{ mt: 4, p: 1.5, backgroundColor: DANGER_COLOR, '&:hover': { backgroundColor: '#A51C30' }, fontWeight: 'bold', fontSize: '1rem' }}
                    >
                        {isLoading ? 'ENVIANDO...' : 'CONFIRMAR RUPTURA'}
                    </Button>
                </Box>
            </Modal>

            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
