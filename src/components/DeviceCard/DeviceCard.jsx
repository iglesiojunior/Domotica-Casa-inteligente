import { useState } from 'react';
import './DeviceCard.css';
import { IoTrashOutline, IoPowerOutline } from "react-icons/io5";

function DeviceCard({ dispositivo, onToggle, onRemove }) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async () => {
        setIsRemoving(true);
        try {
            await onRemove();
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className={`device-card ${dispositivo.estado ? 'active' : 'inactive'}`}>
            <div className="device-header">
                <h4>{dispositivo.nome}</h4>
                <button 
                    className="remove-button"
                    onClick={handleRemove}
                    disabled={isRemoving}
                    title="Remover dispositivo"
                >
                    <IoTrashOutline />
                </button>
            </div>
            
            <div className="device-info">
                <p><strong>Tipo:</strong> {dispositivo.tipo_nome || dispositivo.tipo}</p>
                <p><strong>Marca:</strong> {dispositivo.marca || 'N/A'}</p>
                <p><strong>Modelo:</strong> {dispositivo.modelo || 'N/A'}</p>
                {dispositivo.descricao && (
                    <p><strong>Descrição:</strong> {dispositivo.descricao}</p>
                )}
            </div>
            
            <div className="device-status">
                <span className={`status-indicator ${dispositivo.estado ? 'on' : 'off'}`}>
                    {dispositivo.estado ? 'Ligado' : 'Desligado'}
                </span>
            </div>
            
            <div className="device-actions">
                <button 
                    className={`toggle-button ${dispositivo.estado ? 'turn-off' : 'turn-on'}`}
                    onClick={onToggle}
                >
                    <IoPowerOutline />
                    {dispositivo.estado ? 'Desligar' : 'Ligar'}
                </button>
            </div>
        </div>
    );
}

export default DeviceCard;
