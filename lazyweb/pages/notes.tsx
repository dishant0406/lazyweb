import NoteComponent from '@/components/Notes'
import Head from 'next/head'
import React from 'react'

type Props = {}

const Notes = (props: Props) => {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <title>LazyWeb: Notes</title>
        <meta name="description" content={
"Elevate your note-taking with AI-powered writing and Notion-style organization. Capture and refine ideas effortlessly."
        } />
        <meta name="keywords" content="Notion, Notes, LazyWeb" />
        <meta name="author" content="Dishant Sharma" />

        <meta property="og:title" content="LazyWeb: Notes" />
        <meta property="og:description" content={
"Elevate your note-taking with AI-powered writing and Notion-style organization. Capture and refine ideas effortlessly."
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.lazyweb.rocks/playground" />
        <meta property="og:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/lazynotes.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LazyWeb: Notes" />
        <meta name="twitter:description" content={
"Elevate your note-taking with AI-powered writing and Notion-style organization. Capture and refine ideas effortlessly."
        } />
        <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/lazynotes.png" />
        <meta name="twitter:site" content="@dishant0406" />
        <meta name="twitter:creator" content="@dishant0406" />

        <link rel="icon" href="/assets/notesfav.ico" type="image/x-icon" />
      </Head>
    <NoteComponent />
    </>
  )
}

export default Notes