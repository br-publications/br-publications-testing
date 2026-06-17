import { Suspense } from 'react';
import Component from '@/pages-content/dashboard/editor/EditorDetail';
import type { Metadata } from 'next';
import { API_BASE_URL } from '@/services/api.config';
import { toBookNameSlug } from '@/utils/stringUtils';

interface PageProps {
  params: Promise<{ id: string; slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return {
      title: { absolute: 'Editor Not Found' },
      robots: 'noindex, follow',
    };
  }

  const cleanId = /^0+\d+$/.test(id) ? parseInt(id, 10).toString() : id;

  try {
    const res = await fetch(`${API_BASE_URL}/api/book-chapter-publishing/editors/${cleanId}`);
    if (!res.ok) {
      return {
        title: { absolute: 'Editor Not Found' },
        robots: 'noindex, follow',
      };
    }
    const body = await res.json();
    const editor = body.data || body;
    if (!editor || !editor.name) {
      return {
        title: { absolute: 'Editor Not Found' },
        robots: 'noindex, follow',
      };
    }

    const description = editor.biography
      ? editor.biography.replace(/\n/g, ' ').slice(0, 155)
      : `${editor.name} is a verified academic editor at BR Publications${editor.affiliation ? `, affiliated with ${editor.affiliation}` : ''}.`;

    const nameSlug = editor.name ? toBookNameSlug(editor.name) : '';
    const canonical = `https://www.brpublications.com/editor/${editor.id}/${nameSlug}`;
    const title = `${editor.name} - Editorial Profile`;

    return {
      title: {
        absolute: title
      },
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        type: 'profile',
        url: canonical,
      }
    };
  } catch (error) {
    console.error("Editor metadata resolution failed:", error);
    return {
      title: { absolute: 'Editor Profile' }
    };
  }
}

export default function Page() {
  return (
    <Suspense fallback={<div className="suspense-loading">Loading...</div>}>
      <Component />
    </Suspense>
  );
}
