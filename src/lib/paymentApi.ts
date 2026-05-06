import { getToken, clearAuth, API_URL } from '@/utils/auth';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers = {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        clearAuth();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json();
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

export interface PaymentResponse {
    id: string;
    amount: number;
    status: PaymentStatus;
    qrCode: string;
    gatewayRef: string;
    expiresAt: string;
    customerName: string;
    phone: string;
    email: string;
    createdAt: string;
}

export const paymentApi = {
    createPayment: async (data: {
        amount: number;
        customerName: string;
        phone: string;
        email: string;
    }): Promise<{ data: PaymentResponse }> => {
        return fetchWithAuth('/payments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getPayments: async (page = 1, limit = 20): Promise<{ data: { payments: PaymentResponse[] } }> => {
        return fetchWithAuth(`/payments?page=${page}&limit=${limit}`);
    },

    getPaymentStatus: async (id: string): Promise<{ data: { status: PaymentStatus } }> => {
        return fetchWithAuth(`/payments/${id}/status`);
    },

    simulateSuccess: async (id: string): Promise<void> => {
        return fetchWithAuth(`/payments/${id}/simulate-success`, {
            method: 'POST',
            body: JSON.stringify({}),
        });
    },

    simulateFailure: async (id: string): Promise<void> => {
        return fetchWithAuth(`/payments/${id}/simulate-failure`, {
            method: 'POST',
            body: JSON.stringify({}),
        });
    },
};
