import { apiClient } from "@/components/utility/api";
import { Toaster } from "@/components/utility/toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { InternalAxiosRequestConfig } from "axios";
import type { AppProps } from "next/app";
import Head from "next/head";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Suspense, useEffect } from "react";
import "react-spring-bottom-sheet/dist/style.css";
import "styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiClient.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
          config.headers.Authorization = `Bearer ${token}`;

          return config;
        }
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>LazyWeb: Resources that you need</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <GoogleAnalytics trackPageViews />
        <div className="dark">
          <Component {...pageProps} />
        </div>
        <Toaster max={3} position="bottom-right" />
        <SpeedInsights />
        <Analytics />
      </Suspense>
    </>
  );
}
