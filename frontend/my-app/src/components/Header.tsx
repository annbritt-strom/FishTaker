import { FishIcon } from "../assets/icons"

const Header = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 sm:px-6 lg:px-10">
        <FishIcon size={28} className="rounded-full text-orange-500" />
        <h1 className="text-xl font-bold text-slate-800">FihTaker</h1>
      </div>
    </header>
  )
}

export default Header
