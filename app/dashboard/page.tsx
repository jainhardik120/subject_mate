"use client"

import useSigner from '@/app/state';
import React, { useEffect, useState } from 'react';
import RequestList, { GetRequestsResponse, Request as SwapRequest } from './RequestList';

const Dashboard: React.FC = () => {
    const { token, setToken } = useSigner();
    const [requests, setRequests] = useState<SwapRequest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/request', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data: GetRequestsResponse = await response.json();
                setRequests(data.requests);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <RequestList requests={requests} />
        </div>
    );
};

export default Dashboard;
