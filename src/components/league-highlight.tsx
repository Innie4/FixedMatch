import Image from "next/image"
import Link from "next/link"

interface LeagueHighlightProps {
  league: {
    id: number
    name: string
    logo: string
    country: string
  }
}

export default function LeagueHighlight({ league }: LeagueHighlightProps) {
  return (
    <Link
      href={`/league/${league.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center text-center hover:shadow-md transition-all"
    >
      <Image src={league.logo || "/placeholder.svg"} alt={league.name} width={48} height={48} className="mb-2" />
      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{league.name}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{league.country}</p>
    </Link>
  )
}
