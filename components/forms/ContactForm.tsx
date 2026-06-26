'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/FeedbackProvider';

export default function ContactForm() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        toast.success('Thank you! Your message has been sent successfully. We will get back to you shortly.');
      } else {
        setStatus('error');
        toast.error(data.error || 'Something went wrong. Please check your inputs and try again.');
      }
    } catch {
      setStatus('error');
      toast.error('Failed to submit form. Please check your connection.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--white)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-border)', boxShadow: 'var(--shadow-md)' }}>
      <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '24px' }}>
        Send Us a Message
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className="grid grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
          <div style={{ marginBottom: 0 }}>
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
              disabled={status === 'loading'}
            />
          </div>
          <div style={{ marginBottom: 0 }}>
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="form-label">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            disabled={status === 'loading'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
            required
            disabled={status === 'loading'}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending Message...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}
