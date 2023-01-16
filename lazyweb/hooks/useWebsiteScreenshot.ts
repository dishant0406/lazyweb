
import axios from 'axios'


const useWebsiteScreenshot = async (url:string)=>{
  
  const alreadyData = localStorage.getItem(url)

    if(alreadyData){
      return alreadyData
    }

   try{
    const {data}:{data:string} = await axios.post(process.env.NEXT_PUBLIC_WEBSITE_SCREENSHOT_API_ENDPOINT!, {url})
    localStorage.setItem(url, data)
    return data
   }catch(err){
      console.log(err)
   }

  
}

export {
  useWebsiteScreenshot
}
