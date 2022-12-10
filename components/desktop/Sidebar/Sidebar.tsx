type Props = {}
import {SidebarCategory} from '../..'

const Sidebar = (props: Props) => {
  

  return (
    <div className="w-[12rem] bg-gray border-r border-lightGray min-h-[calc(100vh-130px)]">
      <div className="flex flex-col gap-[1rem] pt-[1rem] items-center">
        <SidebarCategory title='Category' options={['Javascript','HTML', 'CSS', 'Github', 'Tools']}/>
        <SidebarCategory title='Difficulty' options={['Beginner', 'Intermediate', 'Advanced']}/>
        <SidebarCategory title='Rating' options={['High', 'Low']}/>
      </div>
    </div>
  )
}

export default Sidebar