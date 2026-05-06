'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PaymentStatus } from '../helpers';
import { paymentApi, PaymentResponse } from '@/lib/paymentApi';

export type QRPayload = {
    paymentId: string;
    amount: number;
    name: string;
    status: PaymentStatus;
    qrCode: string;
};

type StartPollingOptions = {
    onSettled?: (paymentId: string) => void;
};

export function useQRCode() {
    const [payload, setPayload] = useState<QRPayload | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const pollStatus = useCallback(async (paymentId: string, options: StartPollingOptions) => {
        try {
            const response = await paymentApi.getPaymentStatus(paymentId);
            const status = response.data.status;

            setPayload((prev) => {
                if (!prev || prev.paymentId !== paymentId) return prev;
                return { ...prev, status };
            });

            if (['PAID', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(status)) {
                stopPolling();
                options.onSettled?.(paymentId);
            }
        } catch (error) {
            console.error('Polling failed:', error);
        }
    }, [stopPolling]);

    const openQR = useCallback(
        (payment: PaymentResponse, options: StartPollingOptions = {}) => {
            stopPolling();

            setPayload({
                paymentId: payment.id,
                amount: payment.amount,
                name: payment.customerName,
                status: payment.status,
                qrCode: payment.qrCode,
            });

            // Start polling every 3 seconds
            intervalRef.current = setInterval(() => {
                pollStatus(payment.id, options);
            }, 3000);
        },
        [stopPolling, pollStatus],
    );

    const closeQR = useCallback(() => {
        stopPolling();
        setPayload(null);
    }, [stopPolling]);

    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    return {
        qr: payload,
        isOpen: payload !== null,
        openQR,
        closeQR,
    };
}
