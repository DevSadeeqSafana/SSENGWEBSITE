'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import styles from './home.module.css';

interface HeroSlideshowProps {
  content: Record<string, string>;
}

const defaultSlideImages = [
  '/images/hero_slide_1.png',
  '/images/hero_slide_2.png',
  '/images/hero_slide_3.png',
];

export default function HeroSlideshow({ content }: HeroSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideImages = [
    content.hero_image_1 || defaultSlideImages[0],
    content.hero_image_2 || defaultSlideImages[1],
    content.hero_image_3 || defaultSlideImages[2],
  ].filter(Boolean);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 6000); // Rotate slide every 6 seconds

    return () => clearInterval(interval);
  }, [slideImages.length]);

  const headline = content.hero_headline || "Building Nigeria's Digital Future";
  const subheadline = content.hero_subheadline || 'Society of Software Engineers';
  const subtext = content.hero_subtext || 'The premier professional body committed to promoting excellence in software engineering and strengthening Nigeria\'s digital ecosystem.';
  const ctaPrimary = content.hero_cta_primary || 'Become a Member';
  const ctaSecondary = content.hero_cta_secondary || 'Learn More';

  // Text animation settings
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section className={styles.heroContainer}>
      {/* Background Images Layer */}
      {slideImages.map((image, index) => (
        <div
          key={index}
          className={`${styles.heroSlide} ${index === currentSlide ? styles.heroSlideActive : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}

      {/* Dark Overlay Grid */}
      <div className={styles.heroOverlay} />

      {/* Hero Content Area */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Subheading Badge */}
          <motion.span className={styles.heroSubtitle} variants={itemVariants}>
            {subheadline}
          </motion.span>

          {/* Heading */}
          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            {headline}
          </motion.h1>

          {/* Supporting Text */}
          <motion.p className={styles.heroText} variants={itemVariants}>
            {subtext}
          </motion.p>

          {/* Action Buttons */}
          <motion.div className={styles.heroButtons} variants={itemVariants}>
            <Link href="/register" className="btn btn-primary btn-lg">
              {ctaPrimary}
            </Link>
            <Link href="/about" className="btn btn-outline-white btn-lg">
              {ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Indicators */}
      <div className={styles.heroIndicators}>
        {slideImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`${styles.heroIndicator} ${index === currentSlide ? styles.heroIndicatorActive : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
