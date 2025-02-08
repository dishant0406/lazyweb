import Modal from "@/components/shared/Modal";
import { event } from "nextjs-google-analytics";
import { useEffect, useState } from "react";
import { successToast } from "../../toast";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
  socket: any;
  roomID: string;
};

const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();
};

const MemebersModal = ({ isOpen, roomID, setIsOpen, socket }: Props) => {
  const [members, setMembers] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    socket.emit("fetchMembers", roomID);

    socket.on("membersList", (data: any) => {
      setMembers(data);
    });
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={`Members in room: ${members.length}`}
      className="md:w-[50vw]"
    >
      <h4 className="text-md md:whitespace-nowrap flex items-center gap-[10px] font-medium leading-6 text-white">
        Room ID:{" "}
        <span
          title={"Click to Copy"}
          onClick={() => {
            event("copy-room-id", {
              category: "room",
              action: "copy-room-id",
              label: "copy-room-id",
            });
            navigator.clipboard.writeText(roomID);
            successToast("Copied to clipboard");
          }}
          className="font-bold text-blue-300 cursor-pointer"
        >
          {roomID}
        </span>
      </h4>
      <div className="mt-4">
        {members.length === 0 && (
          <div className="text-center text-white">No members in this room.</div>
        )}

        {members.length > 0 &&
          members.length !== 1 &&
          members[0].id === socket.id && (
            <ul className="divide-y divide-emerald-200">
              {members.map((member, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-white">{capitalize(member.name)}</span>
                  {member.id === socket.id && (
                    <span className="text-sm text-green-400">Admin</span>
                  )}
                </li>
              ))}
            </ul>
          )}

        {members.length === 1 && members[0].id === socket.id && (
          <div className="text-center text-white">
            You are the admin, no other members yet.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MemebersModal;
