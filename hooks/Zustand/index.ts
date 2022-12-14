import create from 'zustand'
import {User} from '@supabase/gotrue-js/src/lib/types'
import { supabaseClient } from 'lib/supabaseClient';

const useUserData = create<{
  session: User | null
  setSession: () => void
  signOut:()=>void
}>((set) => ({
  session: null,
  setSession: async () => {
    const {data,error} = await supabaseClient.auth.getSession()     
        if(data.session?.user){
          set({session:data.session.user})
        }
  },
  signOut: ()=>set({session:null})
}))

const useAllResources = create<{
  allResources: any[]
  setAllResources: (arg:String) => void
}>((set) => ({
  allResources: [],
  setAllResources: async (selectedTab='all') => {
    if(selectedTab==='all'){
      const {data,error} = await supabaseClient.from('website').select('*').eq('isPublicAvailable', 'true')
      if(data){
        set({allResources:data})
      }
    }else if(selectedTab==='my'){
      const {data,error} = await supabaseClient.from('website').select('*').eq('created_by', useUserData.getState().session?.id)
      if(data){
        set({allResources:data})
      }
    }
  },
}))

const useSelectedTab = create<{
    selectedTab: string
    setSelectedTab: (tab:string) => void
  }
>((set) => ({
  selectedTab: 'all',
  setSelectedTab: (tab:string) => set({selectedTab:tab})
}))



export {
  useUserData,
  useAllResources,
  useSelectedTab
}