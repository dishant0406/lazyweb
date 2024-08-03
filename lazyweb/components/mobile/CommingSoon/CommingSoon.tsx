type Props = {};

const CommingSoon = (props: Props) => {
  return (
    <div className="md:hidden bg-gray h-[100vh] w-[100vw] flex">
      <div>
        <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh]">
          <div className="px-[2rem] py-[2rem] mx-[1rem] rounded-[20px] flex flex-col items-center justify-center shadow-2xl bg-altGray">
            <p className="text-[#6c6c6c] text-center text-2xl font-bold">
              Mobile version
            </p>
            <p className="text-[#6c6c6c] text-center text-2xl font-bold my-[0.5rem]">
              Coming Soon!
            </p>
            <p className="text-[#6c6c6c] text-xl text-center font-bold">
              Please use desktop version
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommingSoon;
