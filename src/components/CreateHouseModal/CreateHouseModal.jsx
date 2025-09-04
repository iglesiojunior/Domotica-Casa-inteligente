import { useState } from 'react';
import './CreateHouseModal.css';
import { API_CONFIG, apiRequest } from '../../config/api';

function CreateHouseModal({ isOpen, onClose, onHouseCreated }) {
    const [formData, setFormData] = useState({
        nome: '',
        endereco: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Pegue apenas nome e endereco do form
        const { nome, endereco } = formData;

        // Adicione os valores padrão
        const dataToSend = {
            nome,
            endereco,
            timezone: 'America/Sao_Paulo',
            usuario: 2
        };

        try {
            const newHouse = await apiRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CASAS}`, {
                method: 'POST',
                body: JSON.stringify(dataToSend)
            });
            onHouseCreated(newHouse);
            setFormData({ nome: '', endereco: '' });
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ nome: '', endereco: '', timezone: 'America/Sao_Paulo', usuario: 2});
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Criar Nova Casa</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome da Casa:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite o nome da casa"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endereco">Endereço:</label>
                        <input
                            type="text"
                            id="endereco"
                            name="endereco"
                            value={formData.endereco}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite o endereço"
                        />
                    </div>

                    {/* <div className="form-group">
                        <label htmlFor="usuario">Dono desta casa:</label>
                        <input
                            type="text"
                            id="usuario"
                            name="usuario"
                            value={formData.usuario}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite quem é o dono desta casa"
                        />
                    </div> */}

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
                            {loading ? 'Criando...' : 'Criar Casa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateHouseModal;
