      'use client';
       import { useEffect, useRef, useState } from "react";

       export default function Download() {
       const hasFetched = useRef(false); 
       const [loading, setLoading] = useState(true); 
       const [error, setError] = useState(null); 

        useEffect(() => {
        if (hasFetched.current) return; 
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id') || '0');
        const fetchData = async (id) => {
        try {
        console.log(`Fetching data for ID: ${id}`);
        const data = await fetch(`/api/posts?id=${id}`);

        if (!data.ok) {
          throw new Error(`Error fetching data: ${data.statusText}`);
        }

        const response = await data.json();
        console.log("Full response:", response);

        const base64String = response.qr_code || response[0]?.qr_code;
        const fileName = `${response.productName || response[0]?.productName || "DefaultFileName"}.pdf`;

        if (!base64String) {
          throw new Error("QR code not found in response");
        }

        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64String}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.log("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false); 
      }
    };

    if (id) {
      fetchData(id);
      hasFetched.current = true; 
    } else {
      setLoading(false); 
      setError("Invalid ID parameter");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    ); 
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
  }

  return null; 
}