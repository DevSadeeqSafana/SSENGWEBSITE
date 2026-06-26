'use client';

import React, { useState } from 'react';
import styles from '../layout/layout.module.css';
import { useToast } from '@/components/ui/FeedbackProvider';

export default function NewsletterForm() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Optional name field
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

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
        toast.success('Thank you for subscribing to our newsletter!');
      } else {
        setStatus('error');
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      toast.error('Failed to send request. Please check your network connection.');
    }
  };

  return (
    <div>
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
    </div>
  );
}
