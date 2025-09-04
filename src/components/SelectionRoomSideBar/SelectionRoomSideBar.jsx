import {react, useState, useEffect} from 'react'
import "./SelectionRoomSideBar.css"
import HouseCard from '../HouseCard/HouseCard';
import { IoArrowBackOutline } from "react-icons/io5";
import { API_CONFIG, apiRequest } from '../../config/api';

function SelectionRoomSideBar({open, onClose, onCasaSelect, onCreateCasa, refreshCasas}){
     const [casas, setCasas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            setLoading(true);
            fetch(`${API_CONFIG.BASE_URL}/casas/`)
                .then(res => res.json())
                .then(data => setCasas(data.results || []))
                .catch(() => setError("Não foi possível carregar as casas."))
                .finally(() => setLoading(false));
        }
    }, [open, refreshCasas]); // Adicione refreshCasas aqui

    if (loading) {
        return <div>Carregando dados da casa...</div>;
    }

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <div className={`sidebar_selection_room${open ? ' open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button className="btn_close_sidebar" onClick={onClose}> <IoArrowBackOutline/> </button>
        <button className="btn_create_house" onClick={onCreateCasa}>Criar Casa</button>
      </div>
      <h2>Casas</h2>
      <div className='house-list'>
        {loading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          casas.map(casa => (
            <HouseCard key={casa.id} casa={casa} onClick={onCasaSelect} />
          ))
        )}
      </div>
    </div>
    )
}

export default SelectionRoomSideBar;