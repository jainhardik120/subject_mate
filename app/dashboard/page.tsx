"use client"

import useSigner from '@/app/state';
import Link from 'next/link';
import React, { useState } from 'react'; // Assuming you're using React Router for navigation
import { useRouter } from "next/navigation";


const Dashboard: React.FC = () => {
    const { token } = useSigner();
    return (
        <>
            {token}
        </>
    );
};

export default Dashboard;
