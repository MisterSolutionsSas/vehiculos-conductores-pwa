// src/utils/formatters.js

export const formatPriceCOP = (value) => {
    if (typeof value !== 'number') return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };  