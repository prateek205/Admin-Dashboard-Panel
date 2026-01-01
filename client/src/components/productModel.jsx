import React, { useState } from 'react';
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

const steps = ['Product Details', 'Upload Image', 'Pricing & Stock'];

const AddProductModal = ({ open, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      await axios.post('/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onProductAdded();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add product');
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
    setError('');
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
              rows={3}
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
                Upload Product Image
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Click to upload or drag and drop
              </Typography>
              <Typography variant="caption" color="textSecondary">
                PNG, JPG, GIF up to 5MB
              </Typography>
            </Paper>
            
            {imagePreview && (
              <Box mt={3}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Preview
                </Typography>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
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
              Add New Product
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
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
                      disabled={
                        loading ||
                        (index === 0 && (!formData.name || !formData.description || !formData.category)) ||
                        (index === 1 && !image) ||
                        (index === 2 && (!formData.price || !formData.stock))
                      }
                      sx={{ mr: 1 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : index === steps.length - 1 ? (
                        'Add Product'
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

          {activeStep === steps.length && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Added Successfully!
              </Typography>
              <Button onClick={handleClose} variant="contained">
                Close
              </Button>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AddProductModal;