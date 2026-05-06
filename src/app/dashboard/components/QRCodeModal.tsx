import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, QrCode, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from './helpers';
import type { QRPayload } from './hooks/useQRcode';
import { paymentApi } from '@/lib/paymentApi';

type QRCodeModalProps = {
    qr: QRPayload | null;
    onClose: () => void;
};

export function QRCodeModal({ qr, onClose }: QRCodeModalProps) {
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        if (!qr) return;
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [qr, onClose]);

    if (!qr) return null;

    const isPaid = qr.status === 'PAID';
    const isFailed = ['FAILED', 'CANCELLED', 'EXPIRED'].includes(qr.status);
    const isPending = qr.status === 'PENDING';

    const handleSimulate = async (type: 'success' | 'failure') => {
        setIsSimulating(true);
        try {
            if (type === 'success') {
                await paymentApi.simulateSuccess(qr.paymentId);
            } else {
                await paymentApi.simulateFailure(qr.paymentId);
            }
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                >
                    <X className="h-3.5 w-3.5" />
                </button>

                <div className="px-6 pb-2 pt-7 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[var(--color-primary)]">
                        <QrCode className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                        {isPaid ? 'Payment Received' : isFailed ? 'Payment Failed' : 'Scan to Pay'}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        {isPaid
                            ? 'The customer has completed this payment.'
                            : isFailed
                            ? 'This payment request has failed or expired.'
                            : 'Open any UPI app and scan the QR below.'}
                    </p>
                </div>

                <div className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                Amount
                            </p>
                            <p className="mt-0.5 text-lg font-semibold text-slate-900">
                                {formatCurrency(qr.amount)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                Customer
                            </p>
                            <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
                                {qr.name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6">
                    <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                        {isPaid ? (
                            <div className="flex flex-col items-center gap-2 text-emerald-600">
                                <CheckCircle2 className="h-12 w-12" />
                                <p className="text-sm font-semibold">Success</p>
                            </div>
                        ) : isFailed ? (
                            <div className="flex flex-col items-center gap-2 text-rose-600">
                                <AlertCircle className="h-12 w-12" />
                                <p className="text-sm font-semibold">{qr.status}</p>
                            </div>
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden">
                                {qr.qrCode ? (
                                    <img src={qr.qrCode} alt="Payment QR Code" className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-500">
                                        <QrCode className="h-16 w-16" />
                                        <p className="text-xs">Generating QR...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 pb-4 pt-3">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                            Order ID
                        </span>
                        <span className="font-mono text-[11px] text-slate-600">{qr.paymentId}</span>
                    </div>
                </div>

                {isPending && (
                    <div className="px-6 pb-4">
                        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-amber-200 bg-amber-50/50 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                                Developer Tools
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                                    onClick={() => handleSimulate('success')}
                                    disabled={isSimulating}
                                >
                                    {isSimulating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Simulate Success'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-rose-200 bg-white text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                                    onClick={() => handleSimulate('failure')}
                                    disabled={isSimulating}
                                >
                                    {isSimulating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Simulate Failure'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-3">
                    {isPending && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Waiting for payment…
                        </span>
                    )}
                    <Button size="sm" variant="outline" className="ml-auto" onClick={onClose}>
                        {(isPaid || isFailed) ? 'Done' : 'Close'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
