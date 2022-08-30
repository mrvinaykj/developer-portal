import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { s } from 'hastscript';
import rehypeExtractHeadings, { ContentHeading } from './rehype/extractHeadings';
import { serialize } from 'next-mdx-remote/serialize';
import remarkEmbedder, { TransformerInfo } from '@remark-embedder/core';
import oembedTransformer from '@remark-embedder/transformer-oembed';
import type { Config } from '@remark-embedder/transformer-oembed';

export async function ParseContent(stream: string) {
  const headings: ContentHeading[] = [];
  const result = await serialize(stream, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        [
          remarkEmbedder,
          {
            transformers: [
              oembedTransformer,
              { params: { theme: 'dark', dnt: true, omit_script: true } } as Config,
            ],
            handleHTML,
          },
        ],
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['anchor'],
            },
            behavior: `append`,
            content: s(
              `svg`,
              { width: 16, height: 16, viewBox: `0 0 16 16`, display: 'inline' },
              // symbol #link-icon defined in _document.tsx
              s(`use`, { 'xlink:href': `#link-icon`, href: `#link-icon` })
            ),
          },
        ],
        [rehypeExtractHeadings, { rank: 2, headings: headings }],
      ],
    },
  });

  return {
    result,
    headings,
  };
}

function handleHTML(html: string, info: TransformerInfo) {
  const { url, transformer } = info;
  if (transformer.name === '@remark-embedder/transformer-oembed') {
    if (url.includes('www.youtube.com')) {
      return `<div class="embed-youtube aspect-w-16 aspect-h-9">${html}</div>`;
    }
    if (url.includes('twitter.com')) {
      return `<div class="embed-twitter h-full">${html}</div>`;
    }
  }

  return html;
}
