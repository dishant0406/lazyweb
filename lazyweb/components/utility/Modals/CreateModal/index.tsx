import { Button, InputWithLabel, TextArea } from "@/components/shared/Micro";
import Modal, { ModalFooter } from "@/components/shared/Modal";
import { useUserData } from "@/hooks";
import { unFormatUrl } from "@/lib/unFormatUrl";
import axios from "axios";
import { useWebsiteMetaData, useWebsiteScreenshot } from "hooks";
import { formatUrl } from "lib/formatUrl";
import { event } from "nextjs-google-analytics";
import { useState } from "react";
import { addResource } from "../../api";
import { promiseToast } from "../../toast";
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

        await promiseToast(addResource(requestBody), "Added!", {
          errorMessage: "Failed to add resource",
          loadingText: "Adding Resource...",
          onSuccess: (data) => {
            if (data.data.error) {
              throw new Error(data.data.error);
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
      className="max-w-[30rem]"
      isOpen={isOpen}
      onClose={closeModal}
      title="Add Resource"
      footer={
        <ModalFooter className="flex w-full justify-end">
          <Button
            disabled={
              title == "" ||
              image === placeholder ||
              loading ||
              !session ||
              loadingFetch
            }
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
          </Button>
        </ModalFooter>
      }
    >
      {err && <p className="text-sm text-red-600 font-[600]">{err}</p>}

      <InputWithLabel
        color="default"
        type="url"
        readOnly={loadingFetch}
        label="Enter the URL"
        placeholder="lazyweb.rocks"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        prefix="https://"
      />
      <div className="mt-4">
        <Button
          type="button"
          disabled={loadingFetch || !url}
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
        </Button>
      </div>

      <InputWithLabel
        contClassName="mt-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="LazyWeb"
        readOnly={loadingFetch}
        label="Title"
      />

      <div className="mt-4">
        <p className="text-sm text-white">Description</p>
      </div>

      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Resources that you need..."
      />

      <div className="mt-4 w-full justify-center flex">
        <img className="h-[220px] rounded-lg w-[300px]" src={image} />
      </div>
    </Modal>
  );
};

export default CreateModal;
