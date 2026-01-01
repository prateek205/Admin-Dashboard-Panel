// client/src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { useProducts } from '../context/productContext';
import ProductForm from './productForm';

const ProductList = () => {
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    createProduct,
    updateProduct,
    deleteProduct 
  } = useProducts();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle create product
  const handleCreateSubmit = async (data, imageFile) => {
    const result = await createProduct(data, imageFile);
    if (result.success) {
      setFormDialogOpen(false);
      fetchProducts();
    }
    return result;
  };

  // Handle update product
  const handleUpdateSubmit = async (data, imageFile) => {
    if (!selectedProduct?._id) return { success: false, error: 'No product selected' };
    
    const result = await updateProduct(selectedProduct._id, data, imageFile);
    if (result.success) {
      setFormDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    }
    return result;
  };

  // Handle delete
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Filter products
  const productsArray = Array.isArray(products) ? products : [];
  const filteredProducts = productsArray.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get categories
  const categories = ['all', ...new Set(productsArray.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading products...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Products</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            setSelectedProduct(null);
            setFormDialogOpen(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Search & Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search products..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
            sx={{ flexGrow: 1 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    {productsArray.length === 0 ? 'No products found' : 'No matching products'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <img 
                      src={`/uploads/${product.image}`}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{product.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {product.description?.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category || 'Uncategorized'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      ${product.price?.toFixed(2) || '0.00'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.stock || 0}
                      color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.featured ? 'Featured' : 'Regular'}
                      color={product.featured ? 'secondary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => {
                          setSelectedProduct(product);
                          setFormDialogOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Form Dialog */}
      <Dialog 
        open={formDialogOpen} 
        onClose={() => {
          setFormDialogOpen(false);
          setSelectedProduct(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            onSubmit={selectedProduct ? handleUpdateSubmit : handleCreateSubmit}
            initialData={selectedProduct || {}}
            isEditing={!!selectedProduct}
            onSuccess={() => {
              setFormDialogOpen(false);
              setSelectedProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;