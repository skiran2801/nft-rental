import React, { useState, useEffect } from 'react';
import { Card, Typography, Alert, Spin } from 'antd';
import contractService from '../../../services/contractService';

const { Title } = Typography;

const TransactionHistory = ({ walletAddress }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (!walletAddress) {
                setError('Please connect your wallet to view transaction history');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // For now, display a "coming soon" message
                setLoading(false);
            } catch (err) {
                console.error('Error fetching transaction history:', err);
                setError('Transaction history feature is coming soon');
                setLoading(false);
            }
        };

        init();
    }, [walletAddress]);

    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                    <p>Loading transaction history...</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <Title level={4}>Transaction History</Title>
                <Alert
                    message="Coming Soon!"
                    description="Transaction history feature is under development. Check back soon!"
                    type="info"
                    showIcon
                />
            </Card>
        );
    }

    return (
        <Card>
            <Title level={4}>Transaction History</Title>
            <Alert
                message="Coming Soon!"
                description="Transaction history feature is under development. Check back soon!"
                type="info"
                showIcon
            />
        </Card>
    );
};

export default TransactionHistory;
