import { useState, useEffect } from 'react';
import './RoomView.css';
import { IoArrowBackOutline, IoAddOutline } from "react-icons/io5";
import DeviceCard from '../DeviceCard/DeviceCard';
import AddDeviceModal from '../AddDeviceModal/AddDeviceModal';
import { API_CONFIG, apiRequest, buildUrl } from '../../config/api';

function RoomView({ comodo, onBack, onDeviceAddedToRoom }) {
    const [dispositivos, setDispositivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

    useEffect(() => {
        if (comodo) {
            fetchDispositivos();
        }
    }, [comodo]);

    const fetchDispositivos = async () => {
        try {
            setLoading(true);
            const url = buildUrl(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DISPOSITIVOS}`, { comodo: comodo.id });
            const data = await apiRequest(url);
            setDispositivos(data.results || data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeviceToggle = async (dispositivo) => {
        try {
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DISPOSITIVO_TOGGLE(dispositivo.id)}`;
            const result = await apiRequest(url, {
                method: 'POST',
            });

            // Atualiza o estado local com o novo estado
            setDispositivos(prev => 
                prev.map(dev => dev.id === dispositivo.id ? 
                    { ...dev, estado: result.estado } : dev)
            );
        } catch (err) {
            console.error('Erro ao alterar dispositivo:', err);
        }
    };

    const handleRemoveDevice = async (dispositivo) => {
        if (!window.confirm('Tem certeza que deseja remover este dispositivo do cômodo?')) {
            return;
        }

        try {
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DISPOSITIVOS}${dispositivo.id}/`;
            await apiRequest(url, {
                method: 'DELETE'
            });

            setDispositivos(prev => prev.filter(dev => dev.id !== dispositivo.id));
        } catch (err) {
            console.error('Erro ao remover dispositivo:', err);
        }
    };

    const handleDeviceAdded = (newDevice) => {
        setDispositivos(prev => [...prev, newDevice]);
        setIsAddDeviceModalOpen(false);
        if (onDeviceAddedToRoom) {
            onDeviceAddedToRoom(newDevice);
        }
    };

    if (loading) {
        return (
            <div className="room-view-container">
                <div className="room-view-header">
                    <button className="back-button" onClick={onBack}>
                        <IoArrowBackOutline />
                    </button>
                    <h2>{comodo?.nome}</h2>
                </div>
                <div className="loading">Carregando dispositivos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="room-view-container">
                <div className="room-view-header">
                    <button className="back-button" onClick={onBack}>
                        <IoArrowBackOutline />
                    </button>
                    <h2>{comodo?.nome}</h2>
                </div>
                <div className="error">Erro: {error}</div>
            </div>
        );
    }

    return (
        <div className="room-view-container">
            <div className="room-view-header">
                <button className="back-button" onClick={onBack} title='Voltar para a lista de cômodos'>
                    <IoArrowBackOutline />
                </button>
                <h2>{comodo.nome}</h2>
                <button 
                    className="add-device-button"
                    onClick={() => setIsAddDeviceModalOpen(true)}
                >
                    <IoAddOutline />
                    Adicionar Dispositivo
                </button>
            </div>
            
           <div className="room-list-content">
                {loading ? (
                    <div>Carregando dispositivos...</div>
                ) : error ? (
                    <div>Erro ao carregar os dispositivos: {error}</div>
                ) : dispositivos.length === 0 ? (
                    <div className="no-devices">
                        <p>Nenhum dispositivo encontrado neste cômodo.</p>
                        <button 
                            className="add-first-device-button"
                            onClick={() => setIsAddDeviceModalOpen(true)}
                        >
                            Adicionar Primeiro Dispositivo
                        </button>
                    </div>
                ) : (
                    <div className="devices-grid">
                        {dispositivos.map(dispositivo => (
                            <DeviceCard
                                key={dispositivo.id}
                                dispositivo={dispositivo}
                                onToggle={() => handleDeviceToggle(dispositivo)}
                                onRemove={() => handleRemoveDevice(dispositivo)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AddDeviceModal
                isOpen={isAddDeviceModalOpen}
                onClose={() => setIsAddDeviceModalOpen(false)}
                onDeviceAdded={handleDeviceAdded}
                comodoId={comodo.id}
            />
        </div>
    );
}

export default RoomView;
