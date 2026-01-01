import React from 'react';
import { Typography, Box } from '@mui/material';
import { CurrencyRupee as CurrencyRupeeIcon } from '@mui/icons-material';
import { formatIndianRupees } from '../utils/formatter';

const PriceDisplay = ({ 
  price, 
  variant = 'body1', 
  fontWeight = 400, 
  showIcon = true, 
  compact = false,
  decimals = 2,
  color = 'inherit',
  sx = {}
}) => {
  if (price === undefined || price === null) return null;

  const formattedPrice = formatIndianRupees(price, { compact, decimals, showSymbol: !showIcon });

  return (
    <Box display="flex" alignItems="center" gap={0.5} sx={sx}>
      {showIcon && (
        <CurrencyRupeeIcon 
          fontSize="inherit" 
          sx={{ 
            color: color !== 'inherit' ? color : 'text.secondary',
            fontSize: variant === 'h4' ? '1.5rem' : 
                     variant === 'h5' ? '1.25rem' : 
                     variant === 'h6' ? '1rem' : '0.875rem'
          }} 
        />
      )}
      <Typography variant={variant} fontWeight={fontWeight} color={color}>
        {formattedPrice.replace('₹', '')}
      </Typography>
    </Box>
  );
};

export const CompactPrice = ({ price, sx = {} }) => {
  return <PriceDisplay price={price} compact showIcon={false} sx={sx} />;
};

export const LargePrice = ({ price, sx = {} }) => {
  return <PriceDisplay price={price} variant="h4" fontWeight={700} sx={sx} />;
};

export default PriceDisplay;