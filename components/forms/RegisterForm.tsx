'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PartyPopper } from 'lucide-react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    state: '',
    specialty: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [regNum, setRegNum] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setRegNum(data.membershipNumber);
        setMessage(data.message || 'Registration successful!');
      } else {
        setStatus('error');
        setMessage(data.error || 'An error occurred. Please check your details and try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to register. Please check your network connection.');
    }
  };

  const specialties = [
    'Frontend Development',
    'Backend Development',
    'Full-Stack Development',
    'Mobile App Development',
    'DevOps & Infrastructure',
    'Cybersecurity Systems',
    'Data Engineering / AI',
    'Cloud Systems Engineering',
    'Embedded Systems & IoT',
    'Software Quality & QA',
    'Academic Research & CS',
    'Student / Aspiring Engineer',
  ];

  if (status === 'success') {
    return (
      <div style={{ backgroundColor: 'var(--white)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-border)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
        <PartyPopper style={{ width: '48px', height: '48px', margin: '0 auto 20px', color: 'var(--accent)' }} />
        <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '15px' }}>
          Registration Submitted!
        </h3>
        <p style={{ color: 'var(--gray-dark)', lineHeight: '1.7', marginBottom: '24px' }}>
          {message}
        </p>

        {regNum && (
          <div style={{ backgroundColor: 'var(--gray-light)', border: '1px dashed var(--accent)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-mid)', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>Your Membership ID</span>
            <strong style={{ fontSize: '1.3rem', color: 'var(--primary)', letterSpacing: '0.5px' }}>{regNum}</strong>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--gray-border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-mid)', marginBottom: '15px' }}>
            Once the board approves your credentials, you will receive login details. You can try logging in now:
          </p>
          <Link href="/login" className="btn btn-primary btn-sm">
            Go to Member Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--white)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-border)', boxShadow: 'var(--shadow-md)' }}>
      <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px' }}>
        Apply for Membership
      </h3>
      <p style={{ color: 'var(--gray-mid)', fontSize: '0.88rem', marginBottom: '24px' }}>
        Join the society of software engineering leaders in Nigeria. Fields with * are required.
      </p>

      {status === 'error' && (
        <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
          <div style={{ marginBottom: 0 }}>
            <label htmlFor="firstName" className="form-label">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-control"
              required
              disabled={status === 'loading'}
            />
          </div>
          <div style={{ marginBottom: 0 }}>
            <label htmlFor="lastName" className="form-label">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-control"
              required
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div className="form-group">
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

        <div className="form-group">
          <label htmlFor="password" className="form-label">Choose Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
            minLength={6}
            disabled={status === 'loading'}
          />
        </div>

        <div className="grid grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
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
          <div style={{ marginBottom: 0 }}>
            <label htmlFor="state" className="form-label">State of Residence</label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="e.g. Lagos"
              value={formData.state}
              onChange={handleChange}
              className="form-control"
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="specialty" className="form-label">Primary Specialty</label>
          <select
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className="form-control"
            disabled={status === 'loading'}
          >
            <option value="">-- Select Specialty --</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={status === 'loading'}
          style={{ marginTop: '30px' }}
        >
          {status === 'loading' ? 'Submitting Application...' : 'Register as Member'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--gray-mid)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'underline' }}>
          Log In here
        </Link>
      </div>
    </div>
  );
}
