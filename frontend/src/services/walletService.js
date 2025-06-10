import { NETWORKS } from '../utils/networkConfig';

class WalletService {
    constructor() {
        this.address = null;
        this.web3 = null;
        this.testAccounts = [
            {
                address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
            },
            {
                address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
            }
            // Add more test accounts as needed
        ];
        this.networkChecked = false;
    }

    async connect() {
        try {
            if (!window.ethereum) {
                throw new Error('Please install MetaMask');
            }

            // Setup network if needed
            await this.setupNetwork();

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            this.address = accounts[0];
            return this.address;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    async setupNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: NETWORKS.hardhat.chainId }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: NETWORKS.hardhat.chainId,
                                chainName: NETWORKS.hardhat.chainName,
                                nativeCurrency: NETWORKS.hardhat.nativeCurrency,
                                rpcUrls: NETWORKS.hardhat.rpcUrls,
                            },
                        ],
                    });
                } catch (addError) {
                    throw new Error('Failed to add Hardhat network to MetaMask');
                }
            } else {
                throw new Error('Failed to switch to Hardhat network');
            }
        }
    }

    async importTestAccount(index) {
        try {
            const account = this.testAccounts[index];
            if (!account) {
                throw new Error('Invalid test account index');
            }

            // First ensure we're on the correct network
            await this.setupNetwork();

            throw new Error(
                'To import the test account:\n\n' +
                '1. Open MetaMask\n' +
                '2. Click the account icon\n' +
                '3. Select "Import Account"\n' +
                '4. Paste this private key:\n' +
                `${account.privateKey}\n\n` +
                'After importing, click the Import button again.'
            );

        } catch (error) {
            console.error('Error importing test account:', error);
            throw error;
        }
    }

    async disconnect() {
        this.address = null;
        localStorage.removeItem('walletAddress');
        return {
            address: null,
            connected: false
        };
    }

    async getBalance() {
        if (!this.address) throw new Error('Wallet not connected');
        
        try {
            const balance = await this.web3.eth.getBalance(this.address);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            throw new Error(error.message || 'Failed to get wallet balance');
        }
    }

    isConnected() {
        return !!this.address;
    }

    getAddress() {
        return this.address;
    }

    // Helper method to get test accounts
    getTestAccounts() {
        return this.testAccounts;
    }
}

// Create instance and export
const walletService = new WalletService();
export default walletService;