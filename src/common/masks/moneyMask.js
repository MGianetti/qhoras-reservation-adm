const moneyMask = (value) => {
    if (value === undefined || value === null) return 'R$ 0,00';

    const numericValue = typeof value === 'number' 
        ? value * 100
        : parseInt(value.toString().replace(/\D/g, ''), 10) || 0;

    return `R$ ${(numericValue / 100).toFixed(2).replace('.', ',')}`;
};

export default moneyMask;