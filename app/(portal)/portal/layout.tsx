import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import PortalSidebar from './PortalSidebar';
import styles from './portal.module.css';

export const metadata = {
  title: 'Member Portal | SSE',
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className={styles.portalLayout}>
      <PortalSidebar />
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}
