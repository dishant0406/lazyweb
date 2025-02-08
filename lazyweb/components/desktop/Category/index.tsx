import { CategoryPill } from "components";
import { useAllTags } from "hooks/Zustand";

type Props = {};

const Category = (props: Props) => {
  const { allTags } = useAllTags();

  const uniqueTags = Array.from(new Set(allTags));

  return (
    <div className="pt-[70px] ">
      <div
        id="style-4"
        className="w-[100vw] lazyweb-tags bg-background overflow-x-scroll border-b shadow-custom border-input  gap-[1rem] flex justify-start px-[3rem] items-center h-[60px] "
      >
        {uniqueTags.length > 0 &&
          uniqueTags.map((tag) => {
            return <CategoryPill key={tag} name={tag} />;
          })}
      </div>
    </div>
  );
};

export default Category;
