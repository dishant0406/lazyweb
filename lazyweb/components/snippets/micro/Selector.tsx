import React, { useEffect, useRef, useState } from 'react'
import { Select, SelectItem } from "@nextui-org/react";
import { generateGradient, themes, useSelectLanguage, useSelectTheme, useUIStore } from '@/hooks/Zustand';
import { Slider } from "@nextui-org/react";
import { languages } from '@/hooks/Zustand';
import { LuRefreshCcw } from "react-icons/lu";
import { HiOutlineDownload } from "react-icons/hi";
import { Popover, PopoverTrigger, PopoverContent, Button, Input, ButtonGroup } from "@nextui-org/react";
import { event } from 'nextjs-google-analytics';
import { FaRegFilePdf } from "react-icons/fa";
import { TbFileTypePng } from "react-icons/tb";
import { TbFileTypeSvg } from "react-icons/tb";
import { useRouter } from 'next/router';
import ReactTooltip from 'react-tooltip';
import { BiSolidColor } from "react-icons/bi";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaRegClipboard } from "react-icons/fa6";



type Props = {
  save: () => void,
  saveSVG: () => void,
  savePDF: () => void,
  uploadImage: () => void,
  saveClip: () => void,
}

const Selector = ({ save, saveSVG, savePDF, uploadImage, saveClip }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { paddingX, setPaddingX, width, setWidth, containerBorderRadius, setContainerBorderRadius, paddingY, setPaddingY, setGradient, borderRadius, setBorderRadius } = useUIStore()
  const router = useRouter()
  const colorRef = useRef<HTMLInputElement>(null)
  let selectedTheme = router.query.theme as string || 'monokai'
  let selectedLanguage = router.query.language as string || 'javascript'
  let borderWidth = router.query.borderWidth as string || '1'
  let borderColor = router.query.borderColor as string || 'rgba(255,255,255,0.5)'

  const loadTheme = async (themeName: any) => {
    await import(`ace-builds/src-noconflict/${themeName}.js`).catch((e) =>
      console.error(`Could not load theme: ${themeName}`, e)
    );
  };

  const loadMode = async (modeName: any) => {
    await import(`ace-builds/src-noconflict/${modeName}.js`).catch((e) =>
      console.error(`Could not load mode: ${modeName}`, e)
    );
  };


  const setSelectedTheme = async (theme: string) => {
    // const selectedtheme = themes.find(t => t.name === theme)
    // if (selectedtheme) {
    //   await loadTheme(selectedtheme.importName)
    // }
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        theme,
      }
    }, undefined, { shallow: true })

  }

  const setSelectedLanguage = async (language: string) => {
    // const selectedlanguage = languages.find(t => t.value === language)
    // if (selectedlanguage) {
    //   loadMode(selectedlanguage.importName)
    // }
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        language,
      }
    }, undefined, { shallow: true })

  }

  const setBorderWidth = (borderWidth: number) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        borderWidth,
      }
    }, undefined, { shallow: true })
  }


  // useEffect(() => {
  //   const load = async () => {
  //     const selectedtheme = themes.find(t => t.name === selectedTheme)
  //     if (selectedtheme) {
  //       await loadTheme(selectedtheme.importName)
  //     }
  //     const selectedlanguage = languages.find(t => t.value === selectedLanguage)
  //     if (selectedlanguage) {
  //       loadMode(selectedlanguage.importName)
  //     }
  //   }
  //   load()
  // }, [selectedTheme, selectedLanguage])





  return (
    <div className='w-full fixed bottom-[5vh] z-[10] flex justify-center'>
      <div className='w-[90vw] dark flex items-center justify-between px-[2%] border shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] border-white/50 rounded-[10px] py-[2rem] bg-[#202123]'>
        <Select classNames={{
          selectorIcon: 'text-white',
          base: 'text-white w-[10vw]',
        }} labelPlacement='inside' label="Theme" selectedKeys={
          new Set([selectedTheme])
        } onChange={e => {
          setSelectedTheme(e.target.value)

        }} >

          {themes.map((theme, index) => (
            <SelectItem key={theme.name} value={theme.name}>{theme.name.toUpperCase()}</SelectItem>
          ))}

        </Select>
        <Select classNames={{
          selectorIcon: 'text-white',
          base: 'text-white w-[10vw]',
        }} labelPlacement='inside' label="Language" selectedKeys={
          new Set([selectedLanguage])
        } onChange={e => {
          setSelectedLanguage(e.target.value)

        }} >

          {languages.map((theme, index) => (
            <SelectItem key={theme.value} value={theme.value}>{theme.name}</SelectItem>
          ))}

        </Select>
        <Slider
          label="Width"
          step={1}
          maxValue={80}
          minValue={30}
          defaultValue={50}
          value={Number(width)}
          onChange={e => {
            setWidth(e + '')
          }}
          classNames={{
            base: 'w-[5vw] text-white',
            label: 'text-[0.7vw]'
          }}
        />
        <Slider
          label="Pad X"
          step={1}
          maxValue={100}
          minValue={0}
          defaultValue={20}
          value={paddingX}
          onChange={e => {
            setPaddingX(e as number)
          }}
          classNames={{
            base: 'w-[5vw] text-white',
            label: 'text-[0.7vw]'
          }}
        />
        <Slider
          label="Pad Y"
          step={1}
          maxValue={100}
          minValue={0}
          defaultValue={20}
          value={paddingY}
          onChange={e => {
            setPaddingY(e as number)
          }}
          classNames={{
            base: 'w-[5vw] text-white',
            label: 'text-[0.7vw]'
          }}
        />
        <Slider
          label="Bor Width"
          step={1}
          maxValue={50}
          minValue={0}
          defaultValue={1}
          value={Number(borderWidth)}
          onChange={e => {
            setBorderWidth(e as number)
          }}
          classNames={{
            base: 'w-[5vw] text-white',
            label: 'text-[0.7vw]'
          }}
        />
        <Slider
          label="Border Radius"
          step={1}
          maxValue={50}
          minValue={0}
          defaultValue={20}
          value={borderRadius}
          onChange={e => {
            setBorderRadius(e as number)
          }}
          classNames={{
            base: 'w-[10vw] text-white',
            label: 'text-[0.7vw]'
          }}
        />
        <Slider
          label="Container Radius"
          step={1}
          maxValue={50}
          minValue={0}
          defaultValue={20}
          value={containerBorderRadius}
          onChange={e => {
            setContainerBorderRadius(e as number)
          }}
          classNames={{
            base: 'w-[10vw] text-white',
            label: 'text-[0.7vw]'
          }}
        />
        <div className='flex gap-[10px]'>
          <a data-tip data-for='refresh_background' onClick={() => {
            const bg = generateGradient()
            router.replace({
              pathname: router.pathname,
              query: {
                ...router.query,
                color: btoa(bg),
              }
            }, undefined, { shallow: true })
          }
          } className='h-[40px] w-[40px] cursor-pointer rounded-md flex items-center justify-center border border-white/50 bg-[#202123]'>
            <LuRefreshCcw className='text-white/50  text-xl' />
          </a>
          <a data-tip data-for='border_color' onClick={() => {
            colorRef.current?.click()
          }
          } className='h-[40px] w-[40px] relative cursor-pointer rounded-md flex items-center justify-center border border-white/50 bg-[#202123]'>
            <BiSolidColor className='text-white/50  text-xl' />
            <input ref={colorRef} value={
              borderColor
            } onChange={e => {
              router.replace({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  borderColor: e.target.value,
                }
              }, undefined, { shallow: true })
            }
            } type='color' height={0} width={0} className='absolute opacity-0 h-0 w-0 top-0 left-0' />
          </a>


          <Popover isKeyboardDismissDisabled={true} shouldCloseOnBlur={true} shouldBlockScroll={true} classNames={{
            trigger: 'z-0'
          }} isOpen={isEditOpen} onOpenChange={setIsEditOpen} placement="top" showArrow offset={10}>
            <PopoverTrigger>
              <div className='h-[40px] w-[40px] cursor-pointer rounded-md flex items-center justify-center border border-white/50 bg-[#202123]'>
                <HiOutlineDownload className='text-white/50  text-xl' />
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
              <div className="my-2 flex flex-col gap-2 w-full">
                <button onClick={() => {
                  event('upload image', {
                    category: 'upload-image-snippet',
                    title: 'upload-image-snippet',
                    url: 'upload-image-snippet',
                  })

                  uploadImage()
                  setIsEditOpen(false)
                }} className="flex items-center gap-[1rem]">
                  <MdOutlineFileUpload className={` text-[18px] hover:scale-[1.1] cursor-pointer transition-all`} />

                  <p className="text-[14px]">
                    Upload to ImgBB
                  </p>
                </button>
              </div>
              <div className="my-2 flex flex-col gap-2 w-full">
                <button onClick={() => {
                  event('upload image', {
                    category: 'upload-image-snippet',
                    title: 'upload-image-snippet',
                    url: 'upload-image-snippet',
                  })

                  saveClip()
                  setIsEditOpen(false)
                }} className="flex items-center gap-[1rem]">
                  <FaRegClipboard className={` text-[18px] hover:scale-[1.1] cursor-pointer transition-all`} />

                  <p className="text-[14px]">
                    Copy to Clipboard
                  </p>
                </button>
              </div>
            </PopoverContent>
          </Popover>

        </div>

        <ReactTooltip className='bg-gray' type='warning' id='refresh_background' place='bottom'>
          Refresh Background
        </ReactTooltip>
        <ReactTooltip className='bg-gray' type='warning' id='border_color' place='bottom'>
          Border Color
        </ReactTooltip>
      </div>
    </div>
  )
}

export default Selector