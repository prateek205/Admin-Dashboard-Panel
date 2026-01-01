import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';

const ProductForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
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
    const result = await onSubmit(data, imageFile);
    if (!result.success) {
      setFormError(result.error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </Typography>
      
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Product Name"
            fullWidth
            {...register('name', { required: 'Product name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

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
          />

          <TextField
            label="Category"
            fullWidth
            {...register('category', { required: 'Category is required' })}
            error={!!errors.category}
            helperText={errors.category?.message}
          />

          <TextField
            label="Stock Quantity"
            type="number"
            fullWidth
            {...register('stock', { 
              required: 'Stock is required',
              min: { value: 0, message: 'Stock cannot be negative' }
            })}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />

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
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </Box>
            )}
            {isEditing && !imagePreview && initialData.image && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption">Current Image:</Typography>
                <img 
                  src={`/uploads/${initialData.image}`} 
                  alt="Current" 
                  style={{ maxWidth: '200px', maxHeight: '200px', display: 'block' }}
                />
              </Box>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox {...register('featured')} defaultChecked={initialData.featured} />
            }
            label="Featured Product"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ProductForm;