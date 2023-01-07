type Props = {}
import { useSelectedTab,useUserData,useAllResources, useCompleteResourceLength,useLoginModal } from 'hooks/Zustand';
import { useState, useEffect } from 'react';

const ResourceListBar = (props: Props) => {
  const {session} = useUserData()
  const {setSelectedTab, selectedTab} = useSelectedTab()
  const {setAllResources,allResources} = useAllResources()
  const {completeResourceLength,setCompleteResourceLength} = useCompleteResourceLength()
  const {setIsLoginModalOpen} = useLoginModal()
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
    },{
      id:4,
      name:'Publish',
      slug:'publish',
      selected:false
    }
  ])

  const selectionHandler = (id:number)=>{
    if(session){
      const newTabs = tabs.map(e=>{
        return {
          ...e,
          selected:false
        }
      })
      newTabs[id-1].selected = true
      setSelectedTab(newTabs[id-1].slug)
      setAllResources(newTabs[id-1].slug)
      setCompleteResourceLength(newTabs[id-1].slug)
      setTabs(newTabs)
    }else{
      setIsLoginModalOpen(true)
    }
  }


  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },[selectedTab])

  return (
    <div className="w-[100%] lazyweb-resource-list flex justify-center">
      <div className="flex w-[95%] mt-[1rem]">
        {tabs.map(e=>{
          if(e.slug==='publish'){
            if(session && session.isAdmin){
              return (
                <button onClick={()=>selectionHandler(e.id)} key={e.id} className={`h-[3rem] px-[1rem] w-[fit] transition-all ${e.selected?'border-b-[3px] border-[#1c64ec]':'border-b border-lightGray'}`}>
                  <div className={`${e.selected?'text-white':"text-lightGray"} transition-all`}>{e.name}</div>
                </button>
              )
            }else{
              return
            }
          }
          return (
            <button onClick={()=>selectionHandler(e.id)} key={e.id} className={`h-[3rem] px-[1rem] w-[fit] transition-all ${e.selected?'border-b-[3px] border-[#1c64ec]':'border-b border-lightGray'}`}>
              <div className={`${e.selected?'text-white':"text-lightGray"} transition-all`}>{e.name}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ResourceListBar