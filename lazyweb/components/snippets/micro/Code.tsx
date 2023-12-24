import React, { useEffect, useRef, useState } from 'react'
import AceEditor from "react-ace";

import { useSelectLanguage, useSelectTheme, useUIStore } from '@/hooks/Zustand';
import { useRouter } from 'next/router';

type Props = {
  noHeading?: boolean
}

const Code = ({noHeading}: Props) => {
  
  
  const {borderRadius} = useUIStore()
  const [heading, setHeading] = useState('')
  const router = useRouter()
  const selectedTheme = router.query.theme as string || 'monokai'
  const borderWidth = router.query.borderWidth as string || '1'
  const borderColor = router.query.borderColor as string || 'rgba(255,255,255,0.5)'
  const selectedLanguage = router.query.language as string || 'javascript'
  const value = router.query.code ? atob(router.query.code as string) : ''


  const onChange = (newValue: string) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        //base64 encoded newValue
        code: btoa(newValue)
      }
    }, undefined, { shallow: true })
  }




  return (
   <div style={{
    borderRadius: `${borderRadius+1}px`,
    boxShadow: `0 0 0 ${borderWidth}px ${borderColor}`,
   }} className='relative z-[1] shadow-2xl'>
   {!noHeading && <div className='w-full absolute justify-between flex px-[2%] top-[15px] z-[1]'>
      <div className='flex gap-[5px]'>
        <div className='w-[15px] h-[15px] rounded-[50%] bg-[#FF5F56]'></div>
        <div className='w-[15px] h-[15px] rounded-[50%] bg-[#FFBD2E]'></div>
        <div className='w-[15px] h-[15px] rounded-[50%] bg-[#27C93F]'></div>
      </div>
      <input style={{
        fontFamily:'jetbrainsmono',
      }} className='w-fit bg-transparent mt-[-5px] text-white/50 outline-none' placeholder='Untitled' value={heading} onChange={e=>{
        setHeading(e.target.value)
      }
      }/>
      <div/>
    </div>}
     <AceEditor
    placeholder=""
    mode={selectedLanguage}
    theme={selectedTheme}
    className=''
    style={{
      borderRadius: `${borderRadius}px`,
      width: '100%',
      minHeight: '50vh',
      

    }}
    onLoad={editor=>{
      editor.renderer.setPadding(20)
      editor.renderer.setScrollMargin(50, 20, 0, 0)
      //if router.query.code is empty, set the value to the default code

    }}
    name="blah2"
    
    onChange={onChange}
    fontSize={16}
    showPrintMargin={false}
    minLines={10}
    maxLines={Infinity}
    showGutter={false}
    wrapEnabled={true}
    highlightActiveLine={false}
    value={value}
    setOptions={{
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false,
    enableSnippets: false,
    showLineNumbers: false,
    tabSize: 2,
    displayIndentGuides: false,
    cursorStyle: 'slim',
    wrap: true,
    }}/>
   </div>
  )
}

export default Code