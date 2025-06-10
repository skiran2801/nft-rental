import { NFTRentalABI } from './abis/NFTRental.json';

export const validateContractSetup = async (web3, contractAddress) => {
    console.log('\n=== Contract Validation Start ===');
    
    // Check contract existence and bytecode
    const code = await web3.eth.getCode(contractAddress);
    console.log('Contract Address:', contractAddress);
    console.log('Has deployed code:', code !== '0x');
    console.log('Bytecode length:', code.length);

    // Log all available functions from ABI
    const functionSelectors = NFTRentalABI
        .filter(item => item.type === 'function')
        .map(item => {
            const signature = `${item.name}(${item.inputs.map(i => i.type).join(',')})`;
            const selector = web3.eth.abi.encodeFunctionSignature(signature);
            return { name: item.name, signature, selector };
        });

    console.log('\nABI Function Selectors:');
    functionSelectors.forEach(func => {
        console.log(`${func.name}:`);
        console.log(`  Signature: ${func.signature}`);
        console.log(`  Selector: ${func.selector}`);
    });

    // Try to call a view function (assuming one exists)
    const contract = new web3.eth.Contract(NFTRentalABI, contractAddress);
    
    // Test each view function
    console.log('\nTesting View Functions:');
    for (const func of functionSelectors) {
        try {
            if (contract.methods[func.name]) {
                console.log(`\nTesting ${func.name}:`);
                console.log('Function exists in ABI');
                
                // Get function details
                const method = contract.methods[func.name];
                console.log('Method signature:', method._method?.signature);
                
                // Only try to call if it's a view function
                if (NFTRentalABI.find(x => x.name === func.name)?.stateMutability === 'view') {
                    await method().call();
                    console.log('✓ Call successful');
                } else {
                    console.log('(Skipped: not a view function)');
                }
            }
        } catch (error) {
            console.log('✗ Call failed:', {
                error: error.message,
                signature: error.signature,
                selector: func.selector
            });
        }
    }

    // Compare deployed bytecode with local compiled bytecode if available
    try {
        const compiledBytecode = require('../artifacts/contracts/NFTRental.sol/NFTRental.json').bytecode;
        console.log('\nBytecode Comparison:');
        console.log('Deployed matches compiled:', code === compiledBytecode);
    } catch (error) {
        console.log('\nCould not compare bytecode:', error.message);
    }

    console.log('\n=== Contract Validation End ===');
}; 