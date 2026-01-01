import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Numbers as NumbersIcon,
} from '@mui/icons-material';
import CurrencyInput from '../components/currencyInput';
import axios from 'axios';

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
  'Other',
];

const steps = ['Product Details', 'Update Image', 'Pricing & Stock'];

const EditProductModal = ({ open, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
      });
      setCurrentImage(product.image || '');
      setImagePreview('');
      setImage(null);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      await axios.put(`/api/products/${product._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Product updated successfully!');
      onProductUpdated();
      
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
    });
    setImage(null);
    setImagePreview('');
    setCurrentImage('');
    setError('');
    setSuccess('');
    setActiveStep(0);
    onClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Select Category
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    color={formData.category === cat ? 'primary' : 'default'}
                    icon={<CategoryIcon />}
                    clickable
                  />
                ))}
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'grey.300',
                bgcolor: 'grey.50',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
              onClick={() => document.getElementById('image-upload').click()}
            >
              <input
                id="image-upload"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Update Product Image
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Click to upload or drag and drop
              </Typography>
              <Typography variant="caption" color="textSecondary">
                PNG, JPG, GIF up to 5MB
              </Typography>
            </Paper>
            
            {(imagePreview || currentImage) && (
              <Box mt={3}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {imagePreview ? 'New Preview' : 'Current Image'}
                </Typography>
                <Box
                  component="img"
                  src={imagePreview || `http://localhost:5000${currentImage}`}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
                {currentImage && !imagePreview && (
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                    Leave empty to keep current image
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <CurrencyInput
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            
            <TextField
              fullWidth
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: <NumbersIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                inputProps: { min: 0 }
              }}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 24,
          p: 0,
        }}
      >
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              Edit Product
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {getStepContent(index)}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : index === steps.length - 1 ? (
                        'Update Product'
                      ) : (
                        'Continue'
                      )}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProductModal;