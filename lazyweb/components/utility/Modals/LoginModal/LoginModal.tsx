import { Input } from "@/components/shared/Micro";
import Modal, { ModalFooter } from "@/components/shared/Modal";
import { AuthError, Provider, Session, User } from "@supabase/supabase-js";
import axios from "axios";
import { event } from "nextjs-google-analytics";
import { useState } from "react";
import { GitHub } from "react-feather";
import { PuffLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
};

type Data =
  | {
      user: User | null;
      session: Session | null;
    }
  | {
      user: null;
      session: null;
    };

type DataGithub =
  | {
      provider: Provider;
      url: string;
    }
  | {
      provider: Provider;
      url: null;
    };

const LoginModal = ({ isOpen, setIsOpen }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    | AuthError
    | null
    | {
        message: string;
      }
  >(null);
  const [data, setData] = useState<Data | DataGithub | null>(null);

  function closeModal() {
    setIsOpen(false);
    setTimeout(() => {
      setEmail("");
      setLoading(false);
      setError(null);
      setData(null);
    }, 300);
  }

  const handleLogin = async () => {
    if (!email) return;

    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/))
      return setError({
        message: "Invalid Email",
      });

    setLoading(true);
    setData(null);
    setError(null);
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/api/auth/login`,
      {
        email,
      }
    );
    setData(data);

    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setData(null);
    setError(null);
    var width = 500;
    var height = 600;
    var left = window.innerWidth / 2;
    var top = (window.innerHeight - height) / 2;
    var url = `${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/oauth/github`;
    var options =
      "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no," +
      "width=" +
      width +
      ",height=" +
      height +
      ",top=" +
      top +
      ",left=" +
      left;

    var popup = window.open(url, "Github", options);

    window.addEventListener(
      "message",
      (event) => {
        if (event.data.jwt) {
          const { jwt } = event.data;
          localStorage.setItem("token", jwt);
          window.location.reload();
          setIsOpen(false);
          if (popup) popup.close();
        }
      },
      false
    );
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Login Using Magic Link"
      className="w-full max-w-md"
      footer={
        <ModalFooter className="mt-4 justify-end flex gap-[1rem] items-center">
          <button
            onClick={() => {
              event("login", {
                category: "login",
                action: "login",
                label: "login",
              });
              handleLogin();
            }}
            type="button"
            disabled={!data || error ? false : true}
            className="inline-flex min-w-[6rem] justify-center rounded-md border border-transparent bg-[#1c64ec] text-white px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {!data || error ? (
              !loading ? (
                "Sign In"
              ) : (
                <PuffLoader size={20} color="#fff" />
              )
            ) : (
              "Email Sent"
            )}
          </button>
          <p className="text-white">or</p>
          <button
            onClick={() => {
              event("login-with-github", {
                category: "login",
                action: "login-with-github",
                label: "login-with-github",
              });
              handleGithubLogin();
            }}
            className="w-[7rem] py-1 text-lightGray rounded-lg px-[0.5rem] flex justify-center items-center gap-[0.5rem] bg-altGray"
          >
            <GitHub className="text-lightGray h-[2rem]" />
            Github
          </button>
        </ModalFooter>
      }
    >
      <div className="mt-2">
        <p className="text-sm text-white">
          {!data
            ? "Enter Your Email"
            : "Check your Email (and spam folder) for a login link"}
        </p>
      </div>

      {(!data || error) && (
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="joe@lazyweb.rocks"
        />
      )}
    </Modal>
  );
};

export default LoginModal;
