'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Handle URL errors or callbacks (e.g. if redirected because of auth failure)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setStatus('error');
      if (errorParam === 'CredentialsSignin') {
        setMessage('Invalid email or password. Please try again.');
      } else {
        setMessage(errorParam);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setStatus('loading');
    setMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setStatus('error');
        setMessage(result.error || 'Authentication failed. Please check your credentials.');
      } else {
        const session = await getSession();
        const redirectPath = session?.user?.role === 'ADMIN' || session?.user?.role === 'EDITOR'
          ? '/admin'
          : '/portal';

        setStatus('success');
        setMessage('Login successful. Redirecting you...');
        // Refresh session and redirect
        router.push(redirectPath);
        router.refresh();
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to log in. Please check your connection.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--white)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-border)', boxShadow: 'var(--shadow-md)', maxWidth: '450px', width: '100%' }}>
      <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px' }}>
        Member Login
      </h3>
      <p style={{ color: 'var(--gray-mid)', fontSize: '0.88rem', marginBottom: '24px' }}>
        Log in to access your dashboard, profile, and directories.
      </p>

      {status === 'error' && (
        <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
          {message}
        </div>
      )}

      {status === 'success' && (
        <div className="alert alert-success" style={{ marginBottom: '24px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
            disabled={status === 'loading' || status === 'success'}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label htmlFor="password" className="form-label" style={{ marginBottom: 0 }}>Password</label>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '500' }}>
              Forgot password? Contact Admin
            </span>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
            disabled={status === 'loading' || status === 'success'}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Verifying Account...' : 'Log In'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--gray-mid)' }}>
        New to SSE?{' '}
        <Link href="/register" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'underline' }}>
          Create an account here
        </Link>
      </div>
    </div>
  );
}
