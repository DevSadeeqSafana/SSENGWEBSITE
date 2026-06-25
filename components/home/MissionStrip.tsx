import React from 'react';
import { Code2, Eye, Target } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import styles from './home.module.css';

interface MissionStripProps {
  content: Record<string, string>;
}

export default function MissionStrip({ content }: MissionStripProps) {
  const visionTitle = content.strip_vision_title || '01. VISION';
  const visionBody = content.strip_vision_body || 'To build a vibrant and globally respected community of software engineering professionals that inspires technological innovation, nurtures exceptional talent, and positions Nigeria as a leading hub for software development.';

  const missionTitle = content.strip_mission_title || '02. MISSION';
  const missionBody = content.strip_mission_body || 'To advance the software engineering profession through professional development, capacity building, research, mentorship, strategic partnerships, and quality software practices.';

  const programsTitle = content.strip_programs_title || '03. PROGRAMS';
  const programsBody = content.strip_programs_body || 'Through personalized trainings, expert-led workshops, certification pathways, and mentorship programs, SSE equips software engineers with the skills needed to thrive in a digital landscape.';

  return (
    <section className={styles.missionStrip}>
      <div className={`${styles.missionGrid} container`}>
        <AnimatedSection direction="up" delay={0.1} className={styles.missionCol}>
          <Eye className={styles.missionColIcon} />
          <h3 className={styles.missionColTitle}>{visionTitle}</h3>
          <div
            className={styles.missionColText}
            dangerouslySetInnerHTML={{ __html: visionBody }}
          />
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.2} className={styles.missionCol}>
          <Target className={styles.missionColIcon} />
          <h3 className={styles.missionColTitle}>{missionTitle}</h3>
          <div
            className={styles.missionColText}
            dangerouslySetInnerHTML={{ __html: missionBody }}
          />
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.3} className={styles.missionCol}>
          <Code2 className={styles.missionColIcon} />
          <h3 className={styles.missionColTitle}>{programsTitle}</h3>
          <div
            className={styles.missionColText}
            dangerouslySetInnerHTML={{ __html: programsBody }}
          />
        </AnimatedSection>
      </div>
    </section>
  );
}
