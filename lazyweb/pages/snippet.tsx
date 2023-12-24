import SnippetsContainer from '@/components/snippets/main'
import React from 'react'
import "ace-builds/src-noconflict/ext-language_tools";

//themes
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-dreamweaver";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-gob";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-idle_fingers";

//languages
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/mode-django";
import "ace-builds/src-noconflict/mode-dockerfile";
import "ace-builds/src-noconflict/mode-elixir";
import "ace-builds/src-noconflict/mode-elm";
import "ace-builds/src-noconflict/mode-erlang";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-graphqlschema";
import "ace-builds/src-noconflict/mode-haskell";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-objectivec";
import "ace-builds/src-noconflict/mode-pascal";
import "ace-builds/src-noconflict/mode-perl";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-r";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-xml";
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
           "Lazysnippet: Elegant Code Snippet Beautifier – A user-friendly web app for developers to transform code into visually appealing formats, ideal for presentations and sharing. Perfect for enhancing readability and aesthetics of code."
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.lazyweb.rocks/snippet" />
        <meta property="og:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/lazysnippetlow.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LazyWeb: SnipShots" />
        <meta name="twitter:description" content={
           "Lazysnippet: Elegant Code Snippet Beautifier – A user-friendly web app for developers to transform code into visually appealing formats, ideal for presentations and sharing. Perfect for enhancing readability and aesthetics of code."
        } />
        <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/lazysnippetlow.png" />
        <meta name="twitter:site" content="@dishant0406" />
        <meta name="twitter:creator" content="@dishant0406" />

        <link rel="icon" href="/assets/snipfavicon.ico" type="image/x-icon" />
      </Head>
    <SnippetsContainer />
    <div className='h-[100vh] w-[100vw] md:hidden block'>
      <PlaygroundMobile title='SnipShots'/>
      </div>
    </>
  )
}

export async function getServerSideProps(context:any) {
  let query = { ...context.query };
  let shouldRedirect = false;

  // Define default values
  const defaults = {
    language: 'javascript',
    theme: 'monokai',
    code: btoa(`console.log('Hello World')`),
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