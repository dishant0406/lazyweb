
import { useAllTags } from 'hooks/Zustand';
import { CategoryPill } from 'components';
import { useEffect } from 'react';

type Props = {}

function shuffleArray(array: any[]) {
  // Creating a copy of the array to avoid modifying the original array
  const shuffledArray = array.slice();

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generating a random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swapping elements at indices i and randomIndex
    [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
  }

  return shuffledArray;
}

const Category = (props: Props) => {
  const { allTags, setAllTags } = useAllTags()

  useEffect(() => {
    setAllTags()
  }, [])
  return (
    <div className='pt-[70px] '>
      <div id='style-4' className="w-[100vw] lazyweb-tags overflow-x-scroll border-b border-[#5e5f60] gap-[1rem] flex justify-start px-[3rem] items-center h-[60px] bg-[#202124]">

        {
          allTags.length > 0 && shuffleArray(allTags).map((tag) => {
            return <CategoryPill key={tag} name={tag} />
          })
        }
      </div>
    </div>
  )
}

export default Category