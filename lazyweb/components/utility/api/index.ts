import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

///websites/refetch-image/${resource?._id}
export const getRefetchImage = async (id: string) => {
  return apiClient.put(`/websites/refetch-image/${id}`, {});
};

//`/websites/approve/${resource?._id}`
export const approveResource = async (id: string) => {
  return apiClient.put(`/websites/approve/${id}`, {});
};

//`/websites/reject/${resource?._id}`
export const rejectResource = async (id: string) => {
  return apiClient.put(`/websites/reject/${id}`, {});
};

//"/websites/bulk-bookmark"
export const bulkBookmark = async (ids: string[]) => {
  return apiClient.post(`/websites/bulk-bookmark`, { resourceIds: ids });
};

//"/websites/add"
export const addResource = async (data: any) => {
  return apiClient.post(`/websites/add`, data);
};

//`/websites/publish/${id}`
export const publishResource = async (
  id: string,
  data: {
    category: string;
    tags: string[];
  }
) => {
  return apiClient.put(`/websites/publish/${id}`, {
    category: data.category,
    tags: data.tags,
  });
};

///websites/page?limit=30&cursor=0
export const getResources = async (limit: number, cursor: number) => {
  return apiClient.get(`/websites/page?limit=${limit}&cursor=${cursor}`);
};

//"/websites/user"
export const getUserResources = async () => {
  return apiClient.get(`/websites/user`);
};

//"/websites/user/pending"
export const getUserPendingResources = async () => {
  return apiClient.get(`/websites/user/pending`);
};

//"/websites/bookmarked"
export const getBookmarkedResources = async () => {
  return apiClient.get(`/websites/bookmarked`);
};

//"/websites/is-available-for-approval"
export const isAvailableForApproval = async () => {
  return apiClient.get(`/websites/is-available-for-approval`);
};

//"/websites/by-categories"
export const getResourcesByCategories = async (categories: string[]) => {
  return apiClient.post(`/websites/by-categories`, { categories });
};

//`/websites/bookmark/${resourceId}`
export const addBookmark = async (resourceId: string) => {
  return apiClient.put(`/websites/bookmark/${resourceId}`, {});
};

//`/websites/like/${resourceId}`
export const addLike = async (resourceId: string) => {
  return apiClient.put(`/websites/like/${resourceId}`, {});
};

//"/websites/by-tags"
export const getResourcesByTags = async (tags: string[]) => {
  return apiClient.post(`/websites/by-tags`, { tags });
};
