import {TopProduct} from '../..'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div className="w-[calc(100vw-12rem)] min-h-[calc(100vh-130px)] bg-gray">
      <TopProduct/>
    </div>
  )
}

export default Dashboard