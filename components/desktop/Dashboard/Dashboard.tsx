import { useFilterUsingCategoriesArray, useFilterUsingTagsArray, useUrlAtIndex } from '@/hooks/Zustand'
import {TopProduct, ResourceList, FilteredResources} from 'components'
import { formatUrl } from 'lib/formatUrl'
import { useEffect } from 'react'

type Props = {}

const Dashboard = (props: Props) => {
  const {urlAtIndex,setUrlAtIndex} = useUrlAtIndex()
  const {filteredResources} = useFilterUsingCategoriesArray()
  const {filteredResources:filteredTagsResources} = useFilterUsingTagsArray()

  useEffect(()=>{
    setUrlAtIndex()
  }

  ,[])
  return (
    <div className="w-[calc(100vw-12rem)] min-h-[calc(100vh-130px)] bg-gray">
      {(filteredResources.length===0 && filteredTagsResources.length===0 ) &&  <div>
        <TopProduct unformatUrl={urlAtIndex} url={formatUrl(urlAtIndex)}/>
        <ResourceList/>
      </div>}
      {(filteredResources.length>0 || filteredTagsResources.length>0) && <FilteredResources/>}
    </div>
  )
}

export default Dashboard