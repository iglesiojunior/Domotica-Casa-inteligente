import { useState, useEffect } from 'react';
import './CreateRoomModal.css';
import { API_CONFIG, apiRequest } from '../../config/api';

function CreateRoomModal({ isOpen, onClose, onRoomCreated, casaId, editingRoom = null }) {
    const [formData, setFormData] = useState({
        nome: '',
        background_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingRoom) {
            setFormData({
                nome: editingRoom.nome || '',
                background_url: editingRoom.background_url || ''
            });
        } else {
            setFormData({
                nome: '',
                background_url: ''
            });
        }
        setError(null);
    }, [editingRoom, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nome.trim()) {
            setError('Nome do cômodo é obrigatório');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const roomData = {
                nome: formData.nome.trim(),
                background_url: formData.background_url.trim(),
                casa: casaId
            };

            const url = editingRoom 
                ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMODOS}${editingRoom.id}/`
                : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMODOS}`;

            const method = editingRoom ? 'PUT' : 'POST';

            const newRoom = await apiRequest(url, {
                method,
                body: JSON.stringify(roomData)
            });

            onRoomCreated(newRoom);
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ nome: '', background_url: '' });
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{editingRoom ? 'Editar Cômodo' : 'Criar Novo Cômodo'}</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome do Cômodo:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            required
                            placeholder="Ex: Sala, Quarto, Cozinha"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="background_url">URL da Imagem de Fundo (opcional):</label>
                        <input
                            type="url"
                            id="background_url"
                            name="background_url"
                            value={formData.background_url}
                            onChange={handleInputChange}
                            placeholder="https://exemplo.com/imagem.jpg"
                        />
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
                            {loading ? (editingRoom ? 'Salvando...' : 'Criando...') : (editingRoom ? 'Salvar' : 'Criar Cômodo')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateRoomModal;
