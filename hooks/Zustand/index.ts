import create from 'zustand'
import {User} from '@supabase/gotrue-js/src/lib/types'
import { supabaseClient } from 'lib/supabaseClient';

export type Resource = {
  id: number,
  created_at: string,
  created_by: string,
  url: string,
  tags: string[],
  image_url: string,
  title: string,
  desc: string,
  isPublicAvailable: boolean,
  likes:number,
  isAvailableForApproval:string
}

export type Bookmarked = {
  id: number,
  resource_id:number,
  bookmarked_by:string
}

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
  signOut: ()=>{
    set({session:null})
    window.location.reload()
  }
}))

const useAllResources = create<{
  loading:Boolean,
  allResources: Resource[]
  setAllResources: (arg:String, arg2:number) => void
}>((set) => ({
  loading:false,
  allResources: [],
  setAllResources: async (selectedTab='all', size) => {
    set(({loading:true}))
    if(selectedTab==='all'){
      const {data,error} = await supabaseClient.from('website').select('*').eq('isPublicAvailable', 'true').order('id', { ascending: true })
      if(data){
        set({allResources:data})
      }
    }else if(selectedTab==='my'){
      const {data,error} = await supabaseClient.from('website').select('*').eq('created_by', useUserData.getState().session?.id).limit(size).order('id', { ascending: true })
      if(data){
        set({allResources:data})
      }
    }else if(selectedTab==='saved'){
      const {data,error} = await supabaseClient.from('bookmarks').select('resource_id').eq('bookmarked_by', useUserData.getState().session?.id).order('id', { ascending: true })
      //fetch all resources which are available in the bookmarks table
      if(data){
        const {data:errorData,error:errorError} = await supabaseClient.from('website').select('*').in('id', data.map((item)=>item.resource_id)).limit(size).order('id', { ascending: true })
        if(errorData){
          set({allResources:errorData})
        }

      }

    }
    set(state=>({loading:false}))
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
    }else if(selectedTab==='saved'){
      const {data,error} = await supabaseClient.from('bookmarks').select('resource_id').eq('bookmarked_by', useUserData.getState().session?.id)
      //fetch all resources which are available in the bookmarks table
      if(data){
        const {data:errorData,error:errorError} = await supabaseClient.from('website').select('*').in('id', data.map((item)=>item.resource_id))
        if(errorData){
          set({completeResourceLength:errorData.length})
        }

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

const useSetBookmark = create<
  {
    setComplete:Boolean,
    setBookmark: (resourceId:number) => void
  }
>((set) => ({
  setComplete:false,
  setBookmark: async (resourceId:number) => {
    //check if the resource if publicly available or not
    let available = false;
    const {data:publicAvilable,error:avaiableError} = await supabaseClient.from('website').select('*').eq('id', resourceId)
    if(!publicAvilable){
      console.log(avaiableError)
      return
    }
    if(!publicAvilable[0].isPublicAvailable){
      console.log('not publicly available')
      return
    }else{
      available = true;
    }
    if(available){
      //check if user has already bookmarked or not
    const {data,error} = await supabaseClient.from('bookmarks').select('*').eq('resource_id', resourceId).eq('bookmarked_by', useUserData.getState().session?.id)
    if(!data){
      console.log(error)
      return
    }
    if(data.length>0){
      //if already bookmarked then remove the bookmark
      const {data,error} = await supabaseClient.from('bookmarks').delete().eq('resource_id', resourceId).eq('bookmarked_by', useUserData.getState().session?.id)
      set(state=>({setComplete:!state.setComplete}))
      if(data){
        console.log(data)
      }
    }else{
      //if not bookmarked then add the bookmark
      const {data,error} = await supabaseClient.from('bookmarks').insert([{resource_id:resourceId, bookmarked_by:useUserData.getState().session?.id}])
      set(state=>({setComplete:!state.setComplete}))
      if(data){
        console.log(data)
      } 
    }
    }

    
  }
}))

const useCheckIfResourceBookmarked = create<
  {
    isBookmarked: boolean
    setIsBookmarked: (resourceId:number) => void
  }
>((set) => ({
  isBookmarked: false,
  setIsBookmarked: async (resourceId:number) => {
    //check if user has already bookmarked or not
    const {data,error} = await supabaseClient.from('bookmarks').select('*').eq('resource_id', resourceId).eq('bookmarked_by', useUserData.getState().session?.id)
    if(!data){
      console.log(error)
      return
    }
    console.log(data)
    if(data.length>0){
      set({isBookmarked:true})
    }else{
      set({isBookmarked:false})
    }
  }
}))





export {
  useUserData,
  useAllResources,
  useSelectedTab,
  useUrlAtIndex,
  useCompleteResourceLength,
  useSetBookmark,
  useCheckIfResourceBookmarked
}