import { apiClient } from "@/components/utility/api";
import { useBookmarks } from "@/hooks/useBookmarks";
import {
  PaginatedResponse,
  useSetAllResourcesServerSide,
  useUserData,
} from "@/hooks/Zustand";
import { InternalAxiosRequestConfig } from "axios";
import {
  BookmarkModal,
  Category,
  Dashboard,
  InfoModal,
  NavBar,
  SEO,
  Sidebar,
  SwipeUI,
} from "components";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  tncData: TNCType;
  resourceData: PaginatedResponse;
};

const Home = ({ resourceData, tncData }: Props) => {
  const router = useRouter();
  const { setSession } = useUserData();
  const { setAllResourcesServerSide } = useSetAllResourcesServerSide();
  const { bookmarkResources, checkBookmarks } = useBookmarks();

  useEffect(() => {
    handleTokenInUrl();
    setInitialResources();
  }, []);

  useEffect(() => {
    if (router.query?.bookmark) {
      checkBookmarks(router.query.bookmark as string);
    }
  }, [router.query?.bookmark]);

  const handleTokenInUrl = () => {
    const query = new URLSearchParams(router.asPath.split("?")[1]);
    const token = query.get("token");
    if (token) {
      localStorage.setItem("token", token);
      apiClient.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
          config.headers.Authorization = `Bearer ${token}`;

          return config;
        }
      );
      router.replace(router.pathname, undefined, { shallow: true });
      setSession(token);
    }
  };

  const setInitialResources = () => {
    setAllResourcesServerSide({
      allCategories: tncData.allCategories,
      allTags: tncData.allTags,
      categories: tncData.publicCategories,
      dailyResource: resourceData.dailyResource,
      resources: resourceData.resources,
      tags: tncData.publicTags,
    });
  };

  return (
    <>
      <SEO />
      <NavBar />
      <div className="md:flex dark hidden">
        <div>
          <Category />
          <div className="flex dark w-[100vw]">
            <Sidebar />
            <Dashboard />
          </div>
        </div>
      </div>
      <SwipeUI />
      <BookmarkModal
        isOpen={bookmarkResources.length > 0 && !!router.query?.bookmark}
        setIsOpen={() => {}}
        resources={bookmarkResources}
      />
      <InfoModal isOpen={!!router.query.id} />
    </>
  );
};

type TNCType = {
  publicTags: string[];
  publicCategories: string[];
  allTags: string[];
  allCategories: string[];
};

export async function getStaticProps() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL + "/api/websites/tnc"
  );

  const res2 = await fetch(
    process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL + "/api/websites/page?limit=30"
  );

  const data: TNCType = await res.json();
  const data2: PaginatedResponse = await res2.json();

  return {
    props: {
      tncData: data,
      resourceData: data2,
    },
    revalidate: 60,
  };
}

export default Home;
