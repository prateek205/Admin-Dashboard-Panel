// client/src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

import { useAuth } from "./authContext"; 

const API = import.meta.env.VITE_BASE

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth(); // Get token from auth context

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/api/products`);

      let productsArray = [];
      if (Array.isArray(response.data)) {
        productsArray = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        productsArray = response.data.data;
      }

      setProducts(productsArray);
      setError(null);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch products";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Create new product
  const createProduct = async (productData, imageFile) => {
    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(`${API}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Use token from auth
        },
      });

      const newProduct = response.data.data || response.data;
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product created successfully!");

      return {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      };
    } catch (err) {
      console.error("Create product error:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to create product";
      toast.error(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  };

  // Update product
  const updateProduct = async (id, productData, imageFile = null) => {
    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.put(`${API}/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Use token from auth
        },
      });

      const updatedProduct = response.data.data || response.data;
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? updatedProduct : product))
      );
      toast.success("Product updated successfully!");

      return {
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      };
    } catch (err) {
      console.error("Update product error:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to update product";
      toast.error(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token from auth
        },
      });

      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success("Product deleted successfully!");

      return { success: true };
    } catch (err) {
      console.error("Delete product error:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to delete product";
      toast.error(errorMsg);
      return {
        success: false,
        error: errorMsg,
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
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
