export const checkEnvVariables = () => {
    const requiredVars = [
        'REACT_APP_WEB3_STORAGE_TOKEN',
        'REACT_APP_CONTRACT_ADDRESS'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.error('Missing environment variables:', missing);
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return true;
};

export const testEnvVariables = () => {
  console.log('Environment Variables Test:');
  console.log('NFT_STORAGE_TOKEN:', !!process.env.REACT_APP_NFT_STORAGE_TOKEN);
  console.log('CONTRACT_ADDRESS:', !!process.env.REACT_APP_CONTRACT_ADDRESS);
  console.log('NFT_CONTRACT_ADDRESS:', !!process.env.REACT_APP_NFT_CONTRACT_ADDRESS);
  
  // Check if variables are properly formatted
  const envVars = {
    NFT_STORAGE_TOKEN: process.env.REACT_APP_NFT_STORAGE_TOKEN,
    CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS,
    NFT_CONTRACT_ADDRESS: process.env.REACT_APP_NFT_CONTRACT_ADDRESS
  };

  return envVars;
}; 