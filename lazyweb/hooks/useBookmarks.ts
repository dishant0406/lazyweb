import { Resource } from "@/hooks/Zustand";
import { useRouter } from "next/router";
import { useState } from "react";

export const useBookmarks = () => {
  const [bookmarkResources, setBookmarkResources] = useState<Resource[]>([]);
  const router = useRouter();

  const checkBookmarks = async (bookmark: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/api/websites/bookmarks/${bookmark}`
      );
      const data = await res.json();
      setBookmarkResources(data?.resources || []);

      if (!data?.resources || data.resources.length === 0) {
        router.replace(
          {
            pathname: router.pathname,
            query: router.query,
          },
          undefined,
          { shallow: true }
        );
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  return { bookmarkResources, checkBookmarks };
};
