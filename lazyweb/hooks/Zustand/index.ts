import {
  addBookmark,
  addLike,
  getBookmarkedResources,
  getResources,
  getResourcesByCategories,
  getResourcesByTags,
  getUserPendingResources,
  getUserResources,
  isAvailableForApproval,
} from "@/components/utility/api";
import { errorToast, promiseToast } from "@/components/utility/toast";
import jwt_decode from "jwt-decode";
import { useQueryState } from "next-usequerystate";
import { create } from "zustand";

export type Resource = {
  _id: string;
  created_at: string;
  created_by: string;
  url: string;
  tags: string[];
  image_url: string;
  title: string;
  desc: string;
  isPublicAvailable: boolean;
  likes: number;
  isAvailableForApproval: string;
  category: string;
  created_by_list: string[];
  bookmarked_by: string[];
  liked_by: string[];
};

export type PaginatedResponse = {
  resources: Resource[];
  nextCursor: number;
  hasMore: boolean;
  totalCount: number;
  dailyResource: Resource;
};

export type VisitersInfo = {
  id: number;
  created_at: string;
  city: string;
  country: string;
  isp: string;
  query: string;
  lat: string;
  lan: string;
  regionName: string;
  zip: string;
};

export type Bookmarked = {
  id: number;
  resource_id: number;
  bookmarked_by: string;
};

type Admin = {
  isAdmin: Boolean;
};

type User = {
  email: string;
  expirationDate: string;
  iat: number;
  id: string;
};

export type UserWithAdmin = User & Admin;
const useUserData = create<{
  session: UserWithAdmin | null;
  setSession: (token?: string) => void;
  signOut: () => void;
}>((set) => ({
  session: null,
  setSession: async (tokenPramas?: string) => {
    //get token from localstorage
    const token = tokenPramas || localStorage.getItem("token");

    if (!token) {
      console.log("Token not found");
      return;
    }

    //check jwt format is correct or not
    const tokenArray = token.split(".");
    if (tokenArray.length !== 3) {
      errorToast("Invalid token");
      localStorage.removeItem("token");
      return;
    }

    //decode the token
    const decodedToken = jwt_decode(token) as UserWithAdmin;
    //check if the token is expired or not
    if (decodedToken.expirationDate < new Date().toISOString()) {
      errorToast("Token expired");
      localStorage.removeItem("token");
      return;
    }
    //check if the user is admin or not
    if (decodedToken.isAdmin) {
      set({ session: decodedToken });
    } else {
      set({ session: decodedToken });
    }
  },
  signOut: () => {
    set({ session: null });
    localStorage.removeItem("token");
    window.location.reload();
  },
}));

//array of all distinct tags available in the database and ignore if it is null
function shuffleArray(array: any[]) {
  // Creating a copy of the array to avoid modifying the original array
  const shuffledArray = array.slice();

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generating a random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swapping elements at indices i and randomIndex
    [shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ];
  }

  return shuffledArray;
}

const useAllTags = create<{
  allTags: string[];
  setAllTags: (tags?: string[]) => void;
}>((set) => ({
  allTags: [],
  setAllTags: async (tags) => {
    if (tags) {
      set({ allTags: shuffleArray(tags) });
      return;
    }
  },
}));

/* The above code is defining a custom hook called `useAllCategory` using the `create` function from
the `zustand` library. This hook has three properties: `allCategories`, `allPublicCategories`, and
`setAllCategories`. */
const useAllCategory = create<{
  allCategories: string[];
  allPublicCategories: string[];
  setAllCategories: (categories?: string[], allCategories?: string[]) => void;
}>((set) => ({
  allCategories: [],
  allPublicCategories: [],
  setAllCategories: async (categories, allCategories) => {
    if (categories) {
      set({ allCategories: categories });
    }
    if (allCategories) {
      set({ allPublicCategories: allCategories });
    }
  },
}));

const useGetPendingResources = create<{
  isPendingSelected: boolean;
  setIsPendingSelected: (value: boolean) => void;
}>((set) => ({
  isPendingSelected: false,
  setIsPendingSelected: (value: boolean) => {
    set({ isPendingSelected: value });
    useAllResources.getState().setAllResources("my");
  },
}));

type AllResourcesOption = {
  resources?: Resource[] | null;
  setActiveTab?: (arg: string) => void;
};

const useAllResources = create<{
  loading: boolean;
  allResources: Resource[];
  setAllResources: (arg: String, options?: AllResourcesOption) => void;
  cursor: number;
  totalResources: number;
  hasMore: boolean;
  setMeta: (arg: {
    cursor: number;
    totalResources: number;
    hasMore: boolean;
  }) => void;
}>((set) => ({
  loading: false,
  allResources: [],
  cursor: 30,
  totalResources: 0,
  hasMore: true,
  setMeta: (arg) => {
    set(arg);
  },
  setAllResources: async (selectedTab = "all", options) => {
    const { resources, setActiveTab } = options || {};

    set({ loading: true });
    if (selectedTab === "all") {
      if (!resources) {
        await promiseToast(getResources(30, 0), "", {
          errorMessage: "Failed to get resources",
          onSuccess: ({ data }) => {
            set({
              allResources: data.resources,
              cursor: data.nextCursor,
              totalResources: data.totalCount,
              hasMore: data.hasMore,
            });
            useTopProduct.getState().setTopProduct(data?.dailyResource);
            useAllTags.getState().setAllTags(data?.tags);
            useAllCategory
              .getState()
              .setAllCategories(data?.categories, data?.allCategories);
          },
        });
      } else {
        set({ allResources: resources });
      }
    } else if (selectedTab === "my") {
      let isPendingSelected =
        useGetPendingResources.getState().isPendingSelected;
      if (!isPendingSelected) {
        await promiseToast(getUserResources(), "", {
          errorMessage: "Failed to get resources",
          onSuccess: ({ data }) => {
            set({ allResources: data.userWebsites });
          },
          onError: () => {
            setActiveTab?.("all");
          },
        });
      } else {
        await promiseToast(getUserPendingResources(), "", {
          errorMessage: "Failed to get resources",
          onSuccess: ({ data }) => {
            set({ allResources: data.userWebsites });
          },
          onError: () => {
            setActiveTab?.("all");
          },
        });
      }
    } else if (selectedTab === "saved") {
      await promiseToast(getBookmarkedResources(), "", {
        errorMessage: "Failed to get resources",
        onSuccess: ({ data }) => {
          set({ allResources: data.bookmarkedResources });
        },
        onError: () => {
          setActiveTab?.("all");
        },
      });
    } else if (selectedTab === "publish") {
      await promiseToast(isAvailableForApproval(), "", {
        errorMessage: "Failed to get resources",
        onSuccess: ({ data }) => {
          set({ allResources: data.resources });
        },
        onError: () => {
          setActiveTab?.("all");
        },
      });
    }
    set((state) => ({ loading: false }));
  },
}));

const useSetAllResourcesServerSide = create<{
  setAllResourcesServerSide: (arg: {
    resources: Resource[];
    tags: string[];
    categories: string[];
    allCategories: string[];
    dailyResource: Resource;
    allTags: string[];
  }) => void;
}>((set) => ({
  setAllResourcesServerSide: async (arg) => {
    useAllResources.getState().setAllResources("all", {
      resources: arg.resources,
    });
    useAllTags.getState().setAllTags(arg.allTags);
    useAllCategory
      .getState()
      .setAllCategories(arg.categories, arg.allCategories);
    useTopProduct.getState().setTopProduct(arg.dailyResource);
  },
}));

const useFilterUsingCategoriesArray = create<{
  filteredResources: Resource[];
  setFilteredResources: (arg: string[]) => void;
}>((set) => ({
  filteredResources: [],
  setFilteredResources: async (categories) => {
    //if category is empty then return empty array
    if (categories.length === 0) {
      set({ filteredResources: [] });
      return;
    }

    //set filtered resources of tags to empty array
    //set manage selected tags array to empty array
    useManageSelectedTags.getState().setSelectedTags("");
    await promiseToast(getResourcesByCategories(categories), "", {
      errorMessage: "Failed to get resources",
      onSuccess: ({ data }) => {
        set({ filteredResources: data.resources });
      },
    });
    useFilterUsingTagsArray.getState().setFilteredResources([]);
  },
}));

const useSelectedTab = () => {
  const [selectedTab, setSelectedTab] = useQueryState("tab", {
    shallow: true,
    history: "replace",
    defaultValue: "all",
  });

  return { selectedTab, setSelectedTab };
};

const useUrlAtIndex = create<{
  urlAtIndex: string;
  setUrlAtIndex: () => void;
}>((set) => ({
  urlAtIndex: "",
  setUrlAtIndex: () => {},
}));

const useTopProduct = create<{
  topProduct: Resource | null;
  setTopProduct: (res: Resource) => void;
}>((set) => ({
  topProduct: null,
  setTopProduct: async (res: Resource) => {
    set({ topProduct: res });
  },
}));

const useSetBookmark = create<{
  setComplete: Boolean;
  setBookmark: (resourceId: string) => Promise<Resource>;
}>((set) => ({
  setComplete: false,
  setBookmark: async (resourceId: string) => {
    try {
      set((state) => ({ setComplete: !state.setComplete }));
      const data = await promiseToast(
        addBookmark(resourceId),
        "Added Bookmark!",
        {
          errorMessage: "Failed to bookmark",
          loadingText: "Adding Bookmark...",
          onSuccess: () => {
            set((state) => ({ setComplete: !state.setComplete }));
          },
        }
      );

      return data.data;
    } catch (err: any) {
      console.log(err);
    }
  },
}));

const useSetLikes = create<{
  setComplete: Boolean;
  setLikes: (resourceId: string) => Promise<Resource>;
}>((set) => ({
  setComplete: false,
  setLikes: async (resourceId: string) => {
    try {
      set((state) => ({ setComplete: !state.setComplete }));
      const { data } = await promiseToast(addLike(resourceId), "Liked!", {
        errorMessage: "Failed to like",
        onSuccess: () => {
          set((state) => ({ setComplete: !state.setComplete }));
        },
      });
      return data;
    } catch (err: any) {
      console.log(err);
    }
  },
}));

const useManageSelectedCategories = create<{
  selectedCategories: string[];
  setSelectedCategories: (category: string) => void;
}>((set) => ({
  selectedCategories: [],
  setSelectedCategories: (category: string) => {
    //if category is '' then set seletedCategories to empty array
    if (category === "") {
      set((state) => ({ selectedCategories: [] }));
      return;
    }

    //if category is already selected then remove it from the array
    if (
      useManageSelectedCategories
        .getState()
        .selectedCategories.includes(category)
    ) {
      set((state) => ({
        selectedCategories: state.selectedCategories.filter(
          (item) => item !== category
        ),
      }));
    } else {
      set((state) => ({
        selectedCategories: [...state.selectedCategories, category],
      }));
    }

    //call setFilteredResource after the state is changed
    useFilterUsingCategoriesArray
      .getState()
      .setFilteredResources(
        useManageSelectedCategories.getState().selectedCategories
      );
  },
}));

const useFilterUsingTagsArray = create<{
  filteredResources: any[];
  setFilteredResources: (tags: string[]) => void;
}>((set) => ({
  filteredResources: [],
  setFilteredResources: async (tags: string[]) => {
    //if tags array is empty return empty array
    if (tags.length === 0) {
      set({ filteredResources: [] });
      return;
    }
    //set filteredResources of category to empty array

    //set seletedCategories to empty array
    useManageSelectedCategories.getState().setSelectedCategories("");

    //if tags array is not empty then filter the resources
    await promiseToast(getResourcesByTags(tags), "", {
      errorMessage: "Failed to get resources",
      onSuccess: ({ data }) => {
        set({ filteredResources: data.resources });
      },
    });
    useFilterUsingCategoriesArray.getState().setFilteredResources([]);
  },
}));

const useManageSelectedTags = create<{
  selectedTags: string[];
  setSelectedTags: (tag: string) => void;
}>((set) => ({
  selectedTags: [],
  setSelectedTags: (tag: string) => {
    //if tag is '' then set seletedTags to empty array
    if (tag === "") {
      set({ selectedTags: [] });
      return;
    }
    if (useManageSelectedTags.getState().selectedTags.includes(tag)) {
      set((state) => ({
        selectedTags: state.selectedTags.filter((item) => item !== tag),
      }));
    } else {
      set((state) => ({ selectedTags: [...state.selectedTags, tag] }));
    }

    //call setFilteredResource after the state is changed
    useFilterUsingTagsArray
      .getState()
      .setFilteredResources(useManageSelectedTags.getState().selectedTags);
  },
}));

//login modal open state manage
const useLoginModal = create<{
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (value: boolean) => void;
}>((set) => ({
  isLoginModalOpen: false,
  setIsLoginModalOpen: (value: boolean) => {
    set({ isLoginModalOpen: value });
  },
}));

const useSearchModal = create<{
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (value: boolean) => void;
}>((set) => ({
  isSearchModalOpen: false,
  setIsSearchModalOpen: (value: boolean) => {
    set({ isSearchModalOpen: value });
  },
}));

export const themes = [
  {
    name: "github",
    importName: "theme-github",
  },
  {
    name: "solarized_dark",
    importName: "theme-solarized_dark",
  },
  {
    name: "dracula",
    importName: "theme-dracula",
  },
  {
    name: "monokai",
    importName: "theme-monokai",
  },
  {
    name: "terminal",
    importName: "theme-terminal",
  },
  {
    name: "twilight",
    importName: "theme-twilight",
  },
  {
    name: "xcode",
    importName: "theme-xcode",
  },
  {
    name: "ambiance",
    importName: "theme-ambiance",
  },
  {
    name: "chaos",
    importName: "theme-chaos",
  },
  {
    name: "clouds_midnight",
    importName: "theme-clouds_midnight",
  },
  {
    name: "cobalt",
    importName: "theme-cobalt",
  },
  {
    name: "crimson_editor",
    importName: "theme-crimson_editor",
  },
  {
    name: "dawn",
    importName: "theme-dawn",
  },
  {
    name: "dreamweaver",
    importName: "theme-dreamweaver",
  },
  {
    name: "eclipse",
    importName: "theme-eclipse",
  },
  {
    name: "gob",
    importName: "theme-gob",
  },
  {
    name: "gruvbox",
    importName: "theme-gruvbox",
  },
  {
    name: "idle_fingers",
    importName: "theme-idle_fingers",
  },
];

const useSelectTheme = create<{
  selectedTheme: string;
  setSelectedTheme: (value: string) => void;
}>((set) => ({
  selectedTheme: themes[1].name,
  setSelectedTheme: (value: string) => {
    set({ selectedTheme: value });
  },
}));

export const languages = [
  {
    name: "C/C++",
    value: "c_cpp",
    importName: "mode-c_cpp",
  },
  {
    name: "C#",
    value: "csharp",
    importName: "mode-csharp",
  },
  {
    name: "CSS",
    value: "css",
    importName: "mode-css",
  },
  {
    name: "Dart",
    value: "dart",
    importName: "mode-dart",
  },
  {
    name: "Django",
    value: "django",
    importName: "mode-django",
  },
  {
    name: "Dockerfile",
    value: "dockerfile",
    importName: "mode-dockerfile",
  },
  {
    name: "Elixir",
    value: "elixir",
    importName: "mode-elixir",
  },
  {
    name: "Elm",
    value: "elm",
    importName: "mode-elm",
  },
  {
    name: "Erlang",
    value: "erlang",
    importName: "mode-erlang",
  },
  {
    name: "Golang",
    value: "golang",
    importName: "mode-golang",
  },
  {
    name: "GraphQL Schema",
    value: "graphqlschema",
    importName: "mode-graphqlschema",
  },
  {
    name: "Haskell",
    value: "haskell",
    importName: "mode-haskell",
  },
  {
    name: "HTML",
    value: "html",
    importName: "mode-html",
  },
  {
    name: "Java",
    value: "java",
    importName: "mode-java",
  },
  {
    name: "JavaScript",
    value: "javascript",
    importName: "mode-javascript",
  },
  {
    name: "JSON",
    value: "json",
    importName: "mode-json",
  },
  {
    name: "Kotlin",
    value: "kotlin",
    importName: "mode-kotlin",
  },
  {
    name: "LaTeX",
    value: "latex",
    importName: "mode-latex",
  },
  {
    name: "Markdown",
    value: "markdown",
    importName: "mode-markdown",
  },
  {
    name: "MySQL",
    value: "mysql",
    importName: "mode-mysql",
  },
  {
    name: "Objective-C",
    value: "objectivec",
    importName: "mode-objectivec",
  },
  {
    name: "Pascal",
    value: "pascal",
    importName: "mode-pascal",
  },
  {
    name: "Perl",
    value: "perl",
    importName: "mode-perl",
  },
  {
    name: "PHP",
    value: "php",
    importName: "mode-php",
  },
  {
    name: "Python",
    value: "python",
    importName: "mode-python",
  },
  {
    name: "R",
    value: "r",
    importName: "mode-r",
  },
  {
    name: "Ruby",
    value: "ruby",
    importName: "mode-ruby",
  },
  {
    name: "Rust",
    value: "rust",
    importName: "mode-rust",
  },
  {
    name: "Sass",
    value: "sass",
    importName: "mode-sass",
  },
  {
    name: "Scala",
    value: "scala",
    importName: "mode-scala",
  },
  {
    name: "SCSS",
    value: "scss",
    importName: "mode-scss",
  },
  {
    name: "Shell",
    value: "sh",
    importName: "mode-sh",
  },
  {
    name: "SQL",
    value: "sql",
    importName: "mode-sql",
  },
  {
    name: "Swift",
    value: "swift",
    importName: "mode-swift",
  },
  {
    name: "TypeScript",
    value: "typescript",
    importName: "mode-typescript",
  },
  {
    name: "YAML",
    value: "yaml",
    importName: "mode-yaml",
  },
  {
    name: "XML",
    value: "xml",
    importName: "mode-xml",
  },
];

const useSelectLanguage = create<{
  selectedLanguage: string;
  displayLanguage: string;
  setSelectedLanguage: (value: string) => void;
}>((set) => ({
  selectedLanguage: languages[14].value,
  displayLanguage: languages[14].name,
  setSelectedLanguage: (value: string) => {
    set({
      selectedLanguage: value,
      displayLanguage:
        languages.find((item) => item.value === value)?.name || "",
    });
  },
}));

function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generateGradient() {
  const directions = [
    "to right",
    "to left",
    "to bottom",
    "to top",
    "to right top",
    "to left top",
    "to right bottom",
    "to left bottom",
  ];
  let gradient =
    "linear-gradient(" +
    directions[Math.floor(Math.random() * directions.length)] +
    ", ";

  // Generating a random number of colors (between 2 to 5)
  const numberOfColors = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < numberOfColors; i++) {
    gradient += generateRandomColor();
    if (i < numberOfColors - 1) {
      gradient += ", ";
    }
  }
  gradient += ")";
  return gradient;
}

// Define the state interface
interface UIState {
  height: string;
  width: string;
  borderRadius: number;
  selectedGradient: number;
  paddingX: number;
  paddingY: number;
  gradient: string;
  containerBorderRadius: number;
  setHeight: (newHeight: string) => void;
  setWidth: (newWidth: string) => void;
  setBorderRadius: (newBorderRadius: number) => void;
  setSelectedGradient: (newSelectedGradient: number) => void;
  setContainerBorderRadius: (newContainerBorderRadius: number) => void;
  setPaddingX: (newPaddingX: number) => void;
  setPaddingY: (newPaddingY: number) => void;
  setGradient: () => void;
}

// Create the store
const useUIStore = create<UIState>((set) => ({
  height: "50",
  width: "50",
  borderRadius: 10,
  selectedGradient: 0,
  paddingX: 40,
  paddingY: 40,
  containerBorderRadius: 0,
  gradient: generateGradient(), // Replace with actual function call
  setHeight: (newHeight) => set(() => ({ height: newHeight })),
  setWidth: (newWidth) => set(() => ({ width: newWidth })),
  setBorderRadius: (newBorderRadius) =>
    set(() => ({ borderRadius: newBorderRadius })),
  setSelectedGradient: (newSelectedGradient) =>
    set(() => ({ selectedGradient: newSelectedGradient })),
  setPaddingX: (newPaddingX) => set(() => ({ paddingX: newPaddingX })),
  setPaddingY: (newPaddingY) => set(() => ({ paddingY: newPaddingY })),
  setGradient: () => set(() => ({ gradient: generateGradient() })),
  setContainerBorderRadius: (newContainerBorderRadius) =>
    set(() => ({ containerBorderRadius: newContainerBorderRadius })),
}));

export {
  useAllCategory,
  useAllResources,
  useAllTags,
  useFilterUsingCategoriesArray,
  useFilterUsingTagsArray,
  useGetPendingResources,
  useLoginModal,
  useManageSelectedCategories,
  useManageSelectedTags,
  useSearchModal,
  useSelectedTab,
  useSelectLanguage,
  useSelectTheme,
  useSetAllResourcesServerSide,
  useSetBookmark,
  useSetLikes,
  useTopProduct,
  useUIStore,
  useUrlAtIndex,
  useUserData,
};
