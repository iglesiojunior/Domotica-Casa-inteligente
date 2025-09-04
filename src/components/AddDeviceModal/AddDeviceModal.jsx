import { useState, useEffect } from 'react';
import './AddDeviceModal.css';
import { API_CONFIG, apiRequest } from '../../config/api';

function AddDeviceModal({ isOpen, onClose, onDeviceAdded, comodoId }) {
    const [availableDevices, setAvailableDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [deviceName, setDeviceName] = useState('');
    const [deviceDescription, setDeviceDescription] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchAvailableDevices();
        }
    }, [isOpen]);

    const fetchAvailableDevices = async () => {
        try {
            setLoading(true);
            const data = await apiRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TIPOS_DISPOSITIVO}`);
            setAvailableDevices(data.results || data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDevice || !deviceName.trim()) {
            setError('Por favor, selecione um tipo de dispositivo e digite um nome');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const deviceData = {
                nome: deviceName.trim(),
                tipo: selectedDevice.id,
                comodo: comodoId,
                estado: false,
                ativo: true
            };

            const newDevice = await apiRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DISPOSITIVOS}`, {
                method: 'POST',
                body: JSON.stringify(deviceData)
            });
            onDeviceAdded(newDevice);
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedDevice(null);
        setDeviceName('');
        setDeviceDescription('');
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Adicionar Dispositivo</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="device-type">Tipo de Dispositivo:</label>
                        <select
                            id="device-type"
                            value={selectedDevice?.id || ''}
                            onChange={(e) => {
                                const device = availableDevices.find(d => d.id === parseInt(e.target.value));
                                setSelectedDevice(device);
                            }}
                            required
                        >
                            <option value="">Selecione um tipo</option>
                            {availableDevices.map(device => (
                                <option key={device.id} value={device.id}>
                                    {device.nome} {device.marca && `- ${device.marca}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedDevice && (
                        <div className="selected-device-info">
                            <h4>Informações do Dispositivo:</h4>
                            <p><strong>Tipo:</strong> {selectedDevice.nome}</p>
                            {selectedDevice.marca && <p><strong>Marca:</strong> {selectedDevice.marca}</p>}
                            {selectedDevice.modelo && <p><strong>Modelo:</strong> {selectedDevice.modelo}</p>}
                            {selectedDevice.descricao && <p><strong>Descrição:</strong> {selectedDevice.descricao}</p>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="device-name">Nome do Dispositivo:</label>
                        <input
                            type="text"
                            id="device-name"
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            required
                            placeholder="Ex: Lâmpada da Sala, TV Principal"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="device-description">Descrição (opcional):</label>
                        <textarea
                            id="device-description"
                            value={deviceDescription}
                            onChange={(e) => setDeviceDescription(e.target.value)}
                            placeholder="Adicione uma descrição para este dispositivo"
                            rows="3"
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
                            {loading ? 'Adicionando...' : 'Adicionar Dispositivo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddDeviceModal;
