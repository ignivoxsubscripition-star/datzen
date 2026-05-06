'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Payment } from '../helpers';
import { paymentApi } from '@/lib/paymentApi';

export type CreatePaymentInput = {
    amount: string;
    name: string;
    phone: string;
    email: string;
};

export function usePayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [checkingId, setCheckingId] = useState<string | null>(null);

    const refreshPayments = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const response = await paymentApi.getPayments();
            const mapped: Payment[] = response.data.payments.map((p) => ({
                id: p.id,
                amount: p.amount,
                status: p.status,
                name: p.customerName,
                phone: p.phone,
                email: p.email,
                createdAt: p.createdAt,
            }));
            setPayments(mapped);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    const createPayment = useCallback(async (input: CreatePaymentInput): Promise<any> => {
        setIsCreating(true);
        try {
            const response = await paymentApi.createPayment({
                amount: Number(input.amount),
                customerName: input.name.trim(),
                phone: input.phone.trim(),
                email: input.email.trim(),
            });
            
            const p = response.data;
            const next: Payment = {
                id: p.id,
                amount: p.amount,
                status: p.status,
                name: p.customerName,
                phone: p.phone,
                email: p.email,
                createdAt: p.createdAt,
            };
            
            setPayments((prev) => [next, ...prev]);
            return p; // Returning the full response which includes qrCode
        } finally {
            setIsCreating(false);
        }
    }, []);

    const checkStatus = useCallback(async (id: string) => {
        setCheckingId(id);
        try {
            const response = await paymentApi.getPaymentStatus(id);
            const newStatus = response.data.status;
            
            setPayments((prev) =>
                prev.map((payment) =>
                    payment.id === id
                        ? { ...payment, status: newStatus }
                        : payment,
                ),
            );
        } catch (error) {
            console.error('Failed to check status:', error);
        } finally {
            setCheckingId(null);
        }
    }, []);

    useEffect(() => {
        refreshPayments();
    }, [refreshPayments]);

    return {
        payments,
        isCreating,
        isRefreshing,
        checkingId,
        createPayment,
        refreshPayments,
        checkStatus,
    };
}
