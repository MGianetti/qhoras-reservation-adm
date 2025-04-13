const phoneMask = (value) => {
  if (!value) return "";
  const digitsOnly = value.replace(/\D/g, "");
  const withAreaCode = digitsOnly.replace(/^(\d{2})(\d)/g, "($1) $2");
  const formatted = withAreaCode.replace(/(\d)(\d{4})$/, "$1-$2");
  return formatted;
};

export default phoneMask;
