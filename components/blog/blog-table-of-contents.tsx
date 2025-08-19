'use client';

import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  headings: Heading[];
}

export default function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <List className="w-5 h-5" />
        Table des matières
      </h3>
      
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                  activeId === heading.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{
                  paddingLeft: `${(heading.level - 1) * 0.75 + 0.5}rem`,
                }}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}