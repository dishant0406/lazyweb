import {create} from 'zustand'
import { supabaseClient } from 'lib/supabaseClient';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import jwt_decode  from 'jwt-decode';

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

type User = {
  email:string,
  expirationDate:string,
  iat:number
}



const axiosInstance = axios.create({
  baseURL: 'https://api.lazyweb.rocks/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosIntanceWithAuth = axios.create({
  baseURL: 'https://api.lazyweb.rocks/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});


export type UserWithAdmin = User & Admin
const useUserData = create<{
  session: UserWithAdmin | null
  setSession: () => void
  signOut:()=>void
}>((set) => ({
  session: null,
  setSession: async () => {
    //get token from localstorage
    const token = localStorage.getItem('token')
    if(!token){
      return
    }
    //decode the token
    const decodedToken = jwt_decode(token) as UserWithAdmin
    //check if the token is expired or not
    if(decodedToken.expirationDate < new Date().toISOString()){
      localStorage.removeItem('token')
      return
    }
    //check if the user is admin or not
    if(decodedToken.isAdmin){
      set({session:decodedToken})
    }else{
      set({session:decodedToken})
    }

  },
  signOut: ()=>{
    set({session:null})
    localStorage.removeItem('token')
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


/* The above code is defining a custom hook called `useAllCategory` using the `create` function from
the `zustand` library. This hook has three properties: `allCategories`, `allPublicCategories`, and
`setAllCategories`. */
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
  setAllResources: (arg:String, arg2?:Resource[]|null) => void
}>((set) => ({
  loading:false,
  allResources: [],
  setAllResources: async (selectedTab='all', resources=null) => {
    set(({loading:true}))
    if(selectedTab==='all'){
      if(!resources){
        const {data} = await axiosInstance.get('/websites') 
      if(data){
        set({allResources:data.resources})
        useTopProduct().setTopProduct(data?.dailyResource)
      }
      }
      else{
        set({allResources:resources})
      }
    }else if(selectedTab==='my'){
      const {data} = await axiosIntanceWithAuth.get('/websites/user')
      if(data){
        set({allResources:data.userWebsites})
        


      }
    }else if(selectedTab==='saved'){


      const {data} = await axiosIntanceWithAuth.get('/bookmarked')
      if(data){
        set({allResources:data.bookmarkedResources})
      }


    }else if(selectedTab==='publish'){
      const {data} = await axiosIntanceWithAuth.get('/websites/is-available-for-approval')
      if(data){
        set({allResources:data.resources})
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
    const {data} = await axiosInstance.post('/websites/by-categories', {categories})
    if(data){
      set({filteredResources:data.resources})
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
      const {data} = await axiosInstance.get('/websites')
      if(data){
        set({completeResourceLength:data.resrouces.length})
      }
    }else if(selectedTab==='my'){
      const {data} = await axiosIntanceWithAuth.get('/websites/user')
      if(data){
        set({completeResourceLength:data.userWebsites.length})
      }
    }else if(selectedTab==='saved'){
      const {data} = await axiosIntanceWithAuth.get('/bookmarked')
      //fetch all resources which are available in the bookmarks table
      if(data){
        set({completeResourceLength:data.bookmarkedResources.length})
      }
    }else if(selectedTab==='publish'){
      const {data} = await axiosIntanceWithAuth.get('/websites/is-available-for-approval')
      if(data){
        set({completeResourceLength:data.resources.length})
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
  setUrlAtIndex: () => {
  }
}))

const useTopProduct = create<
  {
    topProduct: Resource|null
    setTopProduct: (res:Resource) => void
  }
>((set) => ({
  topProduct: null,
  setTopProduct: async (res:Resource) => {
    set({topProduct:res})
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
  useLoginModal,
  useTopProduct
}