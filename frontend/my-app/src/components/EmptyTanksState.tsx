import AquariumIllustration from "./AquariumIllustration"
import { DetailedFishIcon, ToolBoxIcon, DropletsIcon, AddIcon } from "../assets/icons"

type EmptyTanksStateProps = {
  onCreateTank: () => void
}

const features = [
  {
    emoji: <DetailedFishIcon className="text-orange-400 pb-1" />,
    title: "Add fish",
    description: "Keep track of the fish in your aquarium.",
  },
  {
    emoji: <DropletsIcon className="text-sky-400 pb-1" />,
    title: "Track water",
    description: "Monitor important water parameters.",
  },
  {
    emoji: <ToolBoxIcon className="text-green-400 pb-1" />  ,
    title: "Maintenance",
    description: "Stay on top of water changes and aquarium maintenance.",
  },
]

const EmptyTanksState = ({ onCreateTank }: EmptyTanksStateProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-14 shadow-sm sm:px-12">
      {/* subtle background bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-sky-50" />
        <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-sky-50" />
        <div className="absolute bottom-6 right-16 h-10 w-10 rounded-full bg-orange-50" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <AquariumIllustration />

        <h3 className="mt-6 text-xl font-bold text-slate-800 sm:text-2xl">
          Your aquarium awaits
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-500 sm:text-base">
          Start keeping track of your fish, water parameters,
          equipment, and maintenance.
        </p>

        <button
          onClick={onCreateTank}
          className="hover:cursor-pointer flex items-center mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
        >
          <AddIcon size={14} className="mr-2" /> Create your first tank
        </button>

        <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-6 border-t border-slate-100 pt-8 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center gap-1 text-center">
              <span className="text-xl" aria-hidden="true">{feature.emoji}</span>
              <p className="text-sm font-semibold text-slate-700">{feature.title}</p>
              <p className="text-xs text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmptyTanksState
