import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/forms/LoginForm';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { authOptions } from '@/lib/auth';

const LoadingFallback = () => (
  <div
    style={{
      backgroundColor: 'var(--white)',
      padding: '40px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--gray-border)',
      boxShadow: 'var(--shadow-md)',
      textAlign: 'center',
    }}
  >
    <div className="spinner" style={{ margin: '0 auto 20px' }} />
    <p style={{ color: 'var(--gray-mid)', fontSize: '0.9rem' }}>Loading...</p>
  </div>
);

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === 'ADMIN' || session?.user?.role === 'EDITOR') {
    redirect('/admin');
  }

  if (session) {
    redirect('/portal');
  }

  return (
    <section
      className="section section-alt"
      style={{
        minHeight: 'calc(100vh - var(--header-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <AnimatedSection direction="up" style={{ width: '100%', maxWidth: '450px' }}>
          <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
          </Suspense>
        </AnimatedSection>
      </div>
    </section>
  );
}
