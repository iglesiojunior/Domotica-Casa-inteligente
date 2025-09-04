# Integração com Backend - Casa IoT

## 📋 Resumo das Correções

Este documento descreve as correções realizadas para integrar corretamente o frontend com o backend Django REST Framework.

## 🔧 Principais Correções Realizadas

### 1. **Endpoints Corrigidos**

#### ❌ **Antes (Incorreto)**
```javascript
// Endpoints que não existiam no backend
/api/casas/{id}/comodos/
/api/comodos/{id}/dispositivos/
/api/dispositivos-tipos/
```

#### ✅ **Depois (Correto)**
```javascript
// Endpoints corretos baseados no backend
/api/comodos/?casa={id}           // Listar cômodos de uma casa
/api/dispositivos/?comodo={id}    // Listar dispositivos de um cômodo
/api/tipos-dispositivo/           // Listar tipos de dispositivos
/api/dispositivos/{id}/toggle/    // Toggle de dispositivo
```

### 2. **Modelo de Dados Corrigido**

#### **Dispositivo**
- ❌ **Antes**: Usava campo `ativo` para estado ligado/desligado
- ✅ **Depois**: Usa campo `estado` (boolean) para ligado/desligado
- ✅ **Adicionado**: Campo `ativo` para dispositivo ativo/inativo no sistema

#### **Cômodo**
- ❌ **Antes**: Tentava acessar campo `tipo` que não existe
- ✅ **Depois**: Usa campo `casa_nome` para exibir informações

### 3. **Configuração Centralizada da API**

Criado arquivo `src/config/api.js` com:
- URLs base centralizadas
- Função `apiRequest()` para requests autenticados
- Função `buildUrl()` para construir URLs com query parameters
- Configuração de headers padrão

## 🏗️ Estrutura do Backend

### **Modelos Principais**
```python
# Casa
- id, nome, endereco, timezone, usuario

# Comodo  
- id, nome, background_url, casa

# Dispositivo
- id, nome, estado (ligado/desligado), tipo, comodo, ativo, marca, modelo

# TipoDispositivo
- id, nome, icone, categoria
```

### **Endpoints Disponíveis**
```
GET    /api/casas/                    # Listar casas do usuário
POST   /api/casas/                    # Criar nova casa

GET    /api/comodos/?casa={id}        # Listar cômodos de uma casa
POST   /api/comodos/                  # Criar novo cômodo

GET    /api/dispositivos/?comodo={id} # Listar dispositivos de um cômodo
POST   /api/dispositivos/             # Criar novo dispositivo
POST   /api/dispositivos/{id}/toggle/ # Toggle dispositivo
DELETE /api/dispositivos/{id}/        # Remover dispositivo

GET    /api/tipos-dispositivo/        # Listar tipos de dispositivos
```

## 🔐 Autenticação

### **Sistema de Autenticação**
- Backend usa **Token Authentication** do Django REST Framework
- Token é armazenado no `localStorage` como `authToken`
- Headers automáticos: `Authorization: Token {token}`

### **Implementação**
```javascript
// Função apiRequest() adiciona automaticamente o token
const token = localStorage.getItem('authToken');
headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
}
```

## 📊 Fluxo de Dados

### **1. Listar Casas**
```
Frontend → GET /api/casas/ → Backend filtra por usuário logado
```

### **2. Listar Cômodos**
```
Frontend → GET /api/comodos/?casa={id} → Backend retorna cômodos da casa
```

### **3. Listar Dispositivos**
```
Frontend → GET /api/dispositivos/?comodo={id} → Backend retorna dispositivos do cômodo
```

### **4. Toggle Dispositivo**
```
Frontend → POST /api/dispositivos/{id}/toggle/ → Backend altera estado e registra log
```

## 🚀 Como Usar

### **1. Configuração Inicial**
```javascript
import { API_CONFIG, apiRequest, buildUrl } from '../config/api';
```

### **2. Fazer Requests**
```javascript
// GET simples
const data = await apiRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CASAS}`);

// GET com query parameters
const url = buildUrl(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMODOS}`, { casa: casaId });
const data = await apiRequest(url);

// POST
const newItem = await apiRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CASAS}`, {
    method: 'POST',
    body: JSON.stringify(formData)
});
```

### **3. Tratamento de Erros**
```javascript
try {
    const data = await apiRequest(url);
    // Sucesso
} catch (error) {
    console.error('Erro na API:', error.message);
    // Tratar erro
}
```

## 🔄 Estados dos Componentes

### **Dispositivo**
- `estado`: `true` = ligado, `false` = desligado
- `ativo`: `true` = dispositivo ativo no sistema, `false` = inativo

### **Cômodo**
- `total_dispositivos`: Contador automático de dispositivos
- `casa_nome`: Nome da casa (campo calculado)

### **Casa**
- `total_comodos`: Contador automático de cômodos
- `total_dispositivos`: Contador automático de dispositivos
- `usuario_nome`: Nome do usuário (campo calculado)

## 🎯 Próximos Passos

1. **Implementar Login**: Criar sistema de autenticação completo
2. **Gerenciamento de Estado**: Implementar Redux ou Context API
3. **Cache**: Implementar cache para melhorar performance
4. **Offline**: Implementar funcionalidade offline
5. **WebSocket**: Implementar atualizações em tempo real

## 📝 Notas Importantes

- Todos os endpoints requerem autenticação
- Backend filtra automaticamente dados por usuário logado
- Logs são criados automaticamente para mudanças de estado
- Sistema suporta paginação (results/next/previous)
- Validação de dados é feita no backend

