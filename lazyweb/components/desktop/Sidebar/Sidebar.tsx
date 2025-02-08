type Props = {};
import { SidebarCategory } from "components";
import { useAllCategory } from "hooks/Zustand";
import { useEffect } from "react";

const Sidebar = (props: Props) => {
  const { allCategories, setAllCategories } = useAllCategory();

  useEffect(() => {
    setAllCategories();
  }, []);

  return (
    <div className="w-[13rem] bg-background shadow-custom border border-input min-h-[calc(100vh-130px)]">
      <div className="flex flex-col gap-[1rem] pt-[1rem] items-center">
        {allCategories?.length > 0 && (
          <SidebarCategory title="Category" options={allCategories} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
