export const truncateAddress = (str, n) => {
  return str.substr(0, 6) + "..." + str.substr(str.length - 4, str.length - 1);
};
