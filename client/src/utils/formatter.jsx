export const formatIndianRupees = (amount, options = {}) => {
  if (amount === undefined || amount === null) return '₹0';
  
  const {
    compact = false,
    decimals = 2,
    showSymbol = true,
  } = options;

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return '₹0';

  if (compact) {
    if (numAmount >= 10000000) {
      return `${showSymbol ? '₹' : ''}${(numAmount / 10000000).toFixed(1)}Cr`;
    }
    if (numAmount >= 100000) {
      return `${showSymbol ? '₹' : ''}${(numAmount / 100000).toFixed(1)}L`;
    }
    if (numAmount >= 1000) {
      return `${showSymbol ? '₹' : ''}${(numAmount / 1000).toFixed(1)}K`;
    }
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numAmount);

  return `${showSymbol ? '₹' : ''}${formatted}`;
};

export const formatNumber = (number, decimals = 0) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const formatDate = (dateString, format = 'dd MMM yyyy') => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};