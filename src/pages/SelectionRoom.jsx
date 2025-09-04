import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import SelectionRoomHeader from '../components/SelectionRoomHeader/SelectionRoomHeader';
import ScenesFooter from "../components/ScenesFooter/ScenesFooter"
import SelectionRoomSideBar from '../components/SelectionRoomSideBar/SelectionRoomSideBar';
import CreateHouseModal from '../components/CreateHouseModal/CreateHouseModal';
import RoomList from '../components/RoomList/RoomList';
import RoomView from '../components/RoomView/RoomView';
import NotificationSystem from '../components/NotificationSystem/NotificationSystem';
import './SelectionRoom.css';
import { FaPlus } from 'react-icons/fa';

function SelectionRoom() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCasa, setSelectedCasa] = useState(null);
    const [selectedComodo, setSelectedComodo] = useState(null);
    const [currentView, setCurrentView] = useState('houses');
    const [allDispositivos, setAllDispositivos] = useState([]);
    const [refreshCasas, setRefreshCasas] = useState(false);
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
    const [refreshRooms, setRefreshRooms] = useState(false);


    const toogleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleCasaSelect = (casa) => {
        setSelectedCasa(casa);
        setCurrentView('rooms');
        setIsSidebarOpen(false);
    }

    const handleCreateCasa = () => {
        setIsCreateModalOpen(true);
    }

    const handleCreateRoom = () => {
        setIsCreateRoomModalOpen(true);
    }

    const handleHouseCreated = (newHouse) => {
        console.log('Nova casa criada:', newHouse); 
        setRefreshCasas(r => !r);
        setIsCreateModalOpen(false);
    }

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
    }

    const handleBackToHouses = () => {
        setSelectedCasa(null);
        setSelectedComodo(null);
        setCurrentView('houses');
    }

    const handleBackToRooms = () => {
        setSelectedComodo(null);
        setCurrentView('rooms');
    }

    const handleRoomSelect = (comodo) => {
        setSelectedComodo(comodo);
        setCurrentView('room');
    }

    // Ao criar um novo cômodo:
    const handleRoomCreated = (newRoom) => {
        setRefreshRooms(r => !r);
        console.log('Novo cômodo criado:', newRoom);
    };

    const fetchAllDispositivos = async () => {
        if (!selectedCasa) return;
        
        try {
            const { API_CONFIG, apiRequest, buildUrl } = await import('../config/api');
            const url = buildUrl(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DISPOSITIVOS}`, { casa: selectedCasa.id });
            const data = await apiRequest(url);
            setAllDispositivos(data.results || data);
        } catch (err) {
            console.error('Erro ao carregar dispositivos:', err);
        }
    };

    // Atualizar dispositivos quando a casa mudar
    React.useEffect(() => {
        fetchAllDispositivos();
    }, [selectedCasa]);

    const renderCurrentView = () => {
        switch (currentView) {
            case 'rooms':
                return <RoomList casa={selectedCasa} onBack={handleBackToHouses} onRoomSelect={handleRoomSelect} refreshRooms={refreshRooms} />;
            case 'room':
                return <RoomView comodo={selectedComodo} onBack={handleBackToRooms} />;
            default:
                return null;
        }
    };

    return (
        <div className="selection-room-container">
            <SelectionRoomHeader onToggleSidebar={toogleSidebar} currentView={currentView}/>
            {isSidebarOpen && <SelectionRoomSideBar open={isSidebarOpen} onClose={toogleSidebar} onCasaSelect={handleCasaSelect} onCreateCasa={handleCreateCasa} refreshCasas={refreshCasas}/>}
            {isCreateModalOpen && 
                <CreateHouseModal 
                    isOpen={isCreateModalOpen} 
                    onClose={handleCloseModal} 
                    onRoomCreated={handleRoomCreated}
                    onHouseCreated={handleHouseCreated}
                />
            }


            {/* Botões fixos no canto inferior direito */}
            <div style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                zIndex: 9999
            }}>
                <button 
                    className="add-room-btn"
                    onClick={handleCreateRoom}
                    title='Adicionar Cômodo'
                >
                    <FaPlus className="icon_add_scene" size={20} color="#fff"/>
                </button>
                {/* Adicione aqui o botão de criar dispositivo, se existir */}
                {/* <button className="add-device-btn">Criar Dispositivo</button> */}
            </div>

            <div className="selection-room-main" style={{position: 'relative'}}>
                {renderCurrentView()}

                {/* Botões só aparecem nas telas de cômodos ou dispositivos */}
                {(currentView === 'rooms' || currentView === 'devices') && (
                    <div style={{
                        position: 'absolute',
                        top: 32,
                        right: 32,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        zIndex: 999
                    }}>
                        {currentView === 'rooms' && (
                            <button 
                                className="add-room-btn"
                                onClick={handleCreateRoom}
                                title='Adicionar Cômodo'
                            >
                                <FaPlus className="icon_add_scene" size={20} color="#fff"/>
                            </button>
                        )}
                        {currentView === 'devices' && (
                            <button 
                                className="add-device-btn"
                                onClick={() => {/* lógica para criar dispositivo */}}
                                title='Adicionar Dispositivo'
                            >
                                <FaPlus size={20} color="#fff"/>
                            </button>
                        )}
                    </div>
                )}
            </div>
            <ScenesFooter selectedCasa={selectedCasa} dispositivos={allDispositivos}/>
            <NotificationSystem/>
        </div>
            
    )
}

export default SelectionRoom