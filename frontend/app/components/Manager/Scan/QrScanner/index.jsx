// components/QRScanner.js
import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
  const html5QrCode = useRef(null);
  const lastCode = useRef(null);

  useEffect(() => {
    const startScanner = async () => {
      if (!html5QrCode.current) {
        html5QrCode.current = new Html5Qrcode('reader');
      }

      try {
        await html5QrCode.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250
          },
          async (decodedText) => {
            if (decodedText === lastCode.current) return;
            lastCode.current = decodedText;

            await onScanSuccess(decodedText);

            await html5QrCode.current.stop(); // Stop scanning immediately
          },
          (err) => {
            // console.warn('Scan error:', err);
          }
        );
      } catch (err) {
      }
    };

    startScanner();

    return () => {
      if (html5QrCode.current && html5QrCode.current._isScanning) {
        alert("Close the scanner and try again!")
        html5QrCode.current.stop().catch(() => {});
      }
    };
  }, [onScanSuccess]);

  return (
    <div id="reader" style={{ width: '100%' }}>
    </div>
  )
};

export default QRScanner;
