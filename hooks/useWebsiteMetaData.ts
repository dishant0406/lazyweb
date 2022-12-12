import axios from 'axios'

const useWebsiteMetaData = async (url:string)=>{
  //check if the response if available in localstorage if yes send it if no then fetch

  const alreadyData = localStorage.getItem(`Meta:${url}`)

  if(alreadyData){
    return JSON.parse(alreadyData)
  }
  const {data}:{data:{title:string, description:string, banner:string}} = await axios.post(process.env.NEXT_PUBLIC_META_DATA_ENDPOINT!, {url})
  localStorage.setItem(`Meta:${url}`, JSON.stringify(data))
  return data
}

export {
  useWebsiteMetaData
}
