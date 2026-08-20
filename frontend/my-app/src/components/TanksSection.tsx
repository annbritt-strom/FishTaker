import AddTankCard from "./AddTankCard"

type TanksSectionProps = {
  onTankAdded?: () => void
}

const TanksSection = ({ onTankAdded }: TanksSectionProps) => {
  return (
    <div className="px-32">
      <div className="flex items-center justify-between  p-4 rounded">
        <h2 className="text-2xl font-bold">Your Tanks</h2>
        <AddTankCard onTankAdded={onTankAdded} />
      </div>
    </div>
  )
}

export default TanksSection
