export const NETWORKS = {
  hardhat: {
    chainId: '0x7A69', // 31337 in hex
    chainName: 'Hardhat Network',
    nativeCurrency: {
      name: 'Hardhat Ether',
      symbol: 'hETH',
      decimals: 18
    },
    rpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrls: null
  }
};

export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider) {
    try {
      // First try to switch to the network
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: NETWORKS.hardhat.chainId }],
        });
        return true;
      } catch (switchError) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: NETWORKS.hardhat.chainId,
                chainName: NETWORKS.hardhat.chainName,
                nativeCurrency: NETWORKS.hardhat.nativeCurrency,
                rpcUrls: NETWORKS.hardhat.rpcUrls
              }],
            });
            return true;
          } catch (addError) {
            console.error('Error adding network:', addError);
            return false;
          }
        }
        throw switchError;
      }
    } catch (error) {
      console.error('Failed to setup network:', error);
      return false;
    }
  }
  return false;
}; 