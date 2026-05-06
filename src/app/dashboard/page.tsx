'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePaymentForm } from './components/CreatePaymentForm';
import { DashboardStats } from './components/DashboardStats';
import { PaymentHistoryList } from './components/PaymentHistoryList';
import { QRCodeModal } from './components/QRCodeModal';
import { PageHeader } from './components/shared/PageHeader';
import { usePayments } from './components/hooks/usePayments';
import { useQRCode } from './components/hooks/useQRcode';
import { getToken, getUser, clearAuth } from '@/utils/auth';

export default function DashboardPage() {
    // ── ALL hooks at the top — never conditionally ────────────────────────────
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const {
        payments,
        isCreating,
        isRefreshing,
        checkingId,
        createPayment,
        refreshPayments,
        checkStatus,
    } = usePayments();

    const { qr, openQR, closeQR } = useQRCode();

    const stats = useMemo(() => {
        const totalOrders = payments.length;
        const totalVolume = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const paid = payments.filter((payment) => payment.status === 'PAID').length;
        const pending = payments.filter((payment) => payment.status === 'PENDING').length;
        return { totalOrders, totalVolume, paid, pending };
    }, [payments]);

    // ── Auth guard ────────────────────────────────────────────────────────────
    useEffect(() => {
        const token = getToken();
        if (!token) {
            clearAuth();
            router.replace('/login');
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // ── Resolve display name from stored user ─────────────────────────────────
    const user = getUser();
    const displayName = user?.name ?? 'Merchant';

    // ── Render control — AFTER all hooks ──────────────────────────────────────
    if (!isAuthenticated) return null;

    return (
        <section className="px-4 py-8 sm:px-6 md:px-8 md:py-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <PageHeader
                    eyebrow="Merchant Portal"
                    title="Payment Dashboard"
                    description="Create payments and monitor recent transactions."
                    actions={
                        <p className="text-sm text-slate-500">
                            Welcome, <span className="font-medium text-slate-900">{displayName}</span>
                        </p>
                    }
                />

                <DashboardStats stats={stats} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <CreatePaymentForm
                            isCreating={isCreating}
                            onCreate={createPayment}
                            onSuccess={(payment) =>
                                openQR(payment, { onSettled: () => refreshPayments() })
                            }
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <PaymentHistoryList
                            payments={payments}
                            isRefreshing={isRefreshing}
                            checkingId={checkingId}
                            onRefresh={refreshPayments}
                            onCheckStatus={checkStatus}
                        />
                    </div>
                </div>
            </div>

            <QRCodeModal qr={qr} onClose={closeQR} />
        </section>
    );
}
