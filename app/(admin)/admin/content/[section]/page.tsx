import { notFound } from 'next/navigation';
import ContentEditor from '../ContentEditor';
import { contentSections } from '../contentSections';

interface PageProps {
  params: Promise<{ section: string }>;
}

export default async function SiteContentSectionPage({ params }: PageProps) {
  const { section } = await params;
  const config = contentSections.find((item) => item.slug === section);

  if (!config) {
    notFound();
  }

  return <ContentEditor section={config} />;
}
