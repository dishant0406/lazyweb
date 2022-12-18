type Props = {}
import { useSelectedTab,useUserData,useAllResources, useCompleteResourceLength } from 'hooks/Zustand';
import { useState, useEffect } from 'react';

const ResourceListBar = (props: Props) => {
  const {session} = useUserData()
  const {setSelectedTab, selectedTab} = useSelectedTab()
  const {setAllResources,allResources} = useAllResources()
  const {completeResourceLength,setCompleteResourceLength} = useCompleteResourceLength()
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
    setAllResources(newTabs[id-1].slug, 8)
    setCompleteResourceLength(newTabs[id-1].slug)
    setTabs(newTabs)
  }

  useEffect(() => {
    // Call the API when the user scrolls to the end of the page
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedTab, allResources.length,completeResourceLength]);

  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if(allResources.length >= completeResourceLength) return;
    // Call the API here and update the page state
    setAllResources(selectedTab, allResources.length+4)
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