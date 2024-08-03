import { Dialog, Transition } from "@headlessui/react";
import { event } from "nextjs-google-analytics";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    socket.emit("fetchMembers", roomID);

    socket.on("membersList", (data: any) => {
      setMembers(data);
    });
  }, [isOpen]);

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment as any}
      enter="transition duration-100 ease-out"
    >
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={Fragment as any}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment as any}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="md:min-w-[28rem] transform overflow-hidden rounded-2xl bg-gray p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg md:whitespace-nowrap flex items-center gap-[10px] font-medium leading-6 text-white"
                >
                  Members of this room
                  <span className="text-lg text-gray-400 ">
                    ({members.length})
                  </span>
                </Dialog.Title>
                <Dialog.Title
                  as="h4"
                  className="text-md md:whitespace-nowrap flex items-center gap-[10px] font-medium leading-6 text-white"
                >
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
                      toast.success("Copied to clipboard");
                    }}
                    className="font-bold text-blue-300 cursor-pointer"
                  >
                    {roomID}
                  </span>
                </Dialog.Title>
                <div className="mt-4">
                  {members.length === 0 && (
                    <div className="text-center text-white">
                      No members in this room.
                    </div>
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
                            <span className="text-white">
                              {capitalize(member.name)}
                            </span>
                            {member.id === socket.id && (
                              <span className="text-sm text-green-400">
                                Admin
                              </span>
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MemebersModal;
