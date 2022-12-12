import {TopProduct, ResourceList} from '../..'
import { formatUrl } from '../../../lib/formatUrl'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div className="w-[calc(100vw-12rem)] min-h-[calc(100vh-130px)] bg-gray">
      <TopProduct unformatUrl={'roadmap.sh'} url={formatUrl('roadmap.sh')}/>
      <ResourceList/>
    </div>
  )
}

export default Dashboard