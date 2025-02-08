const logo = "/assets/Logo.png";
import { useUserData } from "@/hooks";
import { useLoginModal } from "@/hooks/Zustand";
import { CreateResource, LoginModal, ProfileIcon } from "components";
import { useRouter } from "next/router";
import { event } from "nextjs-google-analytics";
import { useEffect } from "react";
import ReactTooltip from "react-tooltip";

type Props = {};

const IconWithToolTip = ({
  img,
  title,
  path,
}: {
  img: string;
  title: string;
  path: string;
}) => {
  const router = useRouter();
  return (
    <>
      <a data-tip data-for={title.toLocaleLowerCase().replaceAll(" ", "-")}>
        <img
          onClick={() => {
            router.push(path);
          }}
          src={img}
          className="h-[1.5rem] cursor-pointer"
        />
      </a>
      <ReactTooltip
        className="bg-gray"
        type="warning"
        id={title.toLocaleLowerCase().replaceAll(" ", "-")}
        place="bottom"
      >
        {title}
      </ReactTooltip>
    </>
  );
};

const NavBar: React.FC<Props> = (props) => {
  // const [isOpen, setIsOpen] = useState(false)
  const { isLoginModalOpen: isOpen, setIsLoginModalOpen: setIsOpen } =
    useLoginModal();
  const { session, setSession, signOut } = useUserData();
  const router = useRouter();

  useEffect(() => {
    setSession();
  }, []);

  const signoutHandler = async () => {
    signOut();
  };

  return (
    <div className="w-[100vw] z-[4] fixed border-b  md:flex hidden justify-between items-center h-[70px] bg-background shadow-custom border border-input">
      <div className="flex items-center">
        <div
          title={"Go to home page"}
          onClick={() => {
            event("go-home", {
              category: "home",
              action: "go-home",
              label: "home",
            });
            router.push("/");
          }}
          className="bg-white cursor-pointer lazyweb-logo w-[140px] ml-[20px]"
        >
          <img src={logo} className="h-[45px]" />
        </div>
        {/* <SearchBar/> */}
      </div>
      <div className="flex gap-[1rem] mr-[2rem] items-center">
        <div className="h-[2.5rem] md:flex hidden w-[2px] bg-[#5e5f60]" />
        <IconWithToolTip
          img="/assets/playfavicon.ico"
          path="/playground"
          title="JS Playground"
        />
        <IconWithToolTip
          img="/assets/notesfav.ico"
          path="/notes"
          title="LazyNotes"
        />
        {session && <CreateResource />}
        <ProfileIcon
          onClick={() => {
            event("open-login-modal", {
              category: "login",
              action: "open-login-modal",
              label: "login",
            });
            //!session && setIsOpen(true)
            if (!session) {
              setIsOpen(true);
            }
          }}
          className="hidden cursor-pointer md:flex lazyweb-login"
          address={session && session.email ? session.email : "Login"}
        />
        {session && (
          <button
            onClick={() => {
              event("sign-out", {
                category: "sign-out",
                action: "sign-out",
                label: "sign-out",
              });
              signoutHandler();
            }}
            className="bg-altGray text-white whitespace-nowrap px-[1rem] rounded-[20px] py-[0.5rem]"
          >
            sign out
          </button>
        )}
      </div>
      <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default NavBar;
