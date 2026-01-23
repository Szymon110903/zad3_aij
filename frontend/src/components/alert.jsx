import React from "react";

function Alert({ message, show, type, onClose }) {
    if (!show) return null;

    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

    return (
        <div 
            className={`alert ${alertClass} alert-dismissible fade show shadow-lg`} 
            role="alert"
            style={{ 
                position: 'fixed', 
                bottom: '20px',      
                left: '20px',        
                zIndex: 10000,       
                minWidth: '300px',
                maxWidth: '400px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
            }}
        >
            <i className={`bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            
            <strong>{message}</strong>

            <button 
                type="button" 
                className="btn-close" 
                onClick={onClose} 
            ></button>
        </div>
    );
}

export default Alert;