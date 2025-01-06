'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaProductHunt, FaPlus, FaSignOutAlt, FaUpload } from 'react-icons/fa';
import Logout from '../logout/page';

export default function Dashboard() {
const router = useRouter();
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [searchQuery, setSearchQuery] = useState("");
const [filteredProducts, setFilteredProducts] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token') !== null;

useEffect(() => {
if (!isLoggedIn) {
router.push('/login');
} else {
async function fetchProducts() {
try {
const response = await fetch('/api/posts');
if (!response.ok) {
throw new Error(`Failed to fetch: ${response.statusText}`);
}
const data = await response.json();
if (data && Array.isArray(data)) {
setProducts(data);
} else {
throw new Error("Unexpected data format");
}
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
}
fetchProducts();
}
}, [isLoggedIn, router]);

const handleSearch = (e) => {
const query = e.target.value.toLowerCase();
setSearchQuery(query);
const filtered = products.filter((product) =>
product.productName.toLowerCase().includes(query)
);
setFilteredProducts(filtered);
setCurrentPage(1); 
};

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedProducts = (filteredProducts.length > 0 ? filteredProducts : products).slice(startIndex, endIndex);
const totalPages = Math.ceil((filteredProducts.length > 0 ? filteredProducts.length : products.length) / itemsPerPage);

if (loading) {
return (
<div className="flex justify-center items-center min-h-screen bg-gray-100">
<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
</div>
);
}
 
if (error) {
return <div>Error: {error}</div>;
}

return (
<div className="flex text-black flex-col lg:flex-row min-h-screen bg-gray-100">
<aside className="w-full lg:w-64 bg-blue-800 text-white lg:min-h-screen flex flex-col items-center lg:items-start p-4">
<h1 className="text-2xl font-semibold pl-4 mb-8 lg:pl-20">ADMIN</h1>
<nav className="w-full lg:w-auto">
<ul className="flex flex-col w-full lg:text-end">
<li className="p-3  text-sm flex items-center hover:bg-blue-700 cursor-pointer rounded-lg mb-3">
<FaProductHunt className="mr-3 text-lg" />
 Products
</li>                   
<Link href="./additem"> <li className="p-3 text-sm flex items-center hover:bg-blue-700 cursor-pointer rounded-lg mb-3">
<FaPlus className="mr-3 text-lg" />Add Item</li></Link>

<Link href="./update"><li className="p-3 text-sm flex items-center hover:bg-blue-700 cursor-pointer rounded-lg mb-3">
<FaUpload className="mr-3 text-lg" />Update </li> </Link>

<Link href="./login"><li className="p-3 text-sm flex items-center hover:bg-red-500 cursor-pointer rounded-lg mb-3 bottom-4">
<FaSignOutAlt className="mr-3 text-lg" /> <Logout /> </li> </Link>
</ul>
</nav>
</aside>

<div className="flex-1">
<header className="bg-white shadow p-2 flex flex-wrap justify-center lg:justify-between items-center">
<h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500  p-6 rounded-3xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
 SJG Leaflet QR Dashboard
</h1>
<button onClick={() => router.push('./generatecode')} className="bg-blue-700 flex hover:bg-blue-500 text-white p-2 rounded-lg w-full sm:w-auto">
 Generate QR Code
</button>
</header>
<div className="p-2 lg:p-4">
<div className="mb-4">
<input
 type="text"
 value={searchQuery}
 onChange={handleSearch}
 placeholder="Search Product Name"
 className="w-full p-2 border rounded"/>
 </div>
 </div>
 <main className="p-2 lg:p-4">
 <h1 className="text-xl font-semibold text-gray-700 text-center mb-4">Products</h1>
 <div className="overflow-auto bg-white shadow rounded-lg p-2 lg:p-4">
 <table className="min-w-full text-xs lg:text-sm text-center">
 <thead>
 <tr>
 <th className="px-2 py-1">ID</th>
 <th className="px-2 py-1">SAP ID</th>
 <th className="px-2 py-1">Product Name</th>
 <th className="px-2 py-1">Actions</th>
 </tr>
 </thead>
 <tbody>
 {paginatedProducts.map((product, index) => (
 <tr key={index} className="border-t">
 <td className="px-2 py-1">{product.ID}</td>
 <td className="px-2 py-1">{product.SAP_ID}</td>
 <td className="px-2 py-1">{product.productName}</td>
 <td className="px-2 py-1 flex flex-col justify-center items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
 <button onClick={() => router.push(`/leaflet?id=${product.ID}`)} className="bg-green-500 text-white px-2 py-1 rounded text-xs"> View </button>
 <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs" onClick={() => { window.location.href = `/download?id=${product.ID},${product.productName}`; }}> Download </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="flex justify-center mt-4">
 <button disabled={currentPage === 1}
  onClick={() => setCurrentPage(currentPage - 1)}
  className={`px-4 py-2 mx-1 bg-blue-500 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}>
  Previous
 </button>
  {[...Array(totalPages)].map((_, index) => ( 
  <button
   key={index}
   onClick={() => setCurrentPage(index + 1)}
   className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}>
   {index + 1}
   </button>
   ))}
   <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
    className={`px-4 py-2 mx-1 bg-blue-500 text-white rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
    >
    Next
   </button>
   </div>
   </main>
   </div>
   </div>
   );
   }
