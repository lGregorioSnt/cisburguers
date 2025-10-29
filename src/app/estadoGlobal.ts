// ARQUIVO NOVO: /src/app/simulacao/globalState.ts
// Este é o nosso "servidor" falso.
// Ambas as páginas vão importar este mesmo objeto.

// Dados que o modal do GERENTE (Carlos) espera receber
export const initialRupturaData = {
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

// O estado que será compartilhado
export const globalRupturaState = {
    isRupturaActive: false,
    rupturaData: null as any
};