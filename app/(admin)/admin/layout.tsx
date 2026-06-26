import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { canAccessAdmin } from '@/lib/authz';
import AdminSidebar from './AdminSidebar';
import styles from './admin.module.css';

export const metadata = {
  title: 'Admin Dashboard | SSE',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (!canAccessAdmin(session.user.role)) {
    redirect('/portal');
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}
