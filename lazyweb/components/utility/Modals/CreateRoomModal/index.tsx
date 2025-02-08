import Modal from "@/components/shared/Modal";
import { useUserData } from "@/hooks";
import { event } from "nextjs-google-analytics";
import { useState } from "react";

import { Button, Input } from "@/components/shared/Micro";
import Checkbox from "@/components/shared/Micro/CheckBox";
import { Socket } from "socket.io-client";
import {
  adjectives,
  colors,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { errorToast, successToast } from "../../toast";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
  setIsRoomJoined: (arg: boolean) => void;
  setRoomID: (arg: string) => void;
  code: string;
  setDisplayName: (arg: string) => void;
  initializeSocket: () => Socket;
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
  initializeSocket,
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

  const handleSubmit = async () => {
    if (type === "new") {
      if (roomId === "") {
        errorToast("Please enter a room id");
        return;
      }

      const socket = initializeSocket();

      socket.emit("createRoom", {
        roomId,
        isPrivate,
        password,
      });

      socket.on("joinSuccess", (data: any) => {
        setRoomID(data.roomId);
        setIsRoomJoined(true);
        setName(data.name);
        successToast("Joined Room Successfully");
        closeModal();
      });
    }
    if (type === "join") {
      if (roomId === "") {
        errorToast("Please enter a room id");
        return;
      }
      if (displayName === "") {
        errorToast("Please enter a display name or generate one");
        return;
      }

      const socket = initializeSocket();

      socket.emit("joinRoom", {
        roomId,
        password,
        name: displayName,
      });

      socket.on("joinSuccess", (data: any) => {
        setRoomID(data.roomId);
        setIsRoomJoined(true);
        setName(data.name);
        successToast("Joined Room Successfully");
        closeModal();
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="md:w-[40vw]"
      title="Create Room"
    >
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
            Enter the Details for {type === "new" ? "New Room" : "Room"}
          </p>
          <div className="w-full flex items-center gap-[1rem]">
            <Input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              type="text"
              placeholder={
                type === "new" ? "New Room ID or Generate" : "Room ID"
              }
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
              >
                Want to keep it private?
              </Checkbox>
            </div>
          )}

          {isPrivate && (
            <div className="w-full mt-[1rem]">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Password"
              />
            </div>
          )}

          {type === "join" && (
            <div className="w-full mt-[1rem]">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Room Password (if any)"
              />
            </div>
          )}
          {type === "join" && (
            <div className="w-full mt-[1rem] flex items-center gap-[1rem]">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                type="text"
                placeholder={"Display Name"}
              />
              {type === "join" && (
                <Button
                  onClick={() => {
                    event("generate-display-name", {
                      category: "room",
                      action: "generate-display-name",
                      label: "generate-display-name",
                    });
                    setDisplayName(generateDisplayName());
                  }}
                >
                  <span>Generate</span>
                </Button>
              )}
            </div>
          )}

          <div className="w-full mt-[1rem]">
            <Button
              onClick={() => {
                event("submit-room", {
                  category: "room",
                  action: "submit-room",
                  label: "submit-room",
                });
                handleSubmit();
              }}
            >
              {type === "new" ? "Create Room" : "Join Room"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateRoomModal;
