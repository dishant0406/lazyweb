import {ResourceListBar, ResourceCard} from 'components'

type Props = {}

const ResourceList = (props: Props) => {
  return (
    <div>
      <ResourceListBar/>
      <div className="w-[100%] flex justify-center">
        <div className="flex ml-[2rem] w-[95%] justify-start gap-[2rem] flex-wrap my-[1rem]">
          <ResourceCard url={'readme.so'}/>
          <ResourceCard url={'colorhunt.co'}/>
          <ResourceCard url={'roadmap.sh'}/>
          <ResourceCard url={'screenlane.com'}/>
          <ResourceCard url={'awwwards.com/websites'}/>
        </div>
      </div>
    </div>
  )
}

export default ResourceList