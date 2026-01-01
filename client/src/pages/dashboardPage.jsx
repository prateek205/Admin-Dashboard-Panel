import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  CurrencyRupee as CurrencyRupeeIcon,
} from '@mui/icons-material';
import Navbar from '../components/navbar';
import AddProductModal from '../components/productModel';
import { formatIndianRupees, formatDate } from '../utils/formatter';
import PriceDisplay from '../components/priceDisplay';
import axios from 'axios';

const StatCard = ({ title, value, icon, change, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          {change && (
            <Box display="flex" alignItems="center" mt={1}>
              {change > 0 ? (
                <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 16 }} />
              ) : (
                <ArrowDownwardIcon sx={{ color: 'error.main', fontSize: 16 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: change > 0 ? 'success.main' : 'error.main',
                  ml: 0.5,
                }}
              >
                {Math.abs(change)}%
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                from last month
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            width: 56,
            height: 56,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const RecentOrders = ({ orders }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          Recent Orders
        </Typography>
        <Button color="primary" size="small">
          View All
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    #{order.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                      {order.customer.charAt(0)}
                    </Avatar>
                    {order.customer}
                  </Box>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <PriceDisplay price={order.amount} fontWeight={500} />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    icon={order.status === 'Completed' ? <CheckCircleIcon /> : 
                          order.status === 'Pending' ? <ScheduleIcon /> : 
                          <CancelIcon />}
                    color={order.status === 'Completed' ? 'success' : 
                           order.status === 'Pending' ? 'warning' : 
                           'error'}
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

const TopProducts = ({ products }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Top Selling Products
      </Typography>
      {products.map((product, index) => (
        <Box key={product.id} mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="body2" fontWeight={500}>
              {product.name}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {product.sales} units
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={product.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.100',
              '& .MuiLinearProgress-bar': {
                backgroundColor: product.color,
              },
            }}
          />
          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" color="textSecondary">
              Revenue: <PriceDisplay price={product.revenue} showIcon={false} />
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {product.progress}% of total
            </Typography>
          </Box>
        </Box>
      ))}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    revenue: '2,45,800',
    orders: '1,234',
    customers: '8,560',
    products: '456',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // Mock data with Indian pricing
  const recentOrders = [
    { id: 'ORD-001', customer: 'Rajesh Kumar', date: '2024-01-15', amount: 24599, status: 'Completed' },
    { id: 'ORD-002', customer: 'Priya Sharma', date: '2024-01-15', amount: 12050, status: 'Pending' },
    { id: 'ORD-003', customer: 'Amit Patel', date: '2024-01-14', amount: 8999, status: 'Completed' },
    { id: 'ORD-004', customer: 'Sunita Singh', date: '2024-01-14', amount: 45675, status: 'Processing' },
    { id: 'ORD-005', customer: 'Vikram Mehta', date: '2024-01-13', amount: 6725, status: 'Completed' },
  ];

  const topProducts = [
    { id: 1, name: 'Wireless Headphones', sales: 234, revenue: 468000, progress: 75, color: '#6366f1' },
    { id: 2, name: 'Smart Watch', sales: 189, revenue: 567000, progress: 60, color: '#10b981' },
    { id: 3, name: 'Laptop Stand', sales: 156, revenue: 312000, progress: 50, color: '#f59e0b' },
    { id: 4, name: 'USB-C Hub', sales: 98, revenue: 147000, progress: 30, color: '#ef4444' },
    { id: 5, name: 'Phone Case', sales: 67, revenue: 100500, progress: 20, color: '#8b5cf6' },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.products);
      
      // Calculate total revenue in Indian Rupees
      const totalRevenue = response.data.products.reduce((sum, product) => {
        return sum + (product.price * product.stock * 0.1); // Assuming 10% of stock sold
      }, 0);
      
      setStats(prev => ({
        ...prev,
        revenue: formatIndianRupees(totalRevenue, { compact: true, showSymbol: false }),
        products: response.data.products.length.toString(),
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddProduct = () => {
    setOpenModal(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onOpenAddProduct={isAdmin ? handleOpenAddProduct : null} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Here's what's happening with your store today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`₹${stats.revenue}`}
              icon={<CurrencyRupeeIcon />}
              change={12.5}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={stats.orders}
              icon={<ShoppingCartIcon />}
              change={8.2}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Customers"
              value={stats.customers}
              icon={<PeopleIcon />}
              change={-2.1}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Products"
              value={stats.products}
              icon={<InventoryIcon />}
              change={15.3}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Charts and Tables */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <RecentOrders orders={recentOrders} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TopProducts products={topProducts} />
          </Grid>
        </Grid>

        {/* Recent Products */}
        <Box mt={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Products
                </Typography>
                <Button color="primary" size="small">
                  View All Products
                </Button>
              </Box>
              <Grid container spacing={3}>
                {products.slice(0, 4).map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        }
                      }}
                    >
                      {product.image && (
                        <Box
                          component="img"
                          src={`http://localhost:5000${product.image}`}
                          alt={product.name}
                          sx={{
                            width: '100%',
                            height: 160,
                            objectFit: 'cover',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {product.description.substring(0, 60)}...
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <PriceDisplay 
                            price={product.price} 
                            variant="h6" 
                            fontWeight={700} 
                            color="primary"
                          />
                          <Chip
                            label={`Stock: ${product.stock}`}
                            size="small"
                            color={product.stock > 10 ? 'success' : 'warning'}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Activity Timeline */}
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>
              <Box>
                {[
                  { time: '10:30 AM', activity: 'New order #ORD-009 received', user: 'Rajesh Kumar' },
                  { time: '09:15 AM', activity: 'Product "Wireless Mouse" updated', user: 'You' },
                  { time: 'Yesterday', activity: '5 new customers registered', user: 'System' },
                  { time: 'Jan 13', activity: 'Monthly sales report generated', user: 'You' },
                ].map((item, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    mb={2}
                    pb={2}
                    sx={{ borderBottom: index < 3 ? '1px solid' : 'none', borderColor: 'divider' }}
                  >
                    <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.light' }}>
                      {item.user.charAt(0)}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="body2" fontWeight={500}>
                        {item.activity}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.time} • By {item.user}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <AddProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onProductAdded={fetchProducts}
      />
    </Box>
  );
};

export default Dashboard;