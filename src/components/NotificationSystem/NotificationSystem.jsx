import { useState, useEffect } from 'react';
import './NotificationSystem.css';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoInformationCircleOutline } from "react-icons/io5";

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);

    // Função para adicionar notificação
    const addNotification = (notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: notification.type || 'info', // 'success', 'error', 'info'
            title: notification.title || '',
            message: notification.message || '',
            duration: notification.duration || 5000,
            timestamp: new Date()
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove após duração especificada
        setTimeout(() => {
            removeNotification(id);
        }, newNotification.duration);
    };

    // Função para remover notificação
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    // Função para mostrar notificação de cena
    const showSceneNotification = (sceneName, devices) => {
        addNotification({
            type: 'success',
            title: `Cena "${sceneName}" Executada`,
            message: `Dispositivos sendo ligados: ${devices.join(', ')}`,
            duration: 8000
        });
    };

    // Função para mostrar notificação de erro
    const showErrorNotification = (title, message) => {
        addNotification({
            type: 'error',
            title,
            message,
            duration: 6000
        });
    };

    // Função para mostrar notificação de sucesso
    const showSuccessNotification = (title, message) => {
        addNotification({
            type: 'success',
            title,
            message,
            duration: 4000
        });
    };

    // Função para mostrar notificação de informação
    const showInfoNotification = (title, message) => {
        addNotification({
            type: 'info',
            title,
            message,
            duration: 5000
        });
    };

    // Expor funções globalmente para uso em outros componentes
    useEffect(() => {
        window.notificationSystem = {
            showSceneNotification,
            showErrorNotification,
            showSuccessNotification,
            showInfoNotification
        };

        return () => {
            delete window.notificationSystem;
        };
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <IoCheckmarkCircleOutline />;
            case 'error':
                return <IoCloseCircleOutline />;
            case 'info':
            default:
                return <IoInformationCircleOutline />;
        }
    };

    const getTypeClass = (type) => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            case 'info':
            default:
                return 'info';
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`notification ${getTypeClass(notification.type)}`}
                    onClick={() => removeNotification(notification.id)}
                >
                    <div className="notification-icon">
                        {getIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                        {notification.title && (
                            <div className="notification-title">
                                {notification.title}
                            </div>
                        )}
                        <div className="notification-message">
                            {notification.message}
                        </div>
                    </div>
                    <button
                        className="notification-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationSystem;

