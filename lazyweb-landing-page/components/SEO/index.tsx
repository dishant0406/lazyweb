import React from 'react';
import Head from 'next/head';

type Props = {
  description?: string;
  author?: string;
  meta?: any;
  title: string;
}

export default function SEO({
  author = 'Dishant Sharma',
  meta,
  title = 'Lazyweb Rocks: The ultimate resource for developers',
}: Props) {
  const metaData = [

  ].concat(meta);
  return (
    <Head>

      <>
        <title>Lazyweb Rocks: The ultimate resource for developers</title>
        <meta
          name="description"
          content="Find all the tools, libraries, and code snippets you need for your next big project at Lazyweb Rocks. Our collection of useful resources is constantly updated to help you save time and focus on building great things."
        />
        <meta property="og:url" content="https://lazyweb.rocks" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Lazyweb Rocks: The ultimate resource for developers"
        />
        <meta
          property="og:description"
          content="Find all the tools, libraries, and code snippets you need for your next big project at Lazyweb Rocks. Our collection of useful resources is constantly updated to help you save time and focus on building great things."
        />
        <meta
          property="og:image"
          content="https://opengraph.b-cdn.net/production/documents/d77cfe8a-7bf5-493e-ae45-e24b06d49180.png?token=XqhxH33yqZ2mus4WtYg-dXQLZZqPTOKJ_5wkQ9HZRNo&height=628&width=1200&expires=33246160075"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="lazyweb.rocks" />
        <meta property="twitter:url" content="https://lazyweb.rocks" />
        <meta
          name="twitter:title"
          content="Lazyweb Rocks: The ultimate resource for developers"
        />
        <meta
          name="twitter:description"
          content="Find all the tools, libraries, and code snippets you need for your next big project at Lazyweb Rocks. Our collection of useful resources is constantly updated to help you save time and focus on building great things."
        />
        <meta
          name="twitter:image"
          content="https://opengraph.b-cdn.net/production/documents/d77cfe8a-7bf5-493e-ae45-e24b06d49180.png?token=XqhxH33yqZ2mus4WtYg-dXQLZZqPTOKJ_5wkQ9HZRNo&height=628&width=1200&expires=33246160075"
        />
        {/* conical tag */}
        <link rel="canonical" href="https://lazyweb.rocks" />
        {/* robots */}
        <meta name="robots" content="index, follow" />

      </>



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