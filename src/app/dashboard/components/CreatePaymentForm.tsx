'use client';

import { useState } from 'react';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CreatePaymentInput } from './hooks/usePayments';
import type { Payment } from './helpers';

type CreatePaymentFormProps = {
    isCreating: boolean;
    onCreate: (input: CreatePaymentInput) => Promise<any>;
    onSuccess: (payment: any) => void;
};

const INITIAL: CreatePaymentInput = { amount: '', name: '', phone: '', email: '' };

export function CreatePaymentForm({ isCreating, onCreate, onSuccess }: CreatePaymentFormProps) {
    const [form, setForm] = useState<CreatePaymentInput>(INITIAL);

    const update = (key: keyof CreatePaymentInput, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const created = await onCreate(form);
        onSuccess(created);
        setForm(INITIAL);
    };

    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <header className="mb-5">
                <h2 className="text-base font-semibold text-slate-900">New Payment</h2>
                <p className="mt-1 text-xs text-slate-500">
                    Generate a UPI payment request for a customer.
                </p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <Field
                    label="Amount (INR)"
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(value) => update('amount', value)}
                    min={1}
                />
                <Field
                    label="Customer Name"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(value) => update('name', value)}
                />
                <Field
                    label="Phone"
                    type="tel"
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={(value) => update('phone', value)}
                />
                <Field
                    label="Email"
                    type="email"
                    placeholder="customer@email.com"
                    value={form.email}
                    onChange={(value) => update('email', value)}
                />

                <Button type="submit" className="w-full" isLoading={isCreating}>
                    {!isCreating && <QrCode className="mr-2 h-4 w-4" />}
                    Create &amp; Pay
                </Button>
            </form>
        </section>
    );
}

type FieldProps = {
    label: string;
    type: 'text' | 'email' | 'tel' | 'number';
    placeholder: string;
    value: string;
    min?: number;
    onChange: (value: string) => void;
};

function Field({ label, type, placeholder, value, min, onChange }: FieldProps) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                required
                min={min}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
        </label>
    );
}
