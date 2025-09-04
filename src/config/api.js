// Configuração da API
export const API_CONFIG = {
    BASE_URL: 'https://backend-casa-iot.onrender.com/api',
    ENDPOINTS: {
        // Autenticação
        LOGIN: '/auth/login/',
        
        // Casas
        CASAS: '/casas/',
        
        // Cômodos
        COMODOS: '/comodos/',
        
        // Dispositivos
        DISPOSITIVOS: '/dispositivos/',
        DISPOSITIVO_TOGGLE: (id) => `/dispositivos/${id}/toggle/`,
        
        // Tipos de Dispositivos
        TIPOS_DISPOSITIVO: '/tipos-dispositivo/',
        
        // Cenas
        CENAS: '/cenas/',
        CENA_EXECUTE: (id) => `/cenas/${id}/executar/`,
        
        // Ações de Cena
        ACOES_CENA: '/acoes-cena/',
        
        // Logs
        LOGS: '/logs/',
    }
};

// Função para fazer requests autenticados
export const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` }),
        },
    };
    
    const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};

// Função para construir URLs com query parameters
export const buildUrl = (baseUrl, params = {}) => {
    const url = new URL(baseUrl, window.location.origin);
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.append(key, params[key]);
        }
    });
    return url.toString();
};
