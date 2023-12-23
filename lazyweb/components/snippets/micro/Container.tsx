import React, { useRef, useState } from 'react'
import Selector from './Selector';
import { useUIStore } from '@/hooks/Zustand';
import * as htmlToImage from 'html-to-image';
import generatePDF from 'react-to-pdf'
import {uniqueNamesGenerator,adjectives, colors, names} from 'unique-names-generator'

type Props = {
  children?: React.JSX.Element | React.JSX.Element[]
}


const Container = ({children}: Props) => {
  const {height, width, gradient, borderRadius,containerBorderRadius, paddingX, paddingY} = useUIStore()
  const divRef = useRef<HTMLDivElement>(null);

 
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

  const handleSaveToImgur = () => {
    if (divRef.current) {
      htmlToImage.toPng(divRef.current)
        .then((dataUrl) => {
          // Convert image to Blob
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              const formData = new FormData();
              formData.append('image', blob);
  
              // Imgur API endpoint
              const imgurAPI = 'https://api.imgur.com/3/upload';
  
              // Your Imgur client ID
              const clientId = '16450111350eabb';
  
              // Post the image to Imgur
              fetch(imgurAPI, {
                method: 'POST',
                headers: {
                  Authorization: `Client-ID ${clientId}`,
                },
                body: formData,
              })
              .then(response => response.json())
              .then(result => {
                if (result.success) {
                  //open image in new tab
                  window.open(result.data.link, '_blank');
                } else {
                  console.error('Imgur upload failed:', result);
                }
              })
              .catch(error => {
                console.error('Error uploading image to Imgur:', error);
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
        
      })
      
    }
  }

  

  return (
    <>
      <div ref={divRef} style={{
        minHeight: `${height}vh`,
        width: `${width}vw`,
        background: gradient,
        borderRadius: (paddingX===0 && paddingY===0) ? `${borderRadius}px` : `${containerBorderRadius}px`,
        padding: `${paddingY}px ${paddingX}px`
      }} className=' transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'>
        {children}
      </div>
      <Selector uploadImage={handleSaveToImgur} savePDF={handleSavePDF} saveSVG={handleSaveSVG} save={handleSave} />
    </>
  )
}

export default Container