'use client';

import React, { useState } from 'react';
import styles from '../layout/layout.module.css';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Optional name field
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setName('');
        setMessage('Thank you for subscribing to our newsletter!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to send request. Please check your network connection.');
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '10px', fontWeight: '500' }}>
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.footerNewsletterForm}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.footerNewsletterInput}
            required
            disabled={status === 'loading'}
            aria-label="Email address"
          />
          <button
            type="submit"
            className={styles.footerNewsletterBtn}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? '...' : 'Join'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '8px' }}>
          {message}
        </div>
      )}
    </div>
  );
}
