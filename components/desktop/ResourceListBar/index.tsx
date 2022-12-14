type Props = {}
import { useSelectedTab,useUserData,useAllResources } from 'hooks/Zustand';
import { useState } from 'react';

const ResourceListBar = (props: Props) => {
  const {session} = useUserData()
  const {setSelectedTab} = useSelectedTab()
  const {setAllResources} = useAllResources()
  const [tabs, setTabs] = useState([
    {
      id:1,
      name:'All Resources',
      slug:'all',
      selected:true
    },
    {
      id:2,
      name:'Saved Resources',
      slug:'saved',
      selected:false
    },{
      id:3,
      name:'My Resources',
      slug:'my',
      selected:false
    }
  ])

  const selectionHandler = (id:number)=>{
    const newTabs = tabs.map(e=>{
      return {
        ...e,
        selected:false
      }
    })
    newTabs[id-1].selected = true
    setSelectedTab(newTabs[id-1].slug)
    setAllResources(newTabs[id-1].slug)
    setTabs(newTabs)
  }

  return (
    <div className="w-[100%] flex justify-center">
      <div className="flex w-[95%] mt-[1rem]">
        {tabs.map(e=>{
          return (
            <button disabled={!session} onClick={()=>selectionHandler(e.id)} key={e.id} className={`h-[3rem] px-[1rem] w-[fit] transition-all ${e.selected?'border-b-[3px] border-[#1c64ec]':'border-b border-lightGray'}`}>
              <div className={`${e.selected?'text-white':"text-lightGray"} transition-all`}>{e.name}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ResourceListBar