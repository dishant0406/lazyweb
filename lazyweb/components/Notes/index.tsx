import React, { useEffect } from 'react'
import { Editor } from 'novel'
import { MdOutlineAddToPhotos } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";

type Props = {}

const NoteComponent = (props: Props) => {
  const [keys, setKeys] = React.useState<string[]>([])
  const [sideBarOpen, setSideBarOpen] = React.useState<boolean>(false)
  const [selectedKey, setSelectedKey] = React.useState<string>('novel_content')

  const generateKey = () => {
    const localkeys = localStorage.getItem('keys')
    const key = Math.random().toString(36).substring(7)
    //check if key exists
    if (localkeys) {
      const parsedKeys = JSON.parse(localkeys)
      if (parsedKeys.includes(key)) {
        generateKey()
      }
      else {
        setKeys([...parsedKeys, key])
        localStorage.setItem('keys', JSON.stringify([...parsedKeys, key]))
        setSelectedKey(key)
        localStorage.setItem('selectedKey', key)
      }
    }
  }

  useEffect(() => {
    const localkeys = localStorage.getItem('keys')
    if (localkeys) {
      setKeys(JSON.parse(localkeys))
    }
    else {
      localStorage.setItem('keys', JSON.stringify(['novel_content']))
    }

    const localSelectedKey = localStorage.getItem('selectedKey')
    if (localSelectedKey) {
      setSelectedKey(localSelectedKey)
    }
    else {
      localStorage.setItem('selectedKey', 'novel_content')
    }

  }
    , [])

  const selectKey = (key: string) => {
    setSelectedKey(key)
    localStorage.setItem('selectedKey', key)
  }

  const handleRemove = (key: string) => {
    selectKey('novel_content')
    const localkeys = localStorage.getItem('keys')
    if (localkeys) {
      const parsedKeys = JSON.parse(localkeys)
      const filteredKeys = parsedKeys.filter((k: string) => k !== key)
      setKeys(filteredKeys)
      localStorage.removeItem(key)
      localStorage.setItem('keys', JSON.stringify(filteredKeys))
    }
  }

  return (
    <div className='w-full relative min-h-[100vh] bg-gray'>
      {
        !sideBarOpen && (
          <button onClick={() => {
            setSideBarOpen(true)
          }} className='w-10 h-10 flex z-[99] justify-center items-center rounded-l-lg top-[10vh] right-0 fixed bg-white' >
            <MdOutlineAddToPhotos className='text-[20px]' />
          </button>
        )
      }
      <div className={`h-[100vh] p-[2%] w-[20vw] bg-gray border-l border-white/10 fixed top-0 transition-all duration-1000 ${sideBarOpen ? 'right-0' : '-right-full'
        } z-[100]`}>
        <div className='w-full flex mb-[1vh] justify-between items-center'>
          <h1 className='text-2xl text-gray  font-bold'>Notes</h1>
          <div className='flex gap-[0.5rem]'>
            <button onClick={generateKey} className='w-10 h-10 flex justify-center items-center rounded-lg bg-gray/80 text-white'>
              <MdOutlineAddToPhotos className='text-[20px]' />
            </button>
            <button onClick={() => setSideBarOpen(false)} className='w-10 h-10 flex justify-center items-center rounded-lg bg-gray/80 text-white'>
              <FaChevronRight className='text-[20px]' />
            </button>
          </div>
        </div>
        <div className='flex flex-col gap-2'>

          {keys.map((key, index) => {
            return (
              <div key={key} className={`p-3 transition-all flex justify-start px-[5%] duration-200 rounded-md ${selectedKey === key ? 'bg-gray text-white' : 'bg-gray text-white opacity-50'}`}>
                <p onClick={() => selectKey(key)} className='w-[90%] cursor-pointer text-start truncate'>
                  {
                    key === 'novel_content' ? 'Default Note' : `Note ${index}`
                  }
                </p>
                {key !== 'novel_content' && <button onClick={
                  () => handleRemove(key)
                } className='w-[10%] text-center'>
                  <IoMdCloseCircleOutline className='text-[20px]' />
                </button>}

              </div>
            )
          })}
        </div>
      </div>
      <Editor key={selectedKey} storageKey={selectedKey} defaultValue={{
        "type": "doc",
        "content": [
          {
            "type": "paragraph"
          }
        ]
      }} onUpdate={(e) => {
        console.log(e)
      }} className='h-full text-white/80 w-full' />
    </div>
  )
}

export default NoteComponent