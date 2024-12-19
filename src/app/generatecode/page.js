'use client';

import { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';

    const StyledQrCode = () => {
     const [url, setUrl] = useState('');
   const qrCodeRef = useRef(null); 
  const qrCodeInstance = useRef(null);

  useEffect(() => {
    qrCodeInstance.current = new QRCodeStyling({
      width: 200,
      height: 200,
      data: 'https://example.com',
      dotsOptions: {
        color: '#000000', 
        type: 'extra-rounded', 
      },
      cornersSquareOptions: {
        color: '#000000', 
        type: 'square', 
      },
      cornersDotOptions: {
        color: '#000000', 
      },
      backgroundOptions: {
        color: '#ffffff', 
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
      },
    });
  }, []);

  const generateQrCode = () => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.update({
        data: url || 'https://example.com',
      });
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = ''; 
        qrCodeInstance.current.append(qrCodeRef.current); 
      }
    }
  };

  const downloadQrCode = () => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({ name: 'StyledQR', extension: 'jpeg' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-6">
      <h1 className="text-3xl font-bold text-black">QR Code Generator</h1>

      <input
        className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        type="text"
        placeholder="Enter URL or text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        className="px-6 py-3 text-white bg-black rounded-lg shadow-md hover:bg-gray-800 transition duration-200"
        onClick={generateQrCode}
      >
        Generate QR Code
      </button>

      <div ref={qrCodeRef} className="mt-8"></div>

      <button
        className="mt-4 text-black hover:underline"
        onClick={downloadQrCode}
      >
        Download QR Code
      </button>
    </div>
  );
};

export default StyledQrCode;
