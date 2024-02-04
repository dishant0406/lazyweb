import SnippetsContainer from '@/components/snippets/main'
import React from 'react'



import { generateGradient } from '@/hooks/Zustand';
import Head from 'next/head';
import PlaygroundMobile from '@/components/mobile/PlaygroundMobile';

type Props = {}

const Snippet = (props: Props) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>LazyWeb: SnipShots</title>
        <meta name="description" content={
          "SnipShots: Elegant Code Snippet Beautifier – A user-friendly web app for developers to transform code into visually appealing formats, ideal for presentations and sharing. Perfect for enhancing readability and aesthetics of code."
        } />
        <meta name="keywords" content="code beautification, web application, developers, user-friendly, code snippets, customization, presentations, blogs, education, formatting, readability, aesthetics, coding projects, showcase, Lazysnippet." />
        <meta name="author" content="Dishant Sharma" />

        <meta property="og:title" content="LazyWeb: SnipShots" />
        <meta property="og:description" content={
          "SnipShots: Elegant Code Snippet Beautifier – A user-friendly web app for developers to transform code into visually appealing formats, ideal for presentations and sharing. Perfect for enhancing readability and aesthetics of code."
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.lazyweb.rocks/snippet" />
        <meta property="og:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/lazysnippetlow.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LazyWeb: SnipShots" />
        <meta name="twitter:description" content={
          "SnipShots: Elegant Code Snippet Beautifier – A user-friendly web app for developers to transform code into visually appealing formats, ideal for presentations and sharing. Perfect for enhancing readability and aesthetics of code."
        } />
        <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/lazysnippetlow.png" />
        <meta name="twitter:site" content="@dishant0406" />
        <meta name="twitter:creator" content="@dishant0406" />

        <link rel="icon" href="/assets/snipfavicon.ico" type="image/x-icon" />
      </Head>
      <SnippetsContainer />
      <div className='h-[100vh] w-[100vw] md:hidden block'>
        <PlaygroundMobile title='SnipShots' />
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  let query = { ...context.query };
  let shouldRedirect = false;

  // Define default values
  const defaults = {
    language: 'javascript',
    theme: 'monokai',
    code: btoa(`//print fibonacci\nfunction printFibonacci(n) {\n\tlet fib = [0, 1];\n\tfor (let i = 2; i < n; i++) {\n\t\tfib[i] = fib[i - 1] + fib[i - 2];\n\t}\n\tconsole.log(fib.slice(0, n).join(', '));\n}`),
    borderWidth: '1',
    borderColor: 'rgba(255,255,255,0.5)',
    color: btoa(generateGradient()),
  };

  // Update query with default values if missing and set redirection flag
  for (let key in defaults) {
    if (!query[key]) {
      query[key] = defaults[key as keyof typeof defaults]
      shouldRedirect = true;
    }
  }

  // Redirect only if the updated query is different from the original
  if (shouldRedirect) {
    return {
      redirect: {
        destination: `/snippet?${new URLSearchParams(query).toString()}`,
        permanent: false,
      },
    };
  }

  // Proceed normally if no redirection is needed
  return { props: {} };
}


export default Snippet