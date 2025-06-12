import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const isUserAuthenticated = await isAuthenticated();
        if (!isUserAuthenticated) redirect("/sign-in");
    return (
        <section>
            {children}
        </section>
    );
}