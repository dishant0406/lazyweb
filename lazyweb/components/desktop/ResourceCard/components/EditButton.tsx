import { ContextMenu } from "@/components/shared/Micro";
import { ImageIcon } from "lucide-react";
import { TbEditCircle } from "react-icons/tb";

interface EditButtonProps {
  onRefetchImage: () => void;
  loading: boolean;
}

export const EditButton = ({ onRefetchImage, loading }: EditButtonProps) => {
  return (
    <ContextMenu
      menuClassName="border border-input"
      trigger={
        <button className="outline-none">
          <TbEditCircle className="text-lg text-white hover:scale-110 cursor-pointer transition-all" />
        </button>
      }
      items={[
        {
          label: "Refetch Image",
          icon: <ImageIcon height={16} width={16} className=" text-white" />,
          onClick: onRefetchImage,
          disabled: loading,
        },
      ]}
    />
  );
};
