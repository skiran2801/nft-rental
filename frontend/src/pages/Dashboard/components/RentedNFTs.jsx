import React, { useState, useEffect } from 'react';
import { Card, Typography, Alert, Spin, Row, Col } from 'antd';
import NFTCard from '../../../components/shared/NFTCard';
import contractService from '../../../services/contractService';

const { Title } = Typography;

const RentedNFTs = ({ walletAddress }) => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRentals = async () => {
        // Debug log for wallet address
        console.log('Current wallet address:', walletAddress);
        
        if (!walletAddress) {
            console.warn('No wallet address provided');
            setError('Please connect your wallet to view your rentals');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            console.log('Initializing contract service...');
            await contractService.ensureInitialized();
            
            console.log('Fetching rentals for wallet:', walletAddress);
            const userRentals = await contractService.getUserRentals(walletAddress);
            
            // Ensure uniqueness of rentals
            const uniqueRentals = userRentals.reduce((acc, rental) => {
                const key = `${rental.nftContract}-${rental.tokenId}`;
                if (!acc[key]) {
                    acc[key] = rental;
                }
                return acc;
            }, {});
            
            const processedRentals = Object.values(uniqueRentals);
            console.log('Unique rentals found:', processedRentals.length);
            
            setRentals(processedRentals);
            setLoading(false);
        } catch (err) {
            console.error('Detailed error in fetchRentals:', {
                message: err.message,
                stack: err.stack,
                walletAddress: walletAddress
            });
            setError('Failed to fetch your rentals: ' + err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('RentedNFTs component mounted/updated with wallet:', walletAddress);
        fetchRentals();
        
        // Optional: Set up an interval to refresh rentals periodically
        const interval = setInterval(fetchRentals, 30000); // Refresh every 30 seconds
        
        return () => clearInterval(interval);
    }, [walletAddress]);

    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                    <p>Loading your rented NFTs...</p>
                    <p style={{fontSize: '12px', color: 'gray'}}>Wallet: {walletAddress}</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <Title level={4}>Your Rented NFTs</Title>
                <Alert 
                    message={error} 
                    type="error" 
                    showIcon 
                    description={`Wallet Address: ${walletAddress}`}
                />
            </Card>
        );
    }

    if (!rentals || rentals.length === 0) {
        return (
            <Card>
                <Title level={4}>Your Rented NFTs</Title>
                <Alert
                    message="No Rentals Found"
                    description={
                        <div>
                            <p>You haven't rented any NFTs yet.</p>
                            <p style={{fontSize: '12px'}}>Wallet Address: {walletAddress}</p>
                        </div>
                    }
                    type="info"
                    showIcon
                />
            </Card>
        );
    }

    return (
        <Card>
            <Title level={4}>Your Rented NFTs</Title>
            <div style={{marginBottom: '16px'}}>
                <small>Connected Wallet: {walletAddress}</small>
            </div>
            <Row gutter={[16, 16]}>
                {rentals.map((rental) => {
                    // Create a truly unique key combining all unique identifiers
                    const uniqueKey = `${rental.nftContract}-${rental.tokenId}-${rental.startTime}`;
                    return (
                        <Col 
                            xs={24} 
                            sm={12} 
                            md={8} 
                            lg={6} 
                            key={uniqueKey}
                        >
                            <NFTCard
                                nft={rental}
                                showRentalInfo={true}
                                isRented={true}
                                uniqueId={uniqueKey} // Pass unique ID to NFTCard
                            />
                        </Col>
                    );
                })}
            </Row>
        </Card>
    );
};

export default RentedNFTs;
