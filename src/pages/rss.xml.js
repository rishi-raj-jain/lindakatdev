import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection("blog", ({ data }) => {
    return !data.tags.includes("Course Notes");
  });
  return rss({
    title: "LindaKat Writes",
    description: "The musings and knowledge sharing of Linda Thompson",
    site: context.site,
    items: blog.reverse().map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body)),
    })),
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/pretty-feed-v3.xsl",
  });
}