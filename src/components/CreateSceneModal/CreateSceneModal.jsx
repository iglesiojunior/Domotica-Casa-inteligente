import { useState, useEffect } from 'react';
import './CreateSceneModal.css';
import { IoAddOutline, IoTrashOutline, IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";
import { API_CONFIG, apiRequest } from '../../config/api';

function CreateSceneModal({ isOpen, onClose, onSceneCreated, casaId, editingScene = null, dispositivos = [] }) {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        ativa: true,
        favorita: false
    });
    const [acoes, setAcoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingScene) {
            setFormData({
                nome: editingScene.nome || '',
                descricao: editingScene.descricao || '',
                ativa: editingScene.ativa !== undefined ? editingScene.ativa : true,
                favorita: editingScene.favorita || false
            });
            setAcoes(editingScene.acoes || []);
        } else {
            setFormData({
                nome: '',
                descricao: '',
                ativa: true,
                favorita: false
            });
            setAcoes([]);
        }
        setError(null);
    }, [editingScene, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addAcao = () => {
        const newAcao = {
            id: Date.now(),
            dispositivo: '',
            estado_desejado: true,
            intervalo_tempo: 0,
            ordem: acoes.length + 1
        };
        setAcoes([...acoes, newAcao]);
    };

    const removeAcao = (id) => {
        const newAcoes = acoes.filter(acao => acao.id !== id);
        // Reordenar
        const reorderedAcoes = newAcoes.map((acao, index) => ({
            ...acao,
            ordem: index + 1
        }));
        setAcoes(reorderedAcoes);
    };

    const updateAcao = (id, field, value) => {
        setAcoes(acoes.map(acao => 
            acao.id === id ? { ...acao, [field]: value } : acao
        ));
    };

    const moveAcao = (id, direction) => {
        const index = acoes.findIndex(acao => acao.id === id);
        if (
            (direction === 'up' && index > 0) ||
            (direction === 'down' && index < acoes.length - 1)
        ) {
            const newAcoes = [...acoes];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newAcoes[index], newAcoes[targetIndex]] = [newAcoes[targetIndex], newAcoes[index]];
            
            // Reordenar
            const reorderedAcoes = newAcoes.map((acao, idx) => ({
                ...acao,
                ordem: idx + 1
            }));
            setAcoes(reorderedAcoes);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nome.trim()) {
            setError('Nome da cena é obrigatório');
            return;
        }

        if (acoes.length === 0) {
            setError('Adicione pelo menos uma ação à cena');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const sceneData = {
                nome: formData.nome.trim(),
                descricao: formData.descricao.trim(),
                ativa: formData.ativa,
                favorita: formData.favorita,
                casa: casaId
            };

            const url = editingScene 
                ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CENAS}${editingScene.id}/`
                : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CENAS}`;

            const method = editingScene ? 'PUT' : 'POST';

            const newScene = await apiRequest(url, {
                method,
                body: JSON.stringify(sceneData)
            });

            // Criar ações da cena
            for (const acao of acoes) {
                const acaoData = {
                    cena: newScene.id,
                    dispositivo: acao.dispositivo,
                    estado_desejado: acao.estado_desejado,
                    intervalo_tempo: parseFloat(acao.intervalo_tempo) || 0,
                    ordem: acao.ordem
                };

                await apiRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACOES_CENA}`, {
                    method: 'POST',
                    body: JSON.stringify(acaoData)
                });
            }

            onSceneCreated(newScene);
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ nome: '', descricao: '', ativa: true, favorita: false });
        setAcoes([]);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <div className="modal-header">
                    <h2>{editingScene ? 'Editar Cena' : 'Criar Nova Cena'}</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nome">Nome da Cena:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required
                                placeholder="Ex: Cena Noturna, Manhã"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descricao">Descrição:</label>
                            <input
                                type="text"
                                id="descricao"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleInputChange}
                                placeholder="Descrição da cena"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="ativa"
                                    checked={formData.ativa}
                                    onChange={handleInputChange}
                                />
                                Cena Ativa
                            </label>
                        </div>

                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="favorita"
                                    checked={formData.favorita}
                                    onChange={handleInputChange}
                                />
                                Cena Favorita
                            </label>
                        </div>
                    </div>

                    <div className="acoes-section">
                        <div className="acoes-header">
                            <h3>Ações da Cena</h3>
                            <button type="button" className="add-acao-button" onClick={addAcao}>
                                <IoAddOutline />
                                Adicionar Ação
                            </button>
                        </div>

                        {acoes.length === 0 ? (
                            <div className="no-acoes">
                                <p>Nenhuma ação adicionada. Clique em "Adicionar Ação" para começar.</p>
                            </div>
                        ) : (
                            <div className="acoes-list">
                                {acoes.map((acao, index) => (
                                    <div key={acao.id} className="acao-item">
                                        <div className="acao-order">
                                            <span className="order-number">{acao.ordem}</span>
                                            <div className="order-controls">
                                                <button 
                                                    type="button" 
                                                    onClick={() => moveAcao(acao.id, 'up')}
                                                    disabled={index === 0}
                                                    title="Mover para cima"
                                                >
                                                    <IoArrowUpOutline />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => moveAcao(acao.id, 'down')}
                                                    disabled={index === acoes.length - 1}
                                                    title="Mover para baixo"
                                                >
                                                    <IoArrowDownOutline />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="acao-content">
                                            <div className="form-group">
                                                <label>Dispositivo:</label>
                                                <select
                                                    value={acao.dispositivo}
                                                    onChange={(e) => updateAcao(acao.id, 'dispositivo', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Selecione um dispositivo</option>
                                                    {dispositivos.map(dispositivo => (
                                                        <option key={dispositivo.id} value={dispositivo.id}>
                                                            {dispositivo.nome} ({dispositivo.comodo_nome})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Estado:</label>
                                                <select
                                                    value={acao.estado_desejado}
                                                    onChange={(e) => updateAcao(acao.id, 'estado_desejado', e.target.value === 'true')}
                                                >
                                                    <option value={true}>Ligar</option>
                                                    <option value={false}>Desligar</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Intervalo (segundos):</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    value={acao.intervalo_tempo}
                                                    onChange={(e) => updateAcao(acao.id, 'intervalo_tempo', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="button" 
                                            className="remove-acao-button"
                                            onClick={() => removeAcao(acao.id)}
                                            title="Remover ação"
                                        >
                                            <IoTrashOutline />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" onClick={handleClose} className="cancel-button">
                            Cancelar
                        </button>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? (editingScene ? 'Salvando...' : 'Criando...') : (editingScene ? 'Salvar' : 'Criar Cena')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSceneModal;
