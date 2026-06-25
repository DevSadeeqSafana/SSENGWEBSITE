import React from 'react';
import HeroSlideshow from '@/components/home/HeroSlideshow';
import MissionStrip from '@/components/home/MissionStrip';
import StatsCounter from '@/components/home/StatsCounter';
import FeaturedPrograms from '@/components/home/FeaturedPrograms';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import LatestNews from '@/components/home/LatestNews';
import CTASection from '@/components/home/CTASection';

import { getSiteContentMap } from '@/lib/queries/content';
import { getAllPrograms } from '@/lib/queries/programs';
import { getAllEvents } from '@/lib/queries/events';
import { getAllPosts } from '@/lib/queries/posts';

// Set page to dynamic rendering so it pulls fresh database info on load
export const revalidate = 0;

export default async function HomePage() {
  let content: Record<string, string> = {};
  let programs: any[] = [];
  let events: any[] = [];
  let posts: any[] = [];

  // Database fetches wrapped in individual try/catch to maintain robustness
  try {
    content = await getSiteContentMap();
  } catch (error) {
    console.error('Failed to fetch site content for homepage:', error);
  }

  try {
    programs = await getAllPrograms('ACTIVE');
  } catch (error) {
    console.error('Failed to fetch active programs for homepage:', error);
  }

  try {
    events = await getAllEvents('UPCOMING');
  } catch (error) {
    console.error('Failed to fetch upcoming events for homepage:', error);
  }

  try {
    posts = await getAllPosts('PUBLISHED');
  } catch (error) {
    console.error('Failed to fetch published posts for homepage:', error);
  }

  return (
    <>
      <HeroSlideshow content={content} />
      <MissionStrip content={content} />
      <StatsCounter content={content} />
      <FeaturedPrograms programs={programs} />
      <UpcomingEvents events={events} />
      <LatestNews posts={posts} />
      <CTASection content={content} />
    </>
  );
}
