import { InputWithLabel } from "@/components/shared/Micro";
import Modal from "@/components/shared/Modal";
import { useUserData } from "@/hooks";
import { Resource } from "@/hooks/Zustand";
import { unFormatUrl } from "@/lib/unFormatUrl";
import axios from "axios";
import { useWebsiteMetaData, useWebsiteScreenshot } from "hooks";
import { formatUrl } from "lib/formatUrl";
import { event } from "nextjs-google-analytics";
import { useEffect, useState } from "react";
import { addResource } from "../../api";
import { promiseToast } from "../../toast";
let placeholder = "assets/placeholder-website.png";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
  resource: Resource;
};

const UpdateModal = ({ isOpen, setIsOpen, resource }: Props) => {
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

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setUrl(unFormatUrl(resource.url));
      setDescription(resource.desc);
      setImage(resource.image_url);
    }
  }, [resource, isOpen]);

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
        const requestBody = {
          url: unFormatUrl(url),
          image_url: image,
          title: title,
          desc: description,
        };

        await promiseToast(addResource(requestBody), "Added.", {
          errorMessage: "Failed to add resource",
          loadingText: "Adding Resource...",
          onSuccess: (response) => {
            // Assuming server responds with JSON containing data
            if (response.data.error) {
              throw new Error(response.data.error);
            }

            closeModal();
          },
        });
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
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Update Resource"
      className="max-w-[30rem]"
    >
      {
        <div className="mt-2">
          <p className="text-sm text-red-600 font-[600]">
            {err || resource.isPublicAvailable
              ? "Updating a public resource will make it private and subject to review by our team."
              : null}
          </p>
        </div>
      }

      <InputWithLabel
        type="url"
        readOnly={true}
        label="Enter the URL"
        placeholder="lazyweb.rocks"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        prefix={"https://"}
      />

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
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </Modal>
  );
};

export default UpdateModal;
