// src/services/api.ts

// O Vite injeta a variável correta dependendo do modo (dev ou prod)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Função auxiliar para fazer fetch já com a URL base
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    // Garante que o endpoint comece com /
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const response = await fetch(url, options);
    
    // Tratamento genérico de erros (opcional, mas recomendado)
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Erro na requisição: ${response.status}`);
    }

    return response;
};