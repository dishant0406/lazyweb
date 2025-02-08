// @ts-nocheck

import cn from "classnames";
import { Edit } from "lucide-react";
import { type LegacyRef, useEffect, useRef, useState } from "react";

import { Button, Input, Modal, ModalFooter, Tooltip } from "..";

import { errorToast, promiseToast } from "@/components/utility/toast";
import Textarea from "../TextArea";

type EditableTextProps = {
  text: string;
  onSave: (value: string) => Promise<any> | undefined;
  className: string;
  successText?: string;
  onSuccess?: () => void;
  isEditable?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  isArea?: boolean;
  title?: string;
};

const EditableText = ({
  text,
  onSave,
  className,
  successText,
  onSuccess,
  isEditable = true,
  placeholder,
  minLength,
  maxLength,
  isArea,
  title,
}: EditableTextProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

  const handleSave = () => {
    const onSaveValue = onSave(value);

    if (!onSaveValue) {
      return;
    }

    promiseToast(onSaveValue, successText || "Saved successfully", {
      errorMessage: "Failed to save",
      onSuccess: () => {
        setIsModalOpen(false);
        onSuccess?.();
      },
    });
  };

  const onEditClick = () => {
    if (isEditable) {
      setIsModalOpen(true);
      return;
    }

    errorToast("You don't have permission to edit this feature");
  };

  useEffect(() => {
    if (isModalOpen) {
      setValue(text);
      inputRef.current?.focus();
    }
  }, [isModalOpen, text]);

  return (
    <>
      <span className="flex gap-2  py-2 w-full items-center">
        <p
          className={cn(className, {
            "!text-primary italic": !text,
          })}
        >
          {text || placeholder || "No data"}
        </p>
        <Tooltip
          content={
            isEditable
              ? title || "Edit"
              : "You don't have permission to edit this feature"
          }
        >
          <Edit
            className={cn("h-4 w-4 cursor-pointer", {
              "text-primary": isEditable,
              "text-muted-foreground": !isEditable,
            })}
            onClick={onEditClick}
          />
        </Tooltip>
      </span>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title || "Edit"}
        className="md:!w-[50vw] w-[95vw]"
        footer={
          <ModalFooter>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </ModalFooter>
        }
      >
        {!isArea && (
          <Input
            ref={inputRef as LegacyRef<HTMLInputElement>}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full"
          />
        )}
        {isArea && (
          <Textarea
            ref={inputRef as LegacyRef<HTMLTextAreaElement>}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-32 resize-none"
          />
        )}
      </Modal>
    </>
  );
};

export default EditableText;
