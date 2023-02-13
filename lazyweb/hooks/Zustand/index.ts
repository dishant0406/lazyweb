import {create} from 'zustand'
import {User} from '@supabase/gotrue-js/src/lib/types'
import { supabaseClient } from 'lib/supabaseClient';
import axios from 'axios';

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
  isAvailableForApproval:string,
  category:string,
  created_by_list:string[]
}

export type VisitersInfo = {
  id: number,
  created_at:string,
  city:string,
  country:string,
  isp:string,
  query:string,
  lat:string,
  lan:string,
  regionName:string,
  zip:string,
}

export type Bookmarked = {
  id: number,
  resource_id:number,
  bookmarked_by:string
}

type Admin = {
  isAdmin:Boolean
}

export type UserWithAdmin = User & Admin
const useUserData = create<{
  session: UserWithAdmin | null
  setSession: () => void
  signOut:()=>void
}>((set) => ({
  session: null,
  setSession: async () => {
    const {data,error} = await supabaseClient.auth.getSession()
        if(error){
          console.log(error)
        }     
        if(data.session?.user){
          set({session:{...data.session.user, isAdmin:false}})
          //check if user is available in the users table by id if not then add id email and isAdmin to false
          const {data:errorData,error:errorError} = await supabaseClient.from('users').select('*').eq('id', data.session.user.id)
          if(errorData && errorData.length===0){
            const {data:errorData,error:errorError} = await supabaseClient.from('users').insert([{id:data.session.user.id,email:data.session.user.email,isAdmin:false}])
            if(errorData){
              console.log("user added to users table")
            }

          }

          //check if user is admin if he is admin set session isAdmin to true else set it to false
          const {data:AdminData,error:AdminError} = await supabaseClient.from('users').select('isAdmin').eq('id', data.session.user.id)
          if(AdminData && AdminData.length>0){
            if(AdminData[0].isAdmin){
              set({session:{...data.session.user, isAdmin:true}})
            }
          }
        }
  },
  signOut: ()=>{
    set({session:null})
    window.location.reload()
  }
}))

//array of all distinct tags available in the database and ignore if it is null
const useAllTags = create<{
  allTags: string[]
  setAllTags: () => void
}>((set) => ({
  allTags: [],
  setAllTags: async () => {
    const {data,error} = await supabaseClient.from('website').select('tags').eq('isPublicAvailable',true)
    if(data){
      const allTags = data.map((item)=>item.tags).flat()
      const distinctTags = Array.from(new Set(allTags).values())
      distinctTags.splice(distinctTags.indexOf(null),1)
      set({allTags:distinctTags})
    }
  },
}))


//array of distinct category and ignore if category is null
const useAllCategory = create<{
  allCategories: string[]
  allPublicCategories:string[]
  setAllCategories: () => void
}>((set) => ({
  allCategories: [],
  allPublicCategories:[],
  setAllCategories: async () => {
    const {data,error} = await supabaseClient.from('website').select('category').neq('category', null).eq('isPublicAvailable',true)
    if(data){
      const allCategories = data.map((item)=>item.category)
      const distinctCategories = Array.from(new Set(allCategories).values())
      set({allCategories:distinctCategories})
    }
    const {data:PublicData,error:PublicError} = await supabaseClient.from('website').select('category').neq('category', null)
    if(PublicData){
      const allCategories = PublicData.map((item)=>item.category)
      const distinctCategories = Array.from(new Set(allCategories).values())
      set({allPublicCategories:distinctCategories})
    }
  },
}))



const useAllResources = create<{
  loading:Boolean,
  allResources: Resource[]
  setAllResources: (arg:String) => void
}>((set) => ({
  loading:false,
  allResources: [],
  setAllResources: async (selectedTab='all') => {
    set(({loading:true}))
    if(selectedTab==='all'){
      const {data,error} = await supabaseClient.from('website').select('*').eq('isPublicAvailable', 'true').order('id', { ascending: true })
      if(data){
        set({allResources:data})
      }
    }else if(selectedTab==='my'){
      const {data,error} = await supabaseClient.from('website').select('*').overlaps('created_by_list', [useUserData.getState().session?.id]).order('id', { ascending: true }).order('isPublicAvailable', { ascending: true })
      if(data){
        set({allResources:data})
      }
    }else if(selectedTab==='saved'){
      const {data,error} = await supabaseClient.from('bookmarks').select('resource_id').eq('bookmarked_by', useUserData.getState().session?.id).order('id', { ascending: true })
      //fetch all resources which are available in the bookmarks table
      if(data){
        const {data:errorData,error:errorError} = await supabaseClient.from('website').select('*').in('id', data.map((item)=>item.resource_id)).order('id', { ascending: true })
        if(errorData){
          set({allResources:errorData})
        }

      }

    }else if(selectedTab==='publish'){
      const {data,error} = await supabaseClient.from('website').select('*').eq('isAvailableForApproval', 'true').order('id', { ascending: true })
      if(data){
        set({allResources:data})
      }
    }
    set(state=>({loading:false}))
  },
}))

const useFilterUsingCategoriesArray = create<
  { 
    filteredResources: Resource[]
    setFilteredResources: (arg:string[]) => void
  }
>((set) => ({
  filteredResources: [],
  setFilteredResources: async (categories) => {
    //if category is empty then return empty array
    if(categories.length===0){
      set({filteredResources:[]})
      return
    }

    //set filtered resources of tags to empty array
    //set manage selected tags array to empty array
    useManageSelectedTags.getState().setSelectedTags('')
    const {data,error} = await supabaseClient.from('website').select('*').in('category', categories).eq('isPublicAvailable', 'true')
    if(data){
      set({filteredResources:data})
    }
    useFilterUsingTagsArray.getState().setFilteredResources([])


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
      const {data,error} = await supabaseClient.from('website').select('id').overlaps('created_by_list', [useUserData.getState().session?.id])
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

    }else if(selectedTab==='publish'){
      const {data,error} = await supabaseClient.from('website').select('id').eq('isAvailableForApproval', 'true')
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
      //if selected tab is saved then refetch all recouseces
      if(useSelectedTab.getState().selectedTab==='saved'){
        useAllResources.getState().setAllResources(useSelectedTab.getState().selectedTab)
      }

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

const useSetLikes = create<
  {
    setComplete:Boolean,
    setLikes: (resourceId:number) => void
  }
>((set) => ({
  setComplete:false,
  setLikes: async (resourceId:number) => {
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
      //check if user has already liked or not
    const {data,error} = await supabaseClient.from('likes').select('*').eq('resource_id', resourceId).eq('liked_by', useUserData.getState().session?.id)
    if(!data){
      console.log(error)
      return
    }
    if(data.length>0){
      //if already liked then remove the like
      const {data,error} = await supabaseClient.from('likes').delete().eq('resource_id', resourceId).eq('liked_by', useUserData.getState().session?.id)
      //decrease the count of likes by 1 in resources likes
      const {data:resourceData,error:resourceError} = await supabaseClient.from('website').select('*').eq('id', resourceId)
      if(!resourceData){
        console.log(resourceError)
        return
      }
      const {data:updatedResourceData,error:updatedResourceError} = await supabaseClient.from('website').update({likes:resourceData[0].likes-1}).eq('id', resourceId)
      // if(!updatedResourceData){
      //   console.log(updatedResourceError)
      //   return
      // }

      set(state=>({setComplete:!state.setComplete}))
      //if selected tab is saved then refetch all recouseces
      if(useSelectedTab.getState().selectedTab==='saved'){
        useAllResources.getState().setAllResources(useSelectedTab.getState().selectedTab)
      }

      if(data){
        console.log(data)
      }
    }else{
      //if not liked then add the like
      const {data,error} = await supabaseClient.from('likes').insert([{resource_id:resourceId, liked_by:useUserData.getState().session?.id}])
      //increase the count of likes by 1 in resources likes
      const {data:resourceData,error:resourceError} = await supabaseClient.from('website').select('*').eq('id', resourceId)
      if(!resourceData){
        console.log(resourceError)
        return
      }
      const {data:updatedResourceData,error:updatedResourceError} = await supabaseClient.from('website').update({likes:resourceData[0].likes+1}).eq('id', resourceId)
      // if(!updatedResourceData){
      //   console.log(updatedResourceError)
      //   return
      // }
      set(state=>({setComplete:!state.setComplete}))
      if(data){
        console.log(data)
      } 
    }
    }
  }}))

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


const useManageSelectedCategories = create<
  {
    selectedCategories: string[]
    setSelectedCategories: (category:string) => void
  }
>((set) => ({
  selectedCategories: [],
  setSelectedCategories: (category:string) => {
    //if category is '' then set seletedCategories to empty array
    if(category===''){
      set(state=>({selectedCategories:[]}))
      return
    }

    //if category is already selected then remove it from the array
    if(useManageSelectedCategories.getState().selectedCategories.includes(category)){
      set(state=>({selectedCategories:state.selectedCategories.filter((item)=>item!==category)}))
    }else{
      set(state=>({selectedCategories:[...state.selectedCategories,category]}))
    }

    //call setFilteredResource after the state is changed
    useFilterUsingCategoriesArray.getState().setFilteredResources(useManageSelectedCategories.getState().selectedCategories)
  }
}))

const useFilterUsingTagsArray = create<
  {
    filteredResources: any[]
    setFilteredResources: (tags:string[]) => void
  }
>((set) => ({
  filteredResources: [],
  setFilteredResources: async (tags:string[]) => {
    //if tags array is empty return empty array
    if(tags.length===0){
      set({filteredResources:[]})
      return
    }
    //set filteredResources of category to empty array
    
    //set seletedCategories to empty array
    useManageSelectedCategories.getState().setSelectedCategories('')
    
    //if tags array is not empty then filter the resources
    const { data, error } = await supabaseClient.from('website').select('*').overlaps('tags', tags)
    if(!data){
      console.log(error)
      return
    }
    set({filteredResources:data})
    useFilterUsingCategoriesArray.getState().setFilteredResources([])
  }
}))


const useManageSelectedTags = create<
  {
    selectedTags: string[]
    setSelectedTags: (tag:string) => void
  }
>((set) => ({
  selectedTags: [],
  setSelectedTags: (tag:string) => {
    //if tag is '' then set seletedTags to empty array
    if(tag===''){
      set({selectedTags:[]})
      return
    }
    if(useManageSelectedTags.getState().selectedTags.includes(tag)){
      set(state=>({selectedTags:state.selectedTags.filter((item)=>item!==tag)}))
    }else{
      set(state=>({selectedTags:[...state.selectedTags,tag]}))
    }

    //call setFilteredResource after the state is changed
    useFilterUsingTagsArray.getState().setFilteredResources(useManageSelectedTags.getState().selectedTags)
  }
}))

const useStoreVisitersInfoIfDoesNotExist = create<
  {
    setVisitersInfo: () => void
  }
>((set) => ({
  setVisitersInfo: async () => {
    //getting users ip address using api
    const {data} = await axios.get('https://api.ipify.org?format=json')
    if(!data){
      console.log('error')
      return
    }
    // getting ip adddress info using http://ip-api.com/json/ api
    const {data:ipData} = await axios.post(`https://api.lazyweb.rocks/ipinfo`, {ip:data.ip})
    if(!ipData){
      console.log('ipError')
      return
    }

    //check if the ip address is already present in the database
    const {data:visitersData,error:visitersError} = await supabaseClient.from('visiters').select('*').eq('query', data.ip)
    if(!visitersData){
      console.log(visitersError)
      return
    }

    //if ip address is not present in the database then add it to the database
    if(visitersData.length===0){
      const {data:visitersData,error:visitersError} = await supabaseClient.from('visiters').insert([{city:ipData.City,country:ipData.Country,isp:ipData.provider,query:ipData.ipAddress,regionName:ipData.Region,zip:ipData.postalCode, lat:`${ipData.lat}`,lan:`${ipData.lon}`}])
      if(!visitersData){
        console.log(visitersError)
        return
      }
    }



  }}))


  //login modal open state manage
  const useLoginModal = create<
  {
    isLoginModalOpen: boolean
    setIsLoginModalOpen: (value:boolean) => void
  }
>((set) => ({
  isLoginModalOpen: false,
  setIsLoginModalOpen: (value:boolean) => {
    set({isLoginModalOpen:value})
  }
}))





    
      



export {
  useUserData,
  useAllResources,
  useSelectedTab,
  useUrlAtIndex,
  useCompleteResourceLength,
  useSetBookmark,
  useCheckIfResourceBookmarked,
  useAllTags,
  useAllCategory,
  useSetLikes,
  useFilterUsingCategoriesArray,
  useManageSelectedCategories,
  useFilterUsingTagsArray,
  useManageSelectedTags,
  useStoreVisitersInfoIfDoesNotExist,
  useLoginModal
}