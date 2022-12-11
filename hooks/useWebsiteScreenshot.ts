import { formatUrl } from '../lib/formatUrl'
import axios from 'axios'


const useWebsiteScreenshot = async (url:string)=>{
  url = formatUrl(url)
  
  const alreadyData = localStorage.getItem(url)

    if(alreadyData){
      return 'data:image/png;base64,'+alreadyData
    }

    const {data}:{data:string} = await axios.post(process.env.NEXT_PUBLIC_WEBSITE_SCREENSHOT_API_ENDPOINT!, {url})
    localStorage.setItem(url, data)
    return 'data:image/png;base64,'+data

  
}

export {
  useWebsiteScreenshot
}
