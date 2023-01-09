type Props = {}
import { useAllResources } from 'hooks/Zustand';
import dynamic from "next/dynamic"
const TinderCard = dynamic(() => import('react-tinder-card'), {
  ssr: false
});
// import { Resource } from 'hooks/Zustand';
// import { ResourceCard } from 'components';
import React, { useState, useRef, useMemo } from 'react';
import { useEffect } from 'react';

declare type Direction = 'left' | 'right' | 'up' | 'down'

declare interface API {
  swipe(dir?: Direction): Promise<void>
  restoreCard (): Promise<void>
}

const SwipeUI = (props: Props) => {
  const {allResources} = useAllResources()
  const [resources, setResources] = useState(allResources)
  const [currentIndex, setCurrentIndex] = useState(resources.length - 1)
  const [lastDirection, setLastDirection] = useState<string>()
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () =>
      Array(resources.length)
        .fill(0)
        .map((i) => React.createRef<API>()),
    []
  )

  const updateCurrentIndex = (val:number) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < resources.length - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction:Direction, nameToDelete:string, index:number) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name:string, idx:number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current!.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir:Direction) => {
    if (canSwipe && currentIndex < resources.length) {
      await childRefs[currentIndex].current!.swipe(dir) // Swipe the card!
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current!.restoreCard()
  }

  useEffect(()=>{
    setResources(allResources)
  },[allResources])

  return (
    <div className='h-[100vh] w-[100vw] md:hidden flex bg-gray'>
      <div className='relative h-[100vh] w-[100vw] flex items-center justify-center'>
      {resources.map((e,index)=>{
            return (
                    <TinderCard ref={childRefs[index]}
                    key={e.url}
                    onSwipe={(dir) => swiped(dir, e.url, index)}
                    onCardLeftScreen={() => outOfFrame(e.url, index)} preventSwipe={['up', 'down']}  className='absolute' >
                      {/* <ResourceCard key={e.id} resource={e} description={e.desc} title={e.title} image={e.image_url} url={e.url}/> */}
                    </TinderCard>
              )
            })}
      </div>
    </div>
  )
}

export default SwipeUI