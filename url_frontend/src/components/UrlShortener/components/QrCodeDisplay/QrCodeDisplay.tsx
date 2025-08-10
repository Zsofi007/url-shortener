import React from 'react';
import './QrCodeDisplay.css';

interface QrCodeDisplayProps {
  qrCodeData: string;
  shortUrl: string;
  shortCode: string;
  onRegenerate?: (size: number) => void;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  qrCodeData,
  shortUrl,
  shortCode,
  onRegenerate
}) => {
  const handleDownload = () => {
    if (!qrCodeData) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `qr-code-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(200); // Default size
    }
  };

  if (!qrCodeData) {
    return null;
  }

  return (
    <div className="qr-code-display">
      <h3>QR Code</h3>
      <div className="qr-code-container">
        <img 
          src={qrCodeData} 
          alt={`QR Code for ${shortUrl}`}
          className="qr-code-image"
        />
      </div>
      <div className="qr-code-actions">
        <button 
          onClick={handleDownload}
          className="download-btn"
          title="Download QR Code"
        >
          📥 Download
        </button>
        {onRegenerate && (
          <button 
            onClick={handleRegenerate}
            className="regenerate-btn"
            title="Regenerate QR Code"
          >
            🔄 Regenerate
          </button>
        )}
      </div>
      <p className="qr-code-info">
        Scan this QR code to quickly access your shortened URL
      </p>
    </div>
  );
};
