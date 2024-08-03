import { useUserData } from "@/hooks";
import { Dialog, Transition } from "@headlessui/react";
import { event } from "nextjs-google-analytics";
import { Fragment, useState } from "react";
import { Checkbox } from "react-input-checkbox";
import { toast } from "react-toastify";
import {
  adjectives,
  colors,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
  socket: any;
  setIsRoomJoined: (arg: boolean) => void;
  setRoomID: (arg: string) => void;
  code: string;
  setDisplayName: (arg: string) => void;
};

const generateName = () => {
  const randomName: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, names],
  });

  return randomName;
};

const generateDisplayName = () => {
  const randomName: string = uniqueNamesGenerator({
    dictionaries: [names],
  });

  return randomName;
};

const CreateRoomModal = ({
  isOpen,
  setDisplayName: setName,
  setIsOpen,
  code,
  setIsRoomJoined,
  setRoomID,
  socket,
}: Props) => {
  const { setSession } = useUserData();
  const [type, setType] = useState<"new" | "join" | "">("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>(generateDisplayName());
  const [roomId, setRoomId] = useState<string>(generateName());

  function closeModal() {
    setIsOpen(false);
    setTimeout(() => {
      setType("");
    }, 300);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleSubmit = async () => {
    if (type === "new") {
      if (roomId === "") {
        toast.error("Please enter a room id");
        return;
      }
      socket.emit("createRoom", {
        roomId,
        isPrivate,
        password,
      });
    }
    if (type === "join") {
      if (roomId === "") {
        toast.error("Please enter a room id");
        return;
      }
      if (displayName === "") {
        toast.error("Please enter a display name or generate one");
        return;
      }
      socket.emit("joinRoom", {
        roomId,
        password,
        name: displayName,
      });
    }

    socket.on("joinSuccess", (data: any) => {
      setRoomID(data.roomId);
      setIsRoomJoined(true);
      setName(data.name);
      toast.success("Joined Room Successfully");
      closeModal();
    });
  };

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
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl bg-gray">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Join Room
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-white">
                    Join a room to share with your friends
                  </p>
                </div>

                <div className="mt-4 w-full flex justify-center gap-[1rem]">
                  <button
                    onClick={() => {
                      event("create-new-room", {
                        category: "room",
                        action: "create-new-room",
                        label: "create-new-room",
                      });
                      setType("new");
                      setDisplayName("");
                      setPassword("");
                      setRoomId("");
                      setIsPrivate(false);
                    }}
                    className={`flex ${
                      type === "new"
                        ? "bg-[#353535] text-white"
                        : "bg-white text-[#1e1e1e]"
                    } items-center gap-[10px] font-medium transition-all duration-300 px-[10px] py-[5px] rounded-md`}
                  >
                    <span>New Room</span>
                  </button>
                  <button
                    onClick={() => {
                      event("join-room", {
                        category: "room",
                        action: "join-room",
                        label: "join-room",
                      });
                      setType("join");
                      setDisplayName("");
                      setPassword("");
                      setRoomId("");
                      setIsPrivate(false);
                    }}
                    className={`flex items-center transition-all duration-300 gap-[10px] font-medium ${
                      type === "join"
                        ? "bg-[#353535] text-white"
                        : "bg-white text-[#1e1e1e]"
                    } px-[10px] py-[5px] rounded-md`}
                  >
                    <span>Join Room</span>
                  </button>
                </div>

                {type !== "" && (
                  <div className="w-full mt-4">
                    <p className="text-sm mb-[10px] text-white">
                      Enter the Details for{" "}
                      {type === "new" ? "New Room" : "Room"}
                    </p>
                    <div className="w-full flex items-center gap-[1rem]">
                      <input
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        type="text"
                        placeholder={
                          type === "new" ? "New Room ID or Generate" : "Room ID"
                        }
                        className="w-full focus:outline-none bg-[#3b3b3b] text-white px-[10px] py-[5px] rounded-md"
                      />
                      {type === "new" && (
                        <button
                          onClick={() => {
                            event("generate-room-id", {
                              category: "room",
                              action: "generate-room-id",
                              label: "generate-room-id",
                            });
                            setRoomId(generateName());
                          }}
                          className="flex items-center gap-[10px] font-medium text-[#1e1e1e] bg-white px-[10px] py-[5px] rounded-md"
                        >
                          <span>Generate</span>
                        </button>
                      )}
                    </div>
                    {type == "new" && (
                      <div className="w-full mt-[1rem] text-white">
                        <Checkbox
                          onChange={(e: any) => {
                            setIsPrivate(e.target.checked);
                          }}
                          value={isPrivate}
                          theme="bootstrap-checkbox"
                        >
                          Want to keep it private?
                        </Checkbox>
                      </div>
                    )}

                    {isPrivate && (
                      <div className="w-full mt-[1rem]">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          autoComplete="new-password"
                          placeholder="Password"
                          className="w-full focus:outline-none bg-[#3b3b3b] text-white px-[10px] py-[5px] rounded-md"
                        />
                      </div>
                    )}

                    {type === "join" && (
                      <div className="w-full mt-[1rem]">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          autoComplete="new-password"
                          placeholder="Room Password (if any)"
                          className="w-full focus:outline-none bg-[#3b3b3b] text-white px-[10px] py-[5px] rounded-md"
                        />
                      </div>
                    )}
                    {type === "join" && (
                      <div className="w-full mt-[1rem] flex items-center gap-[1rem]">
                        <input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          type="text"
                          placeholder={"Display Name"}
                          className="w-full focus:outline-none bg-[#3b3b3b] text-white px-[10px] py-[5px] rounded-md"
                        />
                        {type === "join" && (
                          <button
                            onClick={() => {
                              event("generate-display-name", {
                                category: "room",
                                action: "generate-display-name",
                                label: "generate-display-name",
                              });
                              setDisplayName(generateDisplayName());
                            }}
                            className="flex items-center gap-[10px] font-medium text-[#1e1e1e] bg-white px-[10px] py-[5px] rounded-md"
                          >
                            <span>Generate</span>
                          </button>
                        )}
                      </div>
                    )}

                    <div className="w-full mt-[1rem]">
                      <button
                        onClick={() => {
                          event("submit-room", {
                            category: "room",
                            action: "submit-room",
                            label: "submit-room",
                          });
                          handleSubmit();
                        }}
                        className="w-full focus:outline-none bg-white text-[#3b3b3b] px-[10px] py-[5px] rounded-md"
                      >
                        {type === "new" ? "Create Room" : "Join Room"}
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateRoomModal;
