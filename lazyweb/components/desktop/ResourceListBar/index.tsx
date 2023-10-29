type Props = {}
import { useSelectedTab,useUserData,useAllResources, useCompleteResourceLength,useLoginModal } from 'hooks/Zustand';
import { event } from 'nextjs-google-analytics';
import { useState, useEffect } from 'react';
import {Tabs, Tab,} from "@nextui-org/react";
import {Kbd} from "@nextui-org/react";

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
    <div className="w-[100%] sticky mt-[0.5rem] items-center top-[70px] z-[2] bg-gray lazyweb-resource-list flex justify-start">
     <div className="flex flex-col ml-[1rem] py-[0.5rem]">
      <Tabs 
        aria-label="Options"
        color='default'
        
        variant='bordered'
        selectedKey={tabs.find(e=>e.selected)?.slug}
        onSelectionChange={(e)=>{
          const tab = tabs.find(ee=>ee.slug === e)
          if(tab){
            selectionHandler(tab.id)
          }
        }}
      >
        {
          tabs.map((e,i)=>{
            if(e.slug === 'publish' && !session?.isAdmin) return null
            return (
              <Tab key={e.slug} title={e.name}> 
            </Tab>
            )
          })
        }
      </Tabs>
    </div>  
      <div className="flex scale-75 items-center ml-[0rem]">
                      <kbd className="px-2 py-1 text-white bg-gray-900 border border-gray-700 rounded">
                          ctrl
                      </kbd> 
                      <span className="ml-2 text-trueGray-200">+</span>
                      <kbd className="px-2 py-1 ml-2 text-white bg-gray-900 border border-gray-700 rounded">
                          space
                      </kbd> 
                      <span className="ml-2 text-trueGray-200">for AI search</span>
                  </div>
    </div>
  )
}

export default ResourceListBar