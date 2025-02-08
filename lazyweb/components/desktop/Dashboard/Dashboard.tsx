import {
  useFilterUsingCategoriesArray,
  useFilterUsingTagsArray,
  useUrlAtIndex,
} from "@/hooks/Zustand";
import { FilteredResources, ResourceList, TopProduct } from "components";
import { useEffect } from "react";

type Props = {};

const Dashboard = (props: Props) => {
  const { urlAtIndex, setUrlAtIndex } = useUrlAtIndex();
  const { filteredResources } = useFilterUsingCategoriesArray();
  const { filteredResources: filteredTagsResources } =
    useFilterUsingTagsArray();

  useEffect(() => {
    setUrlAtIndex();
  }, []);
  return (
    <div className="w-[calc(100vw-13rem)] min-h-[calc(100vh-130px)] bg-background">
      {filteredResources.length === 0 && filteredTagsResources.length === 0 && (
        <div>
          <TopProduct />
          <ResourceList />
        </div>
      )}
      {(filteredResources.length > 0 || filteredTagsResources.length > 0) && (
        <FilteredResources />
      )}
    </div>
  );
};

export default Dashboard;
