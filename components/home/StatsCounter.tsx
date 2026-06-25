'use client';

import React, { useEffect, useState, useRef } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import styles from './home.module.css';

interface StatsCounterProps {
  content: Record<string, string>;
}

// Inner helper component to animate count up
function CounterItem({ value, label }: { value: string; label: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Parse digits and suffixes (e.g., "500+" -> target: 500, suffix: "+")
  const numericString = value.replace(/[^0-9]/g, '');
  const target = parseInt(numericString, 10) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000; // 2 seconds animation
          let startTimestamp: number | null = null;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target, hasAnimated]);

  return (
    <div className={styles.statItem} ref={elementRef}>
      <div className={styles.statValue}>
        {hasAnimated ? count : 0}
        {suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function StatsCounter({ content }: StatsCounterProps) {
  const membersVal = content.stat_members_value || '500+';
  const membersLbl = content.stat_members_label || 'Members';
  
  const programsVal = content.stat_programs_value || '10+';
  const programsLbl = content.stat_programs_label || 'Programs';
  
  const eventsVal = content.stat_events_value || '25+';
  const eventsLbl = content.stat_events_label || 'Events';
  
  const statesVal = content.stat_states_value || '36';
  const statesLbl = content.stat_states_label || 'States';

  return (
    <section className={styles.statsSection}>
      <AnimatedSection direction="none" className="container">
        <div className={styles.statsGrid}>
          <CounterItem value={membersVal} label={membersLbl} />
          <CounterItem value={programsVal} label={programsLbl} />
          <CounterItem value={eventsVal} label={eventsLbl} />
          <CounterItem value={statesVal} label={statesLbl} />
        </div>
      </AnimatedSection>
    </section>
  );
}
