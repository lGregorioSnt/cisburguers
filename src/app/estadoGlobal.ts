// ARQUIVO NOVO: /src/app/simulacao/globalState.ts
// Este é o nosso "servidor" falso.
// Ambas as páginas vão importar este mesmo objeto.

// --- 1. DEFINIÇÃO DA INTERFACE (Nova adição) ---
export interface RupturaData {
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

// --- 2. DADOS INICIAIS (Tipados) ---
// Dados que o modal do GERENTE (Carlos) espera receber
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

// --- 3. ESTADO GLOBAL (Tipado) ---
// O estado que será compartilhado
export const globalRupturaState: {
    isRupturaActive: boolean;
    rupturaData: RupturaData | null; // Usando a interface, removendo 'any'
} = {
    isRupturaActive: false,
    rupturaData: null
};