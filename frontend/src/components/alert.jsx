import React from "react";

function Alert({ message, show, type, onClose }) {
    if (!show) return null;

    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

    return (
        <div 
            className={`alert ${alertClass} alert-dismissible fade show`} 
            role="alert"
            style={{ 
                position: 'fixed', 
                transform: 'translateX(-50%)', 
                zIndex: 9999,
                bottom: '20px',
                left: '10%', 
                width: '300px'
            }}
        >
            {message}

            <button 
                type="button" 
                className="btn-close" 
                onClick={onClose} 
            ></button>
        </div>
    );
}

export default Alert;