import {
  Resource,
  useAllResources,
  useSearchModal,
  useSetAllResourcesServerSide,
  useUserData,
} from "@/hooks/Zustand";

import {
  BookmarkModal,
  Category,
  Dashboard,
  LoadingModal,
  NavBar,
  SEO,
  SearchBarModal,
  Sidebar,
  SwipeUI,
} from "components";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";

type Props = {
  data?: any;
};

const Home = ({ data }: Props) => {
  const router = useRouter();
  const { setSession } = useUserData();
  const { allResources } = useAllResources();
  const { isSearchModalOpen, setIsSearchModalOpen } = useSearchModal();
  const [isLoadingModalOpen, setisLoadingModalOpen] = useState(true);
  const { setAllResourcesServerSide } = useSetAllResourcesServerSide();
  const [bookmarkResouces, setBookmarkResouces] = useState<Resource[]>([]);

  useEffect(() => {
    //event listner if clrt+space is pressed then open search modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "Space") {
        setIsSearchModalOpen(true);
      }
      if (isSearchModalOpen && e.code === "Escape") {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    //token is available in url

    if (router?.asPath) {
      //add token to localstorage
      const query = router.asPath.split("?")[1] || "";
      const queryObject = query
        ?.split("&")
        .map((item) => {
          const [key, value] = item.split("=");
          return { [key]: value };
        })
        .reduce((acc, item) => {
          return { ...acc, ...item };
        }, {});
      if (queryObject.token) {
        localStorage.setItem("token", queryObject.token as string);
        router.replace(
          {
            pathname: router.pathname,
            query: {},
          },
          undefined,
          { shallow: true }
        );

        setSession(queryObject.token as string);
      }
    }
    setAllResourcesServerSide(data);

    setisLoadingModalOpen(false);
    if (allResources.length > 0) {
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (router.query?.bookmark) {
      const { query } = router;
      const { bookmark } = query;
      const checkBookmarks = async () => {
        const res = await fetch(
          process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL +
            `/api/websites/bookmarks/${bookmark}`
        );
        const data = await res.json();
        setBookmarkResouces(data?.resources);
        if (!data?.resources.length || data?.resources?.length === 0) {
          router.replace(
            {
              pathname: router.pathname,
              query: query,
            },
            undefined,
            { shallow: true }
          );
        }
      };
      checkBookmarks();
    }
  }, [router?.query?.bookmark]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SEO />
      <NavBar />
      <div className={`md:flex hidden`}>
        <div>
          <Category />
          <div className={`flex w-[100vw] `}>
            <Sidebar />
            <Dashboard />
          </div>
        </div>
      </div>
      <SwipeUI />
      <LoadingModal
        isOpen={isLoadingModalOpen}
        setIsOpen={setisLoadingModalOpen}
      />
      <SearchBarModal
        isOpen={isSearchModalOpen}
        setIsOpen={setIsSearchModalOpen}
      />
      <BookmarkModal
        isOpen={
          bookmarkResouces?.length &&
          bookmarkResouces?.length > 0 &&
          router.query?.bookmark
            ? true
            : false
        }
        setIsOpen={() => {}}
        resources={bookmarkResouces}
      />
    </Suspense>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL + "/api/websites"
  );
  const data = await res.json();

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
}

export default Home;
