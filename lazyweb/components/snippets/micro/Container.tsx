import React, { useRef, useState } from 'react'
import Selector from './Selector';
import { generateGradient, useUIStore } from '@/hooks/Zustand';
import * as htmlToImage from 'html-to-image';
import generatePDF from 'react-to-pdf'
import {uniqueNamesGenerator,adjectives, colors, names} from 'unique-names-generator'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

type Props = {
  children?: React.JSX.Element | React.JSX.Element[]
}


const Container = ({children}: Props) => {
  const {height, width, borderRadius,containerBorderRadius, paddingX, paddingY} = useUIStore()
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  let color = router.query.color as string 
  const handleSave = () => {
    if (divRef.current) {
      htmlToImage.toPng(divRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          const fileName = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, names],
            length: 3,
            separator: '-',
            style: 'capital'
          });
          link.download = `${fileName}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Something went wrong when converting to image', error);
        });
    }
  };

  const handleSaveToIMBB = () => {
    if (divRef.current) {
      htmlToImage.toPng(divRef.current)
        .then((dataUrl) => {
          // Convert image to Blob
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              const name = uniqueNamesGenerator({
                dictionaries: [adjectives, colors, names],
                length: 3,
                separator: '-',
                style: 'capital'
              });
              const imbbAPIKey = process.env.NEXT_PUBLIC_IMBB_API_KEY;
              const formData = new FormData();
              formData.append('image', blob);
              formData.append('key', imbbAPIKey!);
              formData.append('name', name);
              formData.append('expiration', '15552000');
              formData.append('title', name);
             

              // Upload to IMGBB
              fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
              })
                .then(response => response.json())
                .then(data => {
                  const link = document.createElement('a');
                  const fileName = uniqueNamesGenerator({
                    dictionaries: [adjectives, colors, names],
                    length: 3,
                    separator: '-',
                    style: 'capital'
                  });
                  //target="_blank"
                  link.target = '_blank';
                  link.download = `${fileName}.png`;
                  link.href = data.data.url;
                  link.click();
                })
                .catch(error => {
                  console.error('Error uploading image to IMGBB:', error);
                });

            })
            .catch(error => {
              console.error('Error converting image to Blob:', error);
            });
        })
        .catch((error) => {
          console.error('Something went wrong when converting to image', error);
        });
    }
  };

  const handleSaveClipboard = () => {
    if (divRef.current) {
      htmlToImage.toBlob(divRef.current)
        .then((blob) => {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob! })
          ])
          .then(() => {
           toast.success('Image copied to clipboard')
          })
          .catch((error) => {
            toast.error('Something went wrong when copying to clipboard')
          });
        })
        .catch((error) => {
          toast.error('Something went wrong when converting to image')
        });
    }
  };
  
  

  const handleSaveSVG = () => {
    if (divRef.current) {
      htmlToImage.toSvg(divRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          const fileName = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, names],
            length: 3,
            separator: '-',
            style: 'capital'
          });
          link.download = `${fileName}.svg`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Something went wrong when converting to image', error);
        });
    }
  }

  const handleSavePDF = () => {
    if (divRef.current) {
      const filename = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, names],
        length: 3,
        separator: '-',
        style: 'capital'
      });
      const pdf = generatePDF(divRef, {
        filename: `${filename}.pdf`,
        page:{
          orientation: 'landscape',
          format: 'a4',
          
        },
        canvas:{
          qualityRatio: 1,
        },
        resolution: 10
      })
      
    }
  }

  

  return (
    <>
      <div ref={divRef} style={{
        width: `${width}vw`,
        background: atob(color),
        borderRadius: (paddingX===0 && paddingY===0) ? `${borderRadius}px` : `${containerBorderRadius}px`,
        padding: `${paddingY}px ${paddingX}px`
      }} className=' transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'>
        {children}
      </div>
      <Selector saveClip={handleSaveClipboard} uploadImage={handleSaveToIMBB} savePDF={handleSavePDF} saveSVG={handleSaveSVG} save={handleSave} />
    </>
  )
}

export default Container