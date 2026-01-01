import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  IconButton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Inventory2 as Inventory2Icon,
  Category as CategoryIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import Navbar from '../components/navbar';
import axios from 'axios';
import { format } from 'date-fns';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      setError('Failed to load product details');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: 'Out of Stock',
        color: 'error',
        icon: <CancelIcon />,
        message: 'This product is currently out of stock.',
      };
    } else if (stock <= 10) {
      return {
        label: 'Low Stock',
        color: 'warning',
        icon: <TrendingDownIcon />,
        message: 'Only a few items left in stock.',
      };
    } else {
      return {
        label: 'In Stock',
        color: 'success',
        icon: <CheckCircleIcon />,
        message: 'Available for purchase.',
      };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Product not found'}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/products')}
          >
            Back to Products
          </Button>
        </Container>
      </Box>
    );
  }

  const status = getStockStatus(product.stock);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ cursor: 'pointer' }}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate('/products')}
            sx={{ cursor: 'pointer' }}
          >
            Products
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {product.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  icon={status.icon}
                  label={status.label}
                  color={status.color}
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="body2" color="textSecondary">
                  Product ID: {product._id}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/products')}
                variant="outlined"
              >
                Back
              </Button>
              {isAdmin && (
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  onClick={() => navigate(`/products/edit/${product._id}`)}
                >
                  Edit Product
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Image & Basic Info */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                {product.image ? (
                  <Box
                    component="img"
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    sx={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'contain',
                      borderRadius: 2,
                      mb: 3,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      bgcolor: 'grey.100',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <Inventory2Icon sx={{ fontSize: 100, color: 'grey.400' }} />
                  </Box>
                )}

                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Details & Stats */}
          <Grid item xs={12} lg={4}>
            {/* Product Details Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Product Details
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CategoryIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="textSecondary">
                      Category
                    </Typography>
                  </Box>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AttachMoneyIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="textSecondary">
                      Price
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Inventory2Icon fontSize="small" color="primary" />
                    <Typography variant="body2" color="textSecondary">
                      Stock Information
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {product.stock} units available
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {status.message}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CalendarTodayIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="textSecondary">
                      Created Date
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={500}>
                    {format(new Date(product.createdAt), 'MMMM dd, yyyy')}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {format(new Date(product.createdAt), 'hh:mm a')}
                  </Typography>
                </Box>

                {product.createdBy && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <PersonIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="textSecondary">
                          Created By
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={500}>
                        {product.createdBy.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {product.createdBy.email}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Stock Alert Card */}
            {product.stock <= 10 && (
              <Card sx={{ bgcolor: product.stock === 0 ? 'error.50' : 'warning.50' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {product.stock === 0 ? (
                      <CancelIcon color="error" />
                    ) : (
                      <TrendingDownIcon color="warning" />
                    )}
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {product.stock === 0 ? 'Out of Stock!' : 'Low Stock Alert!'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.stock === 0
                          ? 'This product needs to be restocked.'
                          : `Only ${product.stock} units left. Consider restocking.`}
                      </Typography>
                    </Box>
                  </Box>
                  {isAdmin && (
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/products/edit/${product._id}`)}
                    >
                      Update Stock
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetail;