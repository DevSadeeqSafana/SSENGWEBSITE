import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/queries/events';
import { formatDateTime, formatPrice } from '@/lib/utils';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let event = null;
  try {
    event = await getEventBySlug(slug);
  } catch (error) {
    console.error('Failed to load event details:', error);
  }

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.start_date);
  const now = new Date();
  const isPast = startDate < now;
  
  const isDeadlinePassed = event.registration_deadline 
    ? new Date(event.registration_deadline) < now 
    : isPast;

  return (
    <div>
      {/* Banner */}
      <section 
        style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'var(--white)', 
          padding: '60px 0', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #1a2f7c 100%)',
          borderBottom: '4px solid var(--accent)'
        }}
      >
        <div className="container">
          <div style={{ marginBottom: '15px' }}>
            <Link 
              href="/events" 
              style={{ color: 'var(--accent-light)', fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              &larr; Back to Events Calendar
            </Link>
          </div>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
            {event.event_type}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: 'var(--white)' }}>
            {event.title}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', maxWidth: '800px' }}>
            {event.description}
          </p>
        </div>
      </section>

      {/* Main Details grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3" style={{ gridTemplateColumns: '2fr 1fr', gap: '50px' }}>
            {/* Left side: Body content */}
            <div>
              {event.featured_image_url && (
                <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '30px', boxShadow: 'var(--shadow-sm)' }}>
                  <Image
                    src={event.featured_image_url}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}

              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '20px', fontWeight: '700' }}>
                Event Details
              </h2>
              
              <div 
                style={{ 
                  lineHeight: '1.8', 
                  color: 'var(--gray-dark)', 
                  fontSize: '1.05rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
                dangerouslySetInnerHTML={{ __html: event.content || `<p>${event.description}</p>` }}
              />

              {event.venue_address && !event.is_virtual && (
                <div style={{ marginTop: '40px', padding: '24px', backgroundColor: 'var(--gray-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-border)' }}>
                  <h4 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '10px', fontWeight: '700' }}>Venue Address</h4>
                  <p style={{ color: 'var(--gray-dark)', fontSize: '0.95rem' }}>{event.venue_address}</p>
                </div>
              )}
            </div>

            {/* Right side: Sidebar Info Box */}
            <div>
              <div 
                style={{ 
                  backgroundColor: 'var(--gray-light)', 
                  border: '1px solid var(--gray-border)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '30px', 
                  position: 'sticky', 
                  top: '100px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '20px', fontWeight: '700', borderBottom: '1px solid var(--gray-border)', paddingBottom: '10px' }}>
                  Logistics & Schedule
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.95rem', gap: '4px' }}>
                    <span style={{ color: 'var(--gray-mid)', fontWeight: '500' }}>Date & Time:</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{formatDateTime(event.start_date)}</span>
                    {event.end_date && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-mid)' }}>to {formatDateTime(event.end_date)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--gray-mid)', fontWeight: '500' }}>Location:</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                      {event.is_virtual ? '💻 Virtual (Online)' : event.location}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--gray-mid)', fontWeight: '500' }}>Access Fee:</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>
                      {event.is_free ? 'Free' : formatPrice(event.ticket_price)}
                    </span>
                  </div>
                  {event.registration_deadline && (
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '2px' }}>
                      <span style={{ color: 'var(--gray-mid)', fontWeight: '500' }}>Register Before:</span>
                      <span style={{ fontWeight: '600', color: isDeadlinePassed ? 'var(--danger)' : 'var(--gray-dark)' }}>
                        {formatDateTime(event.registration_deadline)}
                      </span>
                    </div>
                  )}
                </div>

                {isPast ? (
                  <button 
                    disabled 
                    className="btn btn-outline btn-block"
                    style={{ color: 'var(--gray-mid)', borderColor: 'var(--gray-border)', cursor: 'not-allowed' }}
                  >
                    Event Concluded
                  </button>
                ) : isDeadlinePassed ? (
                  <button 
                    disabled 
                    className="btn btn-outline btn-block"
                    style={{ color: 'var(--gray-mid)', borderColor: 'var(--gray-border)', cursor: 'not-allowed' }}
                  >
                    Registration Closed
                  </button>
                ) : (
                  <a 
                    href={event.registration_url || '/register'} 
                    target={event.registration_url ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-block"
                  >
                    {event.is_free ? 'Reserve My Spot' : 'Get Tickets'}
                  </a>
                )}

                {event.is_virtual && event.meeting_link && !isPast && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(37,99,235,0.05)', border: '1px dashed var(--accent)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <h5 style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '5px' }}>Already Registered?</h5>
                    <a 
                      href={event.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '700', textDecoration: 'underline' }}
                    >
                      Click here to join meeting
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
