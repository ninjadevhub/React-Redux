export function formatPercentage(source){
    if (isNaN(source))
      return 'N/A';
    return `${Number.parseFloat(source).toFixed(2)}%`;
};