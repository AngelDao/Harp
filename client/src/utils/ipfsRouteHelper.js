export const pathFinder = () => {
  let ipfsHash = "fakeroute/";
  if (window.location.pathname.indexOf("/ipfs/") == 0) {
    ipfsHash = window.location.pathname;
  }
  return ipfsHash;
};
