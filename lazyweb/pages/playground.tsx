import { PlaygroundComponent } from "@/components";
import PlaygroundMobile from "@/components/mobile/PlaygroundMobile";
import Head from "next/head";

type Props = {};

const Playground = (props: Props) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>LazyWeb: JS Playground</title>
        <meta
          name="description"
          content={
            "JavaScript Playground by LazyWeb, a place to play with JavaScript and share your code with others. Create a new playground and start playing with JavaScript, create Rooms and share the link with your friends to collaborate on the same code."
          }
        />
        <meta name="keywords" content="JavaScript, Playground, LazyWeb" />
        <meta name="author" content="Dishant Sharma" />

        <meta property="og:title" content="LazyWeb: JS Playground" />
        <meta
          property="og:description"
          content={
            "JavaScript Playground by LazyWeb, a place to play with JavaScript and share your code with others. Create a new playground and start playing with JavaScript, create Rooms and share the link with your friends to collaborate on the same code."
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://app.lazyweb.rocks/playground"
        />
        <meta
          property="og:image"
          content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/jsplayground.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LazyWeb: JS Playground" />
        <meta
          name="twitter:description"
          content={
            "JavaScript Playground by LazyWeb, a place to play with JavaScript and share your code with others. Create a new playground and start playing with JavaScript, create Rooms and share the link with your friends to collaborate on the same code."
          }
        />
        <meta
          name="twitter:image"
          content="https://cdn.jsdelivr.net/gh/dishant0406/images-repo@master/jsplayground.png"
        />
        <meta name="twitter:site" content="@dishant0406" />
        <meta name="twitter:creator" content="@dishant0406" />

        <link rel="icon" href="/assets/playfavicon.ico" type="image/x-icon" />
      </Head>
      <div className="h-[100vh] w-[100vw] md:block hidden">
        <PlaygroundComponent />
      </div>
      <div className="h-[100vh] w-[100vw] md:hidden block">
        <PlaygroundMobile />
      </div>
    </>
  );
};

export default Playground;
