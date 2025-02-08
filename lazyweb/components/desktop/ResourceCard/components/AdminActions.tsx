interface AdminActionsProps {
  onApprove: () => void;
  onReject: () => void;
  isHovered: boolean;
}

const AdminActions = ({
  onApprove,
  onReject,
  isHovered,
}: AdminActionsProps) => {
  return (
    <div className="w-72 absolute top-0 left-0 z-[1] transition-all flex items-center justify-center gap-1 duration-500 hover:bg-gray/40 h-40 rounded-t-[20px]">
      <button
        onClick={onApprove}
        className={`text-white hover:scale-105 ${
          isHovered ? "opacity-100" : "opacity-0"
        } transition-all px-4 py-1 text-base bg-[#1c64ec] rounded-full`}
      >
        Approve
      </button>
      <button
        onClick={onReject}
        className={`text-white hover:scale-105 ${
          isHovered ? "opacity-100" : "opacity-0"
        } transition-all px-4 py-1 text-base bg-red-600 rounded-full`}
      >
        Reject
      </button>
    </div>
  );
};

export default AdminActions;
