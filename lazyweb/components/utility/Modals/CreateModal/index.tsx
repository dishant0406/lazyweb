import { useUserData } from "@/hooks";
import { axiosInstance } from "@/hooks/Zustand";
import { unFormatUrl } from "@/lib/unFormatUrl";
import { Dialog, Transition } from "@headlessui/react";
import { Input } from "@nextui-org/react";
import axios from "axios";
import { useWebsiteMetaData, useWebsiteScreenshot } from "hooks";
import { formatUrl } from "lib/formatUrl";
import { event } from "nextjs-google-analytics";
import { Fragment, useState } from "react";
let placeholder = "assets/placeholder-website.png";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
};

const CreateModal = ({ isOpen, setIsOpen }: Props) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(placeholder);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [err, setError] = useState<String | null>(null);
  const session = useUserData((state) => state.session);
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
    setTimeout(() => {
      setTitle("");
      setUrl("");
      setDescription("");
      setTags("");
      setImage(placeholder);
      setLoadingFetch(false);
      setError(null);
      setLoading(false);
    }, 300);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function isHttpsSupported(url: string) {
    // Make sure the URL starts with http:// or https://
    try {
      const { data } = await axios.post("/api/check-https", { url: url });
      return data.supportsHttps;
    } catch (e) {
      return false;
    }
  }

  const handleAdd = async () => {
    setLoading(true);

    if (session && image && title && description) {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        const requestBody = {
          url: unFormatUrl(url),
          image_url: image,
          title: title,
          desc: description,
          // Assuming you also want to send isPublicAvailable, category, and tags
          // (you might need to define them in your component or receive them as input)
          // isPublicAvailable: isPublicAvailable,
          // category: category,
          // tags: tags
        };

        // Setting up headers for axios request
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axiosInstance.post(
          "/websites/add",
          requestBody,
          config
        );

        // Assuming server responds with JSON containing data
        if (response.data.error) {
          throw new Error(response.data.error);
        }

        closeModal();
      } catch (error: any) {
        console.error(error);
        setError(error.message || "An error occurred.");
      }
    } else {
      setError("Please Fill all the fields");
    }

    setLoading(false);
  };

  const handleFetchDetails = async () => {
    setLoadingFetch(true);
    setError(null);

    if (!url) {
      setError("Please Enter a URL");
      setLoadingFetch(false);
      return;
    }

    let isHttps = await isHttpsSupported(url);
    if (!isHttps) {
      setError("Please Enter a Valid URL, HTTP is not supported");
      setLoadingFetch(false);
      return;
    }

    const websiteMetaDeta = await useWebsiteMetaData(formatUrl(url));
    if (websiteMetaDeta) {
      setTitle(websiteMetaDeta.title);
      setDescription(websiteMetaDeta.description);
      if (websiteMetaDeta.title) {
        const imagelink = await useWebsiteScreenshot(formatUrl(url));
        if (imagelink) {
          setImage(imagelink);
        }
      }
      if (!websiteMetaDeta.title || !websiteMetaDeta.description) {
        setError(
          "In the event that the system is unable to retrieve the correct TITLE or DESCRIPTION, please enter them manually."
        );
      }
    } else {
      setError("Please Check your Url");
    }
    setLoadingFetch(false);
  };

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment as any}
      enter="transition duration-100 ease-out"
    >
      <Dialog as="div" className={`relative z-10`} onClose={closeModal}>
        <Transition.Child
          as={Fragment as any}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex dark items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment as any}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${
                  loading ? "animate-pulse" : ""
                } max-w-md transform overflow-hidden rounded-2xl bg-gray p-6 text-left align-middle shadow-xl transition-all`}
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Add a Resource
                </Dialog.Title>
                {err && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600 font-[600]">{err}</p>
                  </div>
                )}

                <Input
                  color="default"
                  type="url"
                  readOnly={loadingFetch}
                  label="Enter the URL"
                  placeholder="lazyweb.rocks"
                  labelPlacement="outside"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  classNames={{
                    input: "bg-[#35363a] border-none outline-none text-white",
                    inputWrapper: "bg-[#35363a] w-[90%]",
                    label: "mt-[0.5rem]",
                  }}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        https://
                      </span>
                    </div>
                  }
                />
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={loadingFetch}
                    className="inline-flex justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    onClick={() => {
                      event("fetch-details", {
                        category: "bookmark",
                        action: "fetch-details",
                        label: "fetch-details",
                      });
                      handleFetchDetails();
                    }}
                  >
                    {loadingFetch ? "Fetching..." : "Fetch Details"}
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-white">Title</p>
                </div>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="LazyWeb"
                  className="bg-[#35363a] w-[90%] border-none outline-none text-white h-[2.5rem] mt-[0.5rem] px-[1rem] rounded-[12px]"
                />

                <div className="mt-4">
                  <p className="text-sm text-white">Description</p>
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resources that you need..."
                  className="bg-[#35363a] w-[90%] border-none outline-none text-white  mt-[0.5rem] py-[0.5rem] px-[1rem] rounded-[12px]"
                />

                <div className="mt-4 w-full justify-center flex">
                  <img className="h-[220px] rounded-lg w-[300px]" src={image} />
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={title == "" || image === placeholder || loading}
                    className="inline-flex disabled:opacity-50 justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    onClick={() => {
                      event("add-resource", {
                        category: "bookmark",
                        action: "add-resource",
                        label: "add-resource",
                      });
                      handleAdd();
                    }}
                  >
                    {loading ? "Adding..." : "Add"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateModal;
