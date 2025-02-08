import { Input, SelectWithLabel } from "@/components/shared/Micro";
import Modal, { ModalFooter } from "@/components/shared/Modal";
import { useAllCategory, useAllResources, useAllTags } from "hooks/Zustand";
import { event } from "nextjs-google-analytics";
import { useState } from "react";
import { publishResource } from "../../api";
import { promiseToast } from "../../toast";
import { SelectOption } from "../../types";
let placeholder = "assets/placeholder-website.png";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
  url: string;
  title: string;
  id: string;
};

const PublishModal = ({ isOpen, setIsOpen, url, title, id }: Props) => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState(placeholder);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [err, setError] = useState<String | null>(null);
  const { setAllResources } = useAllResources();
  const { setAllTags } = useAllTags();
  const { setAllCategories, allCategories } = useAllCategory();

  function closeModal() {
    setIsOpen(false);
    setTimeout(() => {
      setDescription("");
      setTags([]);
      setImage(placeholder);
      setLoadingFetch(false);
      setError(null);
    }, 300);
  }

  function openModal() {
    setIsOpen(true);
  }

  const options = allCategories.map((e) => {
    return { value: e, label: e };
  });

  const optionsTags = [
    { value: "new", label: "new" },
    { value: "retro", label: "retro" },
    { value: "all time favourite", label: "all time favourite" },
    { value: "great help", label: "great help" },
    { value: "must use", label: "must use" },
  ];

  const handleTags = (e: SelectOption[]) => {
    let tagsArr: string[] = [];
    e.map((f) => {
      tagsArr.push(f.value.toLowerCase());
    });
    setTags(tagsArr);
  };

  const handleAdd = async () => {
    if (category && tags?.length > 0) {
      setLoadingFetch(true);
      setError("");

      try {
        await promiseToast(
          publishResource(id, {
            category: category.toLowerCase(),
            tags: tags,
          }),
          "Published",
          {
            errorMessage: "Failed to publish",
            loadingText: "Publishing Resource...",
            onSuccess: (response) => {
              if (response.data.error) {
                throw new Error(response.data.error);
              }
              setAllResources("my");
              setAllTags();
              setAllCategories();
              closeModal();
            },
          }
        );
      } catch (error: any) {
        setError(error.message || "An error occurred.");
      } finally {
        setLoadingFetch(false);
      }
    } else {
      setError("Enter Valid Data for Submitting for Public View");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Publish Resource"
      className="md:w-[30vw]"
      footer={
        <ModalFooter className="w-full flex justify-end">
          <button
            type="button"
            disabled={title == "" && image == placeholder && loadingFetch}
            className="inline-flex justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => {
              event("publish", {
                category: "publish",
                action: "publish",
                label: "publish",
              });
              handleAdd();
            }}
          >
            {loadingFetch ? "Loading..." : "Submit for Publishing"}
          </button>
        </ModalFooter>
      }
    >
      {err && (
        <div className="mt-2">
          <p className="text-sm text-red-600 font-[600]">{err}</p>
        </div>
      )}
      <div className="mt-2">
        <p className="text-sm text-white">URL</p>
      </div>

      <Input disabled value={url} placeholder="lazyweb.com" />

      <div>
        <div className="mt-4">
          <p className="text-sm text-white">Title</p>
        </div>

        <Input disabled value={title} placeholder="LazyWeb" />
      </div>
      <div className="">
        <SelectWithLabel
          showIcons
          label="Category"
          selectedOptions={
            category
              ? [
                  {
                    label: category,
                    value: category,
                  },
                ]
              : []
          }
          setSelectedOptions={(e) =>
            e && e.length ? setCategory(e[0]?.value) : setCategory("")
          }
          options={options}
        />
      </div>

      <SelectWithLabel
        label="Tags"
        isMultiSelect
        setSelectedOptions={(e) => handleTags(e)}
        options={optionsTags}
        selectedOptions={tags.map((e) => {
          return {
            label: e,
            value: e,
          } as SelectOption;
        })}
      />
    </Modal>
  );
};

export default PublishModal;
