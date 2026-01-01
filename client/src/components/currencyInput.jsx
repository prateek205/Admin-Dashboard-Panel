import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { CurrencyRupee as CurrencyRupeeIcon } from '@mui/icons-material';

const CurrencyInput = ({ 
  value, 
  onChange, 
  label = 'Price', 
  name = 'price',
  required = false,
  fullWidth = true,
  margin = 'normal',
  ...props 
}) => {
  const handleChange = (e) => {
    let rawValue = e.target.value;
    
    // Remove all non-numeric characters except decimal point
    rawValue = rawValue.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = rawValue.split('.');
    if (parts.length > 2) {
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      rawValue = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    onChange({ target: { name, value: rawValue } });
  };

  const formatDisplay = (value) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    // Format with Indian numbering system
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  return (
    <TextField
      label={label}
      name={name}
      value={formatDisplay(value)}
      onChange={handleChange}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CurrencyRupeeIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        inputProps: {
          inputMode: 'decimal',
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
      {...props}
    />
  );
};

export default CurrencyInput;