import React from 'react';
import Head from 'next/head';

type Props = {
  author?: string;
  meta?: any[];
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
};

export default function SEO({
  author = 'Dishant Sharma',
  meta = [],
  title = 'Lazyweb Rocks: The ultimate resource for developers',
  description = 'Find all the tools, libraries, and code snippets you need for your next big project.',
  image = 'https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/LazywebUpScaledLogo.png',
  keywords = 'web development, coding, programming, JavaScript, HTML, CSS, React, Node.js, frontend, backend, fullstack, databases, Git, software engineering, tutorials, libraries, frameworks, best practices, tips and tricks, API, GraphQL, REST, DevOps, Docker, Kubernetes'
}: Props) {
  const metaData = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:creator', content: author },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'keywords', content: keywords },
  ].concat(meta);
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <link rel="icon" href="assets/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="use-credentials" />
      {metaData.map(({ name, content }, i) => (
        <meta key={i} name={name} content={content} />
      ))}
    </Head>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};


/*
Title: "Lazyweb Rocks: The ultimate resource for developers"
Description: "Find all the tools, libraries, and code snippets you need for your next big project at Lazyweb Rocks. Our collection of useful resources is constantly updated to help you save time and focus on building great things."
Keywords: "developer resources, libraries, code snippets, tools, programming"

og:title: "Lazyweb Rocks: Your go-to source for developer resources"
og:description: "Find everything you need for your next project at Lazyweb Rocks. Our collection of developer resources includes tools, libraries, and code snippets to save you time and help you succeed."
og:type: "website"

twitter:description: "Effortlessly find all the developer resources you need at Lazyweb Rocks. Our constantly updated collection includes tools, libraries, and code snippets to help you build great things."
twitter:title: "Lazyweb Rocks: Your one-stop shop for developer resources"
twitter:creator: "@lazywebrocks"
twitter:card: "summary"

*/ 