import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Create product with image
  const createProduct = async (productData, imageFile) => {
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    
    // Append image file
    formData.append('image', imageFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Add new product to state
      setProducts(prev => [response.data.product, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to create product' 
      };
    }
  };

  // Update product
  const updateProduct = async (id, productData, imageFile = null) => {
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      if (productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update product in state
      setProducts(prev => prev.map(product => 
        product._id === id ? response.data.product : product
      ));
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update product' 
      };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove product from state
      setProducts(prev => prev.filter(product => product._id !== id));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete product' 
      };
    }
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};