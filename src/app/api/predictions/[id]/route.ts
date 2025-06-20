// app/api/predictions/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id
    if (!matchId) {
      return NextResponse.json({ error: 'Match ID is required.' }, { status: 400 })
    }
    const alt_key = '6JxM1FTVfM2hEBpq1noBubfoZCFsvEzAZEpidCYZUzOFdpXXpPaOwFEZZKfL'
    const url = `https://v3.football.api-sports.io/prediction?fixtures=${encodeURIComponent(matchId)}`
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-key': '85640505820b3d576f53117144276ffb',
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `External API returned status ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    // If no fixture found, return 404
    if (!Array.isArray(data.response) || data.response.length === 0) {
      return NextResponse.json(
        { error: `No Prediction found for ID ${matchId}.` },
        { status: 404 }
      )
    }

    // Return exactly the JSON object for the found fixture
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch prediction fixture:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
