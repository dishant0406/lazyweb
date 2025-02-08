import { emojiGenerator } from "lib/emojiGenerator";

interface EmptyStateProps {
  selectedTab: string;
}

export const EmptyState = ({ selectedTab }: EmptyStateProps) => {
  const getMessage = () => {
    switch (selectedTab) {
      case "saved":
        return `Not Bookmarked even a single resource! ${emojiGenerator()}`;
      case "my":
        return `Add your personal resource and get started! ${emojiGenerator()}`;
      case "all":
        return "No Resources Found!";
      case "publish":
        return `This place is empty right now! ${emojiGenerator()}`;
      default:
        return "No content available";
    }
  };

  return (
    <div className="w-full mt-8 flex items-center justify-center">
      <div className="px-12 py-4 shadow-2xl bg-altGray rounded-[20px]">
        <p className="text-lg text-white">{getMessage()}</p>
      </div>
    </div>
  );
};
