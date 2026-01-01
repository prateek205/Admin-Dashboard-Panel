// client/src/components/ProductForm.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { useForm } from 'react-hook-form';

const ProductForm = ({ onSubmit, initialData = {}, isEditing = false, onSuccess }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || '',
      price: initialData.price || '',
      category: initialData.category || 'electronics',
      stock: initialData.stock || '',
      featured: initialData.featured || false
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data) => {
    setFormError('');
    setIsSubmitting(true);
    
    try {
      // Validate required image for new products
      if (!isEditing && !imageFile) {
        throw new Error('Please upload a product image');
      }

      // Convert numeric fields
      const productData = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        featured: Boolean(data.featured)
      };

      // Call the onSubmit function
      const result = await onSubmit(productData, imageFile);
      
      // Check result
      if (result?.success) {
        // Success
        reset();
        setImagePreview(null);
        setImageFile(null);
        if (onSuccess) onSuccess();
      } else {
        // Error
        setFormError(result?.error || 'Operation failed');
      }
    } catch (error) {
      setFormError(error.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'electronics',
    'clothing',
    'books',
    'home',
    'sports',
    'beauty',
    'other'
  ];

  return (
    <Box sx={{ p: 3 }}>
      {formError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Product Name */}
          <TextField
            label="Product Name"
            fullWidth
            {...register('name', { required: 'Product name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isSubmitting}
          />

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={isSubmitting}
          />

          {/* Price and Stock */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
              disabled={isSubmitting}
            />

            <TextField
              label="Stock"
              type="number"
              fullWidth
              {...register('stock', { 
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' }
              })}
              error={!!errors.stock}
              helperText={errors.stock?.message}
              disabled={isSubmitting}
            />
          </Box>

          {/* Category */}
          <FormControl fullWidth error={!!errors.category} disabled={isSubmitting}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              {...register('category', { required: 'Category is required' })}
              defaultValue={initialData.category || 'electronics'}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography variant="caption" color="error">
                {errors.category.message}
              </Typography>
            )}
          </FormControl>

          {/* Image Upload */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Product Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: '16px' }}
            />
            
            {/* Image Preview */}
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}
            
            {/* Current Image (for editing) */}
            {isEditing && !imagePreview && initialData.image && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption">Current Image:</Typography>
                <img 
                  src={`/uploads/${initialData.image}`} 
                  alt="Current" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    borderRadius: '8px',
                    display: 'block',
                    marginTop: '8px'
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Featured Checkbox */}
          <FormControlLabel
            control={
              <Checkbox 
                {...register('featured')} 
                defaultChecked={initialData.featured}
                disabled={isSubmitting}
              />
            }
            label="Featured Product"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditing ? (
              'Update Product'
            ) : (
              'Create Product'
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProductForm;