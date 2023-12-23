import React, { useEffect, useState } from 'react'
import {Select,  SelectItem} from "@nextui-org/react";
import { themes, useSelectLanguage, useSelectTheme, useUIStore } from '@/hooks/Zustand';
import {Slider} from "@nextui-org/react";
import { languages } from '@/hooks/Zustand'; 
import { LuRefreshCcw } from "react-icons/lu";
import { HiOutlineDownload } from "react-icons/hi";
import { Popover, PopoverTrigger, PopoverContent, Button, Input, ButtonGroup } from "@nextui-org/react";
import { event } from 'nextjs-google-analytics';
import { FaRegFilePdf } from "react-icons/fa";
import { TbFileTypePng } from "react-icons/tb";
import { TbFileTypeSvg } from "react-icons/tb";
import { useRouter } from 'next/router';
/*
  
*/


type Props = {
  save: () => void,
  saveSVG: () => void,
  savePDF: () => void,
  uploadImage: () => void,
}

const Selector = ({save, saveSVG, savePDF, uploadImage}: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const {paddingX, setPaddingX,containerBorderRadius, setContainerBorderRadius, paddingY,setPaddingY,setGradient,borderRadius, setBorderRadius} = useUIStore()
  const router = useRouter()
  let selectedTheme = router.query.theme as string || 'monokai'
  let selectedLanguage = router.query.language as string || 'javascript'

  const setSelectedTheme = (theme: string) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        theme,
      }
    }, undefined, { shallow: true })
    
  }

  const setSelectedLanguage = (language: string) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        language,
      }
    }, undefined, { shallow: true })
    
  }


 useEffect(() => {
  console.log(router.query, 'router.query')
 }, [router.query])





  return (
    <div className='w-full fixed bottom-[5vh] flex justify-center'>
      <div className='w-[90vw] dark flex items-center justify-between px-[2%] border shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] border-white/50 rounded-[10px] py-[2rem] bg-[#202123]'>
        <Select classNames={{
          selectorIcon: 'text-white',
          base: 'text-white w-[10vw]',
        }} labelPlacement='inside' label="Theme" selectedKeys={
          new Set([selectedTheme])
        } onChange={e=>{
          setSelectedTheme(e.target.value)
        
        }} >
          
            {themes.map((theme, index)=>(
              <SelectItem key={theme} value={theme}>{theme.toUpperCase()}</SelectItem>
            ))}
          
        </Select>
        <Select classNames={{
          selectorIcon: 'text-white',
          base: 'text-white w-[10vw]',
        }} labelPlacement='inside' label="Language" selectedKeys={
          new Set([selectedLanguage])
        } onChange={e=>{
          setSelectedLanguage(e.target.value)
        
        }} >
          
            {languages.map((theme, index)=>(
              <SelectItem key={theme} value={theme}>{theme.toUpperCase()}</SelectItem>
            ))}
          
        </Select>
        <Slider 
        label="Padding X" 
        step={1} 
        maxValue={100} 
        minValue={0} 
        defaultValue={20}
        value={paddingX}
        onChange={e=>{
          setPaddingX(e as number)
        }}
        classNames={{
          base: 'w-[10vw] text-white',
        }}
      />
        <Slider 
        label="Padding Y" 
        step={1} 
        maxValue={100} 
        minValue={0} 
        defaultValue={20}
        value={paddingY}
        onChange={e=>{
          setPaddingY(e as number)
        }}
        classNames={{
          base: 'w-[10vw] text-white',
        }}
      />
        <Slider 
        label="Border Radius" 
        step={1} 
        maxValue={50} 
        minValue={0} 
        defaultValue={20}
        value={borderRadius}
        onChange={e=>{
          setBorderRadius(e as number)
        }}
        classNames={{
          base: 'w-[10vw] text-white',
        }}
      />
        <Slider 
        label="Container Radius" 
        step={1} 
        maxValue={50} 
        minValue={0} 
        defaultValue={20}
        value={containerBorderRadius}
        onChange={e=>{
          setContainerBorderRadius(e as number)
        }}
        classNames={{
          base: 'w-[10vw] text-white',
        }}
      />
      <div onClick={()=>{
          setGradient()
        }
        } className='h-[40px] w-[40px] cursor-pointer rounded-md flex items-center justify-center border border-white/50 bg-[#202123]'>
      <LuRefreshCcw  className='text-white/50  text-xl'/>
      </div>
      
      <Popover isKeyboardDismissDisabled={true} shouldCloseOnBlur={true} shouldBlockScroll={true} classNames={{
                trigger: 'z-0'
              }} isOpen={isEditOpen} onOpenChange={setIsEditOpen} placement="top" showArrow offset={10}>
                <PopoverTrigger>
                <div className='h-[40px] w-[40px] cursor-pointer rounded-md flex items-center justify-center border border-white/50 bg-[#202123]'>
                <HiOutlineDownload  className='text-white/50  text-xl'/>
                </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="my-2 flex flex-col gap-2 w-full">
                    <button onClick={() => {
                      event('download png', {
                        category: 'download-png-snippet',
                        title: 'download-png-snippet',
                        url: 'download-png-snippet',
                      })
                      save()
                      setIsEditOpen(false)
                    }} className="flex items-center gap-[1rem]">
                      <TbFileTypePng className={` text-[18px] hover:scale-[1.1] cursor-pointer transition-all`} />

                      <p className="text-[14px]">
                        Save PNG
                      </p>
                    </button>
                  </div>
                  <div className="my-2 flex flex-col gap-2 w-full">
                    <button onClick={() => {
                      event('download svg', {
                        category: 'download-svg-snippet',
                        title: 'download-svg-snippet',
                        url: 'download-svg-snippet',
                      })
                      
                      saveSVG()
                      setIsEditOpen(false)
                    }} className="flex items-center gap-[1rem]">
                      <TbFileTypeSvg className={` text-[18px] hover:scale-[1.1] cursor-pointer transition-all`} />

                      <p className="text-[14px]">
                        Save SVG
                      </p>
                    </button>
                  </div>
                  <div className="my-2 flex flex-col gap-2 w-full">
                    <button onClick={() => {
                      event('download pdf', {
                        category: 'download-pdf-snippet',
                        title: 'download-pdf-snippet',
                        url: 'download-pdf-snippet',
                      })
                      
                      savePDF()
                      setIsEditOpen(false)
                    }} className="flex items-center gap-[1rem]">
                      <FaRegFilePdf className={` text-[18px] hover:scale-[1.1] cursor-pointer transition-all`} />

                      <p className="text-[14px]">
                        Save PDF
                      </p>
                    </button>
                  </div>
                  {/* <div className="my-2 flex flex-col gap-2 w-full">
                    <button onClick={() => {
                      event('upload image', {
                        category: 'upload-image-snippet',
                        title: 'upload-image-snippet',
                        url: 'upload-image-snippet',
                      })
                      
                      uploadImage()
                      setIsEditOpen(false)
                    }} className="flex items-center gap-[1rem]">
                      <FaRegFilePdf className={` text-[18px] hover:scale-[1.1] cursor-pointer transition-all`} />

                      <p className="text-[14px]">
                        Save to Imgur
                      </p>
                    </button>
                  </div> */}
                </PopoverContent>
              </Popover>

     
      
      </div>
    </div>
  )
}

export default Selector