import { CodeBlock } from "@/components/shared/Micro";
import Modal from "@/components/shared/Modal";
import QRCode from "@/components/shared/QrCode";
import { formatUrl } from "@/lib/formatUrl";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
  url?: string;
};

const QrCodeModal = ({ isOpen, setIsOpen, url }: Props) => {
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <Modal
      className="max-w-fit"
      isOpen={isOpen}
      onClose={closeModal}
      title="QR Code"
    >
      <div className="px-[1rem] py-[0.5rem] rounded-md mb-[1rem]">
        <CodeBlock
          className="border shadow-custom border-input"
          prefix="#"
          code={formatUrl(url || "")}
        />
      </div>
      <div className={`p-[2rem] rounded-md flex justify-center  items-center`}>
        <div className="bg-white">
          <QRCode url={url || ""} />
        </div>
      </div>

      <div className="bg-gray px-[1rem] py-[0.5rem] rounded-md mt-[1rem]">
        <p className="text-white text-[14px]">
          Scan QR Code to open in your mobile
        </p>
      </div>
    </Modal>
  );
};

export default QrCodeModal;
