import { NextUIProvider } from "@nextui-org/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "allotment/dist/style.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Suspense } from "react";
import "react-spring-bottom-sheet/dist/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>LazyWeb: Resources that you need</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <GoogleAnalytics trackPageViews />
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
        <ToastContainer
          theme="dark"
          hideProgressBar={true}
          closeButton={false}
          pauseOnHover={false}
        />
        <SpeedInsights />
        <Analytics />
      </Suspense>
    </>
  );
}
