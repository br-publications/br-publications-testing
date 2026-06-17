import { Suspense } from 'react';
import Component from '@/pages-content/resnovaComponents/bookChapterDetail';
import type { Metadata } from 'next';
import { bookChapterService } from '@/services/bookChapterService';
import { toBookNameSlug } from '@/utils/stringUtils';

interface PageProps {
  params: Promise<{ id: string; slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let numericId: number | null = null;
  const isNumeric = /^\d+$/.test(id);
  if (isNumeric) {
    numericId = parseInt(id, 10);
  } else {
    try {
      const allBooks = await bookChapterService.getAllBooks();
      const matchedBook = allBooks.find(b => b.uid && b.uid.toLowerCase() === id.toLowerCase());
      if (matchedBook) {
        numericId = matchedBook.id;
      }
    } catch (e) {
      console.error("Metadata resolution: uid mapping failed", e);
    }
  }

  if (!numericId) {
    return {
      title: { absolute: 'Book Not Found' },
      robots: 'noindex, follow',
    };
  }

  const book = await bookChapterService.getBookById(numericId);
  if (!book) {
    return {
      title: { absolute: 'Book Not Found' },
      robots: 'noindex, follow',
    };
  }

  const displayTitle = `${book.title}${book.editors && book.editors.length > 0 ? ` by ${book.editors.join(', ')}` : book.author ? ` by ${book.author}` : ''}`;
  const editorsStr = book && Array.isArray(book.editors) && book.editors.length > 0
    ? `Editors: ${book.editors.join(', ')}.`
    : book.author ? `By ${book.author}.` : '';

  let metaDescription = 'Detailed information about academic book chapters and research publications from BR Publications.';
  if (book.description) {
    metaDescription = book.description.replace(/<[^>]+>/g, '').trim().slice(0, 160);
  } else if (book.synopsis) {
    metaDescription = Object.values(book.synopsis).join(' ').replace(/<[^>]+>/g, '').trim().slice(0, 160);
  } else {
    metaDescription = `${book.title}. ${editorsStr} Published by BR ResNova Academic Press.`;
  }

  const identifier = book.uid ? book.uid.toLowerCase() : book.id;
  const bookSlug = book.title ? toBookNameSlug(book.title) : '';
  const canonicalUrlFull = bookSlug
    ? `https://www.brpublications.com/bookchapter/${identifier}/${bookSlug}`
    : `https://www.brpublications.com/bookchapter/${identifier}`;

  return {
    title: {
      absolute: displayTitle
    },
    description: metaDescription,
    alternates: {
      canonical: canonicalUrlFull,
    },
    openGraph: {
      title: book.title || undefined,
      description: metaDescription,
      type: 'book',
      url: canonicalUrlFull,
      images: book.coverImage ? [{ url: book.coverImage }] : [],
    },
    other: {
      'keywords': book.keywords && book.keywords.length > 0 ? book.keywords.join(', ') : `${book.title}, ${(book.editors ?? []).join(', ')}, book chapter, ${book.isbn}, BR Publications, academic research`,
      'citation_title': book.title || '',
      ...(Array.isArray(book.editors) && book.editors.length > 0 ? {
        'citation_author': book.editors,
      } : (book.author ? { 'citation_author': [book.author] } : {})),
      ...((book.publishedDate || book.releaseDate) ? {
        'citation_publication_date': book.publishedDate || book.releaseDate,
      } : {}),
      'citation_isbn': book.isbn || '',
      'citation_publisher': 'BR ResNova Academic Press',
      'citation_language': 'en',
      'citation_abstract_html_url': canonicalUrlFull,
      'citation_fulltext_html_url': canonicalUrlFull,
      ...(book.doi ? { 'citation_doi': book.doi } : {}),
    }
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div className="suspense-loading">Loading...</div>}>
      <Component />
    </Suspense>
  );
}
