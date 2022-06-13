import {
    HomeIcon,
    ChartBarIcon,
    ClockIcon,
    CogIcon,
} from "@heroicons/react/outline";

export default function Sidebar() {
  return (
    <div className="text-gray-300 p-5 text-xm border-gray-900">
        <div className="space-y-3">
          <button className="flex items-center space-x-2 hover:text-white">
            <HomeIcon className="h-5 w-5"/>
            <p>Dashboard</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <ChartBarIcon className="h-5 w-5"/>
            <p>Stat Settings</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <ClockIcon className="h-5 w-5"/>
            <p>History</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <CogIcon className="h-5 w-5"/>
            <p>Account Settings</p>
          </button>
        </div>
    </div>
  )
}