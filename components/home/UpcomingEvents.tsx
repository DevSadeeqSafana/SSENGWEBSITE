import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin } from 'lucide-react';
import { Event } from '@/lib/queries/events';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const displayEvents = events
    .filter(e => e.status === 'UPCOMING' || e.status === 'ONGOING')
    .slice(0, 3);

  return (
    <section className="section">
      <div className="container">
        <SectionHeader title="Upcoming Events & Summits" subtitle="Connect & Collaborate" />

        <div className="grid grid-3" style={{ marginBottom: '40px' }}>
          {displayEvents.length === 0 ? (
            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '40px', color: 'var(--gray-mid)' }}>
              No upcoming events scheduled at the moment. Please check back soon.
            </div>
          ) : (
            displayEvents.map((event, index) => {
              const eventDate = new Date(event.start_date);
              const day = eventDate.getDate();
              const month = eventDate.toLocaleDateString('en-NG', { month: 'short' });

              return (
                <AnimatedSection key={event.id} direction="up" delay={index * 0.1} className="card">
                  <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                    <Image
                      src={event.featured_image_url || '/images/logo.jpeg'}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        zIndex: 5,
                        backgroundColor: 'var(--primary)',
                        color: 'var(--white)',
                        borderRadius: 'var(--radius-md)',
                        width: '54px',
                        height: '58px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>{day}</span>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-light)', lineHeight: '1.2' }}>{month}</span>
                    </div>

                    <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 5 }}>
                      <span className="badge badge-success">{event.event_type}</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Clock style={{ width: '14px', height: '14px' }} />
                        {eventDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin style={{ width: '14px', height: '14px' }} />
                        {event.is_virtual ? 'Virtual' : event.location}
                      </span>
                    </div>
                    <h3 className="card-title">
                      <Link href={`/events/${event.slug}`}>{event.title}</Link>
                    </h3>
                    <p className="card-text">
                      {event.description || 'Join fellow professionals at this executive event to discuss solutions and ideas in Nigerian software engineering.'}
                    </p>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--gray-border)', paddingTop: '15px' }}>
                      <Link href={`/events/${event.slug}`} className="btn btn-primary btn-sm btn-block">
                        Register & View Details
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })
          )}
        </div>

        <div className="text-center">
          <Link href="/events" className="btn btn-outline">
            View Events Calendar
          </Link>
        </div>
      </div>
    </section>
  );
}
