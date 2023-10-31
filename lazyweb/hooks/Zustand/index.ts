import {create} from 'zustand'
import { supabaseClient } from 'lib/supabaseClient';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import jwt_decode  from 'jwt-decode';


export type Resource = {
  _id: number,
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
  created_by_list:string[],
  bookmarked_by:string[],
  liked_by:string[],
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
  id:string,
}



export const axiosInstance = axios.create({
  // baseURL: 'https://api.lazyweb.rocks/api',
  baseURL: `${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosIntanceWithAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/api`,
  // baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
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
  setAllTags: (tags?:string[]) => void
}>((set) => ({
  allTags: [],
  setAllTags: async (tags) => {
    if(tags){
      set({allTags:tags})
      return
    }else{

    }

  },
}))


/* The above code is defining a custom hook called `useAllCategory` using the `create` function from
the `zustand` library. This hook has three properties: `allCategories`, `allPublicCategories`, and
`setAllCategories`. */
const useAllCategory = create<{
  allCategories: string[]
  allPublicCategories:string[]
  setAllCategories: (
    categories?: string[],
    allCategories?:string[]
  ) => void
}>((set) => ({
  allCategories: [],
  allPublicCategories:[],
  setAllCategories: async (
    categories,
  allCategories
  ) => {
    if(categories){
      set({allCategories:categories})
    }
    if(allCategories){
      set({allPublicCategories:allCategories})
    }
  },
}))

const useGetPendingResources = create<{
  isPendingSelected:boolean,
  setIsPendingSelected: (value:boolean) => void
}>((set) => ({
  isPendingSelected: false,
  setIsPendingSelected: (value:boolean) => {
    set({isPendingSelected:value})
    useAllResources.getState().setAllResources('my')
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
        useTopProduct.getState().setTopProduct(data?.dailyResource)
        useAllTags.getState().setAllTags(data?.tags)
        useAllCategory.getState().setAllCategories(data?.categories,data?.allCategories)
      }
      }
      else{
        set({allResources:resources})
      }
    }else if(selectedTab==='my'){
      let isPendingSelected = useGetPendingResources.getState().isPendingSelected
      if(!isPendingSelected){
        const {data} = await axiosIntanceWithAuth.get('/websites/user', {
          headers:{
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(data){
          set({allResources:data.userWebsites})
        }
      }else{
        const {data} = await axiosIntanceWithAuth.get('/websites/user/pending', {
          headers:{
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(data){
          set({allResources:data.userWebsites})
        }
      }
    }else if(selectedTab==='saved'){
      const {data} = await axiosIntanceWithAuth.get('/websites/bookmarked', {
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(data){
        set({allResources:data.bookmarkedResources})
      }


    }else if(selectedTab==='publish'){
      const {data} = await axiosIntanceWithAuth.get('/websites/is-available-for-approval', {
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(data){
        set({allResources:data.resources})
      }
    }
    set(state=>({loading:false}))
  },
}))

const useSetAllResourcesServerSide = create<{
  setAllResourcesServerSide: (arg:{
    resources:Resource[],
    tags:string[],
    categories:string[],
    allCategories:string[],
    dailyResource:Resource,
    allTags:string[]
  }) => void
}>((set) => ({
  setAllResourcesServerSide: async (arg) => {
    useAllResources.getState().setAllResources('all',arg.resources)
    useAllTags.getState().setAllTags(arg.allTags)
    useAllCategory.getState().setAllCategories(arg.categories,arg.allCategories)
    useTopProduct.getState().setTopProduct(arg.dailyResource)
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
        set({completeResourceLength:data.resources.length})
      }
    }else if(selectedTab==='my'){
      const {data} = await axiosIntanceWithAuth.get('/websites/user', {
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(data){
        set({completeResourceLength:data.userWebsites.length})
      }
    }else if(selectedTab==='saved'){
      const {data} = await axiosIntanceWithAuth.get('/websites/bookmarked', {
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      //fetch all resources which are available in the bookmarks table
      if(data){
        set({completeResourceLength:data.bookmarkedResources.length})
      }
    }else if(selectedTab==='publish'){
      const {data} = await axiosIntanceWithAuth.get('/websites/is-available-for-approval', {
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
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
    try{
      set(state=>({setComplete:!state.setComplete}))
      const data  = await axiosIntanceWithAuth.put(`/websites/bookmark/${resourceId}`,{}, {
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(data){
        set(state=>({setComplete:!state.setComplete}))
        //if selected tab is saved then refetch all recouseces
          useAllResources.getState().setAllResources(useSelectedTab.getState().selectedTab)
        
      }
    }
    catch(err:any){
      console.log(err)
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
   try{

      set(state=>({setComplete:!state.setComplete}))
      const {data} = await axiosIntanceWithAuth.put(`/websites/like/${resourceId}`,{}, {
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(data){
        //if selected tab is saved then refetch all recouseces
        useAllResources.getState().setAllResources(useSelectedTab.getState().selectedTab)
      }
   }
    catch(err:any){
      console.log(err)
    }



  }}))

// const useCheckIfResourceBookmarked = create<
//   {
//     isBookmarked: boolean
//     setIsBookmarked: (resourceId:number) => void
//   }
// >((set) => ({
//   isBookmarked: false,
//   setIsBookmarked: async (resourceId:number) => {
//     //check if user has already bookmarked or not
//     const {data,error} = await supabaseClient.from('bookmarks').select('*').eq('resource_id', resourceId).eq('bookmarked_by', useUserData.getState().session?.id)
//     if(!data){
//       console.log(error)
//       return
//     }
//     console.log(data)
//     if(data.length>0){
//       set({isBookmarked:true})
//     }else{
//       set({isBookmarked:false})
//     }
//   }
// }))


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
    const {data} = await axiosInstance.post('/websites/by-tags', {tags})
    if(data){
      set({filteredResources:data.resources})
    }
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

// const useStoreVisitersInfoIfDoesNotExist = create<
//   {
//     setVisitersInfo: () => void
//   }
// >((set) => ({
//   setVisitersInfo: async () => {
//     //getting users ip address using api
//     const {data} = await axios.get('https://api.ipify.org?format=json')
//     if(!data){
//       console.log('error')
//       return
//     }
//     // getting ip adddress info using http://ip-api.com/json/ api
//     const {data:ipData} = await axios.post(`https://api.lazyweb.rocks/ipinfo`, {ip:data.ip})
//     if(!ipData){
//       console.log('ipError')
//       return
//     }

//     //check if the ip address is already present in the database
//     const {data:visitersData,error:visitersError} = await supabaseClient.from('visiters').select('*').eq('query', data.ip)
//     if(!visitersData){
//       console.log(visitersError)
//       return
//     }

//     //if ip address is not present in the database then add it to the database
//     if(visitersData.length===0){
//       const {data:visitersData,error:visitersError} = await supabaseClient.from('visiters').insert([{city:ipData.City,country:ipData.Country,isp:ipData.provider,query:ipData.ipAddress,regionName:ipData.Region,zip:ipData.postalCode, lat:`${ipData.lat}`,lan:`${ipData.lon}`}])
//       if(!visitersData){
//         console.log(visitersError)
//         return
//       }
//     }



//   }}))


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

const useSearchModal = create<
  {
    isSearchModalOpen: boolean
    setIsSearchModalOpen: (value:boolean) => void
  }
>((set) => ({
  isSearchModalOpen: false,
  setIsSearchModalOpen: (value:boolean) => {
    set({isSearchModalOpen:value})
  }
}))






    
      



export {
  useUserData,
  useAllResources,
  useSelectedTab,
  useUrlAtIndex,
  useCompleteResourceLength,
  useSetBookmark,
  useAllTags,
  useAllCategory,
  useSetLikes,
  useFilterUsingCategoriesArray,
  useManageSelectedCategories,
  useFilterUsingTagsArray,
  useManageSelectedTags,
  useLoginModal,
  useTopProduct,
  useSearchModal,
  useSetAllResourcesServerSide,
  useGetPendingResources
}