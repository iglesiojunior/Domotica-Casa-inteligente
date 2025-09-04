import { useState, useEffect } from 'react';
import './RoomList.css';
import { IoArrowBackOutline, IoAddOutline } from "react-icons/io5";
import { API_CONFIG, apiRequest, buildUrl } from '../../config/api';
import CreateRoomModal from '../CreateRoomModal/CreateRoomModal';

function RoomList({ casa, onBack, onRoomSelect, refreshRooms }) {
    const [comodos, setComodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (casa) {
            fetchComodos();
        }
    }, [casa, refreshRooms]);

    const fetchComodos = async () => {
        try {
            setLoading(true);
            const url = buildUrl(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMODOS}`, { casa: casa.id });
            const data = await apiRequest(url);
            setComodos(data.results || data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoomCreated = (newRoom) => {
        setComodos(prev => [...prev, newRoom]);
        setIsCreateModalOpen(false);
        if (window.notificationSystem) {
            window.notificationSystem.showSuccessNotification(
                'Cômodo Criado',
                `Cômodo "${newRoom.nome}" foi criado com sucesso!`
            );
        }
    };

    if (loading) {
        return (
            <div className="room-list-container">
                <div className="room-list-header">
                    <button className="back-button" onClick={onBack}>
                        <IoArrowBackOutline />
                    </button>
                    <h2>{casa?.nome}</h2>
                </div>
                <div className="loading">Carregando cômodos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="room-list-container">
                <div className="room-list-header">
                    <button className="back-button" onClick={onBack}>
                        <IoArrowBackOutline />
                    </button>
                    <h2>{casa?.nome}</h2>
                </div>
                <div className="error">Erro: {error}</div>
            </div>
        );
    }

    return (
        <div className="room-list-container">
            <div className="room-list-header">
                <button className="back-button" onClick={onBack}>
                    <IoArrowBackOutline />
                </button>
                <h2>{casa.nome}</h2>
                <button 
                    className="add-room-button"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <IoAddOutline />
                    Criar Cômodo
                </button>
            </div>
            
            <div className="room-list-content">
                <h3>Cômodos Disponíveis</h3>
                {comodos.length === 0 ? (
                    <div className="no-rooms">
                        <p>Nenhum cômodo encontrado nesta casa.</p>
                    </div>
                ) : (
                    <div className="rooms-grid">
                        {comodos.map(comodo => (
                            <div 
                                key={comodo.id} 
                                className="room-card"
                                onClick={() => onRoomSelect(comodo)}
                            >
                                <h4>{comodo.nome}</h4>
                                <p>Casa: {comodo.casa_nome}</p>
                                <p>Dispositivos: {comodo.total_dispositivos || 0}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onRoomCreated={handleRoomCreated}
                casaId={casa.id}
            />
        </div>
    );
}

export default RoomList;
