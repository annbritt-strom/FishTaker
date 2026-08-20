import { FishIcon } from "../assets/icons"

const Header = () => {
  return (
    <header className="flex px-32 bg-white items-center gap-2 p-4 mb-4 border-b border-b-gray-300">
        <FishIcon size={32} className="rounded-full" />
        <h1 className="text-xl font-bold">Tank Manager</h1>
    </header>
  )
}

export default Header
