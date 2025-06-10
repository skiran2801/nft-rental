import axios from 'axios';

class StorageService {
  constructor() {
    // Debug environment variables
    console.log('Environment Variables Check:');
    console.log('PINATA_API_KEY exists:', !!process.env.REACT_APP_PINATA_API_KEY);
    console.log('PINATA_SECRET_KEY exists:', !!process.env.REACT_APP_PINATA_SECRET_KEY);

    // Clean and validate credentials
    this.apiKey = process.env.REACT_APP_PINATA_API_KEY?.replace(/\s/g, '');
    this.secretKey = process.env.REACT_APP_PINATA_SECRET_KEY?.replace(/\s/g, '');
    this.endpoint = 'https://api.pinata.cloud';
    this.isInitialized = false;

    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.endpoint,
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to add auth headers
    this.client.interceptors.request.use((config) => {
      config.headers['pinata_api_key'] = this.apiKey;
      config.headers['pinata_secret_api_key'] = this.secretKey;
      return config;
    });
  }

  async initialize() {
    if (this.isInitialized) return true;
    
    try {
      if (!this.apiKey || !this.secretKey) {
        throw new Error('Pinata credentials are missing or invalid');
      }

      // Test authentication with simple ping
      const response = await this.client.get('/data/testAuthentication');
      
      if (response.status === 200) {
        console.log('Pinata authentication successful');
        this.isInitialized = true;
        return true;
      }
      
      throw new Error('Failed to authenticate with Pinata');
    } catch (error) {
      console.error('Storage service initialization failed:', error.response || error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Pinata API keys. Please check your credentials.');
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. Please check your internet connection.');
      }
      
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async testConnection() {
    try {
      console.log('Testing Pinata connection...');
      
      // First verify we have credentials
      if (!this.apiKey || !this.secretKey) {
        throw new Error('Missing Pinata credentials');
      }

      console.log('Making authentication request...');
      const response = await axios.get(`${this.endpoint}/data/testAuthentication`, {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      });

      if (response.status === 401) {
        console.error('Authentication failed - invalid credentials');
        throw new Error('Invalid Pinata credentials. Please check your API keys.');
      }

      if (!response.data || response.status !== 200) {
        console.error('Unexpected response:', response.data);
        throw new Error(`Unexpected response from Pinata: ${response.status}`);
      }

      console.log('Pinata connection successful:', response.data);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid Pinata credentials. Please check your API keys.');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Could not connect to Pinata. Please check your internet connection.');
      }
      console.error('Pinata connection error:', error);
      throw new Error(`Connection test failed: ${error.message}`);
    }
  }

  async uploadFile(file) {
    try {
      console.log('Attempting to upload file to Pinata:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Log the request details
      console.log('Sending request to Pinata API...');
      
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
        body: formData
      });

      // Log the response status
      console.log('Pinata API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Pinata upload failed:', errorData);
        throw new Error(`Failed to upload to Pinata: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Pinata upload successful:', {
        IpfsHash: result.IpfsHash,
        PinSize: result.PinSize,
        Timestamp: result.Timestamp
      });

      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async uploadJson(jsonData) {
    try {
      console.log('Attempting to upload JSON to Pinata:', jsonData);

      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
        body: JSON.stringify(jsonData)
      });

      console.log('Pinata API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Pinata JSON upload failed:', errorData);
        throw new Error(`Failed to upload JSON to Pinata: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Pinata JSON upload successful:', {
        IpfsHash: result.IpfsHash,
        PinSize: result.PinSize,
        Timestamp: result.Timestamp
      });

      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error);
      throw new Error(`Failed to upload JSON: ${error.message}`);
    }
  }

  async uploadNFT(image, name, description, attributes = []) {
    try {
      // 1. First upload the image
      const imageCid = await this.uploadFile(image);
      
      // 2. Create and upload metadata
      const metadata = {
        name,
        description,
        image: this.getIPFSUrl(imageCid, image.name),
        attributes
      };
      
      const metadataCid = await this.uploadJson(metadata);
      return metadataCid;
    } catch (error) {
      console.error('Error uploading NFT:', error);
      throw new Error(error.message || 'Failed to upload NFT');
    }
  }

  getIPFSUrl(cid, fileName = '') {
    if (!cid) throw new Error('CID is required');
    // Format for Pinata gateway - don't include filename in the path
    return `ipfs://${cid}`;
  }

  getHttpUrl(cid, fileName = '') {
    if (!cid) throw new Error('CID is required');
    // Format for Pinata gateway - don't include filename in the path
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }

  async retrieveFile(cid) {
    try {
      const res = await fetch(`https://amethyst-abundant-chinchilla-818.mypinata.cloud/ipfs/${cid}`);
      if (!res.ok) {
        throw new Error(`Failed to get ${cid}`);
      }
      return await res.blob();
    } catch (error) {
      console.error('Error retrieving file:', error);
      throw new Error('Failed to retrieve file from IPFS');
    }
  }

  async testNFTUpload(file) {
    try {
      console.log('1. Uploading image...');
      const imageCid = await this.uploadFile(file);
      console.log('Image CID:', imageCid);

      console.log('2. Creating metadata...');
      const metadata = {
        name: 'Test NFT',
        description: 'This is a test NFT upload',
        image: this.getIPFSUrl(imageCid, file.name),
        attributes: [
          {
            trait_type: 'Test',
            value: 'true'
          }
        ]
      };

      console.log('3. Uploading metadata...');
      const metadataCid = await this.uploadJson(metadata);
      console.log('Metadata CID:', metadataCid);

      // Try to retrieve both files
      console.log('4. Verifying uploads...');
      await this.retrieveFile(imageCid);
      await this.retrieveFile(metadataCid);

      return {
        imageCid,
        metadataCid,
        imageUrl: this.getHttpUrl(imageCid, file.name),
        metadataUrl: this.getHttpUrl(metadataCid)
      };
    } catch (error) {
      console.error('NFT Upload Test Failed:', error);
      throw error;
    }
  }

  // Verify Pinata credentials
  async verifyPinataConnection() {
    try {
      console.log('Verifying Pinata API connection...');
      
      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        }
      });

      const result = await response.json();
      console.log('Pinata authentication result:', result);

      return response.ok;
    } catch (error) {
      console.error('Pinata authentication failed:', error);
      return false;
    }
  }
}

const storageService = new StorageService();
export default storageService; 