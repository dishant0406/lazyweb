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
  setAllResources: (arg:String, arg2:number) => void
}>((set) => ({
  allResources: [],
  setAllResources: async (selectedTab='all', size) => {
    if(selectedTab==='all'){
      const {data,error} = await supabaseClient.from('website').select('*').eq('isPublicAvailable', 'true')
      if(data){
        set({allResources:data})
      }
    }else if(selectedTab==='my'){
      const {data,error} = await supabaseClient.from('website').select('*').eq('created_by', useUserData.getState().session?.id).limit(size)
      if(data){
        set({allResources:data})
      }
    }
  },
}))

const useCompleteResourceLength = create<
  {
    completeResourceLength: number
    setCompleteResourceLength: (selectedTab:string) => void
  }
>((set) => ({
  completeResourceLength: 0,
  setCompleteResourceLength: async (selectedTab) => {
    if(selectedTab==='all'){
      const {data,error} = await supabaseClient.from('website').select('id').eq('isPublicAvailable', 'true')
      if(data){
        set({completeResourceLength:data.length})
      }
    }else if(selectedTab==='my'){
      const {data,error} = await supabaseClient.from('website').select('id').eq('created_by', useUserData.getState().session?.id)
      if(data){
        set({completeResourceLength:data.length})
      }
    }
  }
}))


const useSelectedTab = create<{
    selectedTab: string
    setSelectedTab: (tab:string) => void
  }
>((set) => ({
  selectedTab: 'all',
  setSelectedTab: (tab:string) => set({selectedTab:tab})
}))

const useUrlAtIndex = create<
  {
    urlAtIndex: string
    setUrlAtIndex: () => void
  }
>((set) => ({
  urlAtIndex: '',
  setUrlAtIndex: async () => {

    function generateSequentialNumber(size:number) {
      const today = new Date();
      const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
      const index = daysSinceEpoch % size;
      return index;
    }

    const {data,error} = await supabaseClient.from('website').select('*').eq('isPublicAvailable', 'true')
    if(data){
      const index = generateSequentialNumber(data.length)
      set({urlAtIndex:data[index].url})
    }

  }
}))




export {
  useUserData,
  useAllResources,
  useSelectedTab,
  useUrlAtIndex,
  useCompleteResourceLength
}