import { useState, useEffect } from 'react'
import "./ScenesFooter.css"
import { FaPlus, FaPlay, FaStar } from "react-icons/fa";
import { API_CONFIG, apiRequest, buildUrl } from '../../config/api';
import CreateSceneModal from '../CreateSceneModal/CreateSceneModal';

function ScenesFooter({ selectedCasa, dispositivos = [] }){
    const [cenas, setCenas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (selectedCasa) {
            fetchCenas();
        } else {
            setCenas([]);
        }
    }, [selectedCasa]);

    const fetchCenas = async () => {
        try {
            setLoading(true);
            const url = buildUrl(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CENAS}`, { casa: selectedCasa.id });
            const data = await apiRequest(url);
            setCenas(data.results || data);
        } catch (err) {
            console.error('Erro ao carregar cenas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSceneCreated = (newScene) => {
        setCenas(prev => [...prev, newScene]);
        setIsCreateModalOpen(false);
        if (window.notificationSystem) {
            window.notificationSystem.showSuccessNotification(
                'Cena Criada',
                `Cena "${newScene.nome}" foi criada com sucesso!`
            );
        }
    };

    const executeScene = async (cena) => {
        try {
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CENA_EXECUTE(cena.id)}`;
            const result = await apiRequest(url, {
                method: 'POST'
            });

            if (window.notificationSystem) {
                const deviceNames = cena.acoes?.map(acao => acao.dispositivo_nome) || [];
                window.notificationSystem.showSceneNotification(cena.nome, deviceNames);
            }
        } catch (err) {
            console.error('Erro ao executar cena:', err);
            if (window.notificationSystem) {
                window.notificationSystem.showErrorNotification(
                    'Erro ao Executar Cena',
                    `Não foi possível executar a cena "${cena.nome}"`
                );
            }
        }
    };

    if (!selectedCasa) {
        return (
            <div className='Scenes_Footer'>
                <div className="no-house-selected">
                    <p>Selecione uma casa para ver as cenas</p>
                </div>
            </div>
        );
    }

    return(
        <div className='Scenes_Footer'>
            <div className="scenes-header">
                <h3>Cenas - {selectedCasa.nome}</h3>
                <button 
                    className='icon_add_scene'
                    onClick={() => setIsCreateModalOpen(true)}
                    title="Criar nova cena"
                >
                    <FaPlus size={20} color="#ffffffff"/>
                </button>
            </div>

            <div className="scenes-list">
                {loading ? (
                    <div className="loading-scenes">Carregando cenas...</div>
                ) : cenas.length === 0 ? (
                    <div className="no-scenes">
                        <p>Nenhuma cena criada ainda</p>
                        <button 
                            className="create-first-scene"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Criar Primeira Cena
                        </button>
                    </div>
                ) : (
                    <div className="scenes-grid">
                        {cenas.map(cena => (
                            <div key={cena.id} className={`scene-card ${cena.favorita ? 'favorite' : ''}`}>
                                <div className="scene-header">
                                    <h4>{cena.nome}</h4>
                                    {cena.favorita && <FaStar className="favorite-icon" />}
                                </div>
                                
                                {cena.descricao && (
                                    <p className="scene-description">{cena.descricao}</p>
                                )}
                                
                                <div className="scene-info">
                                    <span className="scene-actions">
                                        {cena.total_acoes || 0} ações
                                    </span>
                                    <span className={`scene-status ${cena.ativa ? 'active' : 'inactive'}`}>
                                        {cena.ativa ? 'Ativa' : 'Inativa'}
                                    </span>
                                </div>

                                <div className="scene-actions-buttons">
                                    <button 
                                        className="execute-scene-button"
                                        onClick={() => executeScene(cena)}
                                        disabled={!cena.ativa}
                                        title={cena.ativa ? 'Executar cena' : 'Cena inativa'}
                                    >
                                        <FaPlay />
                                        Executar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateSceneModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSceneCreated={handleSceneCreated}
                casaId={selectedCasa.id}
                dispositivos={dispositivos}
            />
        </div>
    )
}

export default ScenesFooter;