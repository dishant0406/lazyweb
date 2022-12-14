import {TopProduct, ResourceList} from 'components'
import { formatUrl } from 'lib/formatUrl'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div className="w-[calc(100vw-12rem)] min-h-[calc(100vh-130px)] bg-gray">
      <TopProduct unformatUrl={'awwwards.com'} url={formatUrl('awwwards.com/websites')}/>
      <ResourceList/>
    </div>
  )
}

export default Dashboard