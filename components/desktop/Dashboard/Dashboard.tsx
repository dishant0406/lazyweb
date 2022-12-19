import { useUrlAtIndex } from '@/hooks/Zustand'
import {TopProduct, ResourceList} from 'components'
import { formatUrl } from 'lib/formatUrl'
import { useEffect } from 'react'

type Props = {}

const Dashboard = (props: Props) => {
  const {urlAtIndex,setUrlAtIndex} = useUrlAtIndex()

  useEffect(()=>{
    setUrlAtIndex()
  }

  ,[])
  return (
    <div className="w-[calc(100vw-12rem)] min-h-[calc(100vh-130px)] bg-gray">
      <TopProduct unformatUrl={urlAtIndex} url={formatUrl(urlAtIndex)}/>
      <ResourceList/>
    </div>
  )
}

export default Dashboard