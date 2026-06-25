import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { getAllEvents, Event } from '@/lib/queries/events';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function EventsPage() {
  let events: Event[] = [];
  try {
    events = await getAllEvents();
  } catch (error) {
    console.error('Failed to load events list:', error);
  }

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.start_date) >= now);
  const pastEvents = events.filter((e) => new Date(e.start_date) < now);

  return (
    <div>
      {/* Banner */}
      <section 
        style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'var(--white)', 
          padding: '80px 0', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--primary) 0%, #1a2f7c 100%)',
          borderBottom: '4px solid var(--accent)'
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>Events & Summits</h1>
          <p style={{ color: 'var(--accent-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Workshops, webinars, hackathons, and professional summits
          </p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section">
        <div className="container">
          <SectionHeader 
            title="Upcoming Gatherings" 
            subtitle="Mark Your Calendar" 
          />

          {upcomingEvents.length === 0 ? (
            <div className="text-center" style={{ padding: '60px', color: 'var(--gray-mid)', backgroundColor: 'var(--gray-light)', borderRadius: 'var(--radius-md)' }}>
              No upcoming events are scheduled at the moment. Please check back later.
            </div>
          ) : (
            <div className="grid grid-3">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="section section-alt" style={{ borderTop: '1px solid var(--gray-border)' }}>
        <div className="container">
          <SectionHeader 
            title="Concluded Events" 
            subtitle="Previous Meetups" 
          />

          {pastEvents.length === 0 ? (
            <div className="text-center" style={{ padding: '40px', color: 'var(--gray-mid)' }}>
              No concluded events listed in the database.
            </div>
          ) : (
            <div className="grid grid-3">
              {pastEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} isPast />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Event card item
function EventCard({ event, index, isPast = false }: { event: Event; index: number; isPast?: boolean }) {
  const eventDate = new Date(event.start_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-NG', { month: 'short' });

  return (
    <AnimatedSection 
      direction="up" 
      delay={index * 0.08}
      className="card"
      style={isPast ? { opacity: 0.85 } : undefined}
    >
      <div style={{ position: 'relative', width: '100%', height: '180px' }}>
        <Image
          src={event.featured_image_url || '/images/logo.jpeg'}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
        
        {/* Date Overlay Badge */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '15px', 
            right: '15px', 
            zIndex: 5,
            backgroundColor: isPast ? 'var(--gray-mid)' : 'var(--primary)',
            color: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            width: '54px',
            height: '58px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <span style={{ fontSize: '1.25rem', lineHeight: '1' }}>{day}</span>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: isPast ? '#fff' : 'var(--accent-light)', lineHeight: '1.2' }}>{month}</span>
        </div>

        <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 5 }}>
          <span className={`badge ${isPast ? 'badge-secondary' : 'badge-success'}`}>
            {event.event_type}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span>⏱️ {eventDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</span>
          <span>📍 {event.is_virtual ? 'Virtual' : event.location}</span>
        </div>
        <h3 className="card-title">
          <Link href={`/events/${event.slug}`}>{event.title}</Link>
        </h3>
        <p className="card-text">
          {event.description || 'Convene with engineers to learn and implement standard solutions in Nigerian technology spaces.'}
        </p>
        
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--gray-border)', paddingTop: '15px' }}>
          <Link 
            href={`/events/${event.slug}`} 
            className={`btn ${isPast ? 'btn-outline' : 'btn-primary'} btn-sm btn-block`}
          >
            {isPast ? 'View Report / Info' : 'Register & Details'}
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
