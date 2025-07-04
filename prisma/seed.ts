import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Clear existing matches
    await prisma.match.deleteMany()

    // Create sample matches
    const matches = [
        {
            homeTeam: 'Arsenal',
            homeTeamLogo: '/placeholder-team.png',
            awayTeam: 'Chelsea',
            awayTeamLogo: '/placeholder-team.png',
            league: 'Premier League',
            leagueLogo: '/placeholder.svg',
            matchTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            stadium: 'Emirates Stadium',
        },
        {
            homeTeam: 'Real Madrid',
            homeTeamLogo: '/placeholder-team.png',
            awayTeam: 'Barcelona',
            awayTeamLogo: '/placeholder-team.png',
            league: 'La Liga',
            leagueLogo: '/placeholder.svg',
            matchTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
            stadium: 'Santiago Bernabéu',
        },
        {
            homeTeam: 'Bayern Munich',
            homeTeamLogo: '/placeholder-team.png',
            awayTeam: 'Borussia Dortmund',
            awayTeamLogo: '/placeholder-team.png',
            league: 'Bundesliga',
            leagueLogo: '/placeholder.svg',
            matchTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            stadium: 'Allianz Arena',
        },
        {
            homeTeam: 'Juventus',
            homeTeamLogo: '/placeholder-team.png',
            awayTeam: 'Inter',
            awayTeamLogo: '/placeholder-team.png',
            league: 'Serie A',
            leagueLogo: '/placeholder.svg',
            matchTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
            stadium: 'Allianz Stadium',
        },
        {
            homeTeam: 'Manchester City',
            homeTeamLogo: '/placeholder-team.png',
            awayTeam: 'Liverpool',
            awayTeamLogo: '/placeholder-team.png',
            league: 'Premier League',
            leagueLogo: '/placeholder.svg',
            matchTime: new Date(Date.now() + 120 * 60 * 60 * 1000), // 5 days from now
            stadium: 'Etihad Stadium',
        },
    ]

    for (const matchData of matches) {
        await prisma.match.create({
            data: matchData,
        })
    }

    // Create sample predictions
    const predictions = [
        {
            homeTeam: 'Arsenal',
            awayTeam: 'Chelsea',
            league: 'Premier League',
            matchTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            prediction: 'Home Win',
            odds: 1.85,
            confidence: 85,
            status: 'upcoming',
        },
        {
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            league: 'La Liga',
            matchTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
            prediction: 'Draw',
            odds: 3.20,
            confidence: 70,
            status: 'upcoming',
        },
        {
            homeTeam: 'Bayern Munich',
            awayTeam: 'Borussia Dortmund',
            league: 'Bundesliga',
            matchTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            prediction: 'Home Win',
            odds: 1.65,
            confidence: 90,
            status: 'upcoming',
        },
        {
            homeTeam: 'Manchester City',
            awayTeam: 'Liverpool',
            league: 'Premier League',
            matchTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
            prediction: 'Away Win',
            odds: 2.10,
            confidence: 75,
            status: 'upcoming',
        },
        {
            homeTeam: 'PSG',
            awayTeam: 'Marseille',
            league: 'Ligue 1',
            matchTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            prediction: 'Home Win',
            odds: 1.45,
            confidence: 95,
            status: 'upcoming',
        },
        {
            homeTeam: 'Juventus',
            awayTeam: 'AC Milan',
            league: 'Serie A',
            matchTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
            prediction: 'Draw',
            odds: 3.40,
            confidence: 65,
            status: 'upcoming',
        },
    ]

    for (const predictionData of predictions) {
        await prisma.prediction.create({
            data: predictionData,
        })
    }

    // Create sample testimonials
    const testimonials = [
        {
            author: 'John Smith',
            rating: 5.0,
            content: 'Amazing predictions! I\'ve been following for 3 months and my success rate has improved dramatically.',
            source: 'Trustpilot',
        },
        {
            author: 'Sarah Johnson',
            rating: 5.0,
            content: 'The VIP predictions are worth every penny. Highly recommend!',
            source: 'Google Reviews',
        },
        {
            author: 'Mike Davis',
            rating: 4.5,
            content: 'Great analysis and insights. The team really knows their football.',
            source: 'Direct',
        },
        {
            author: 'Emma Wilson',
            rating: 5.0,
            content: 'Best prediction service I\'ve ever used. Consistent results!',
            source: 'Trustpilot',
        },
    ]

    for (const testimonialData of testimonials) {
        await prisma.testimonial.create({
            data: testimonialData,
        })
    }

    // Create sample team members
    const teamMembers = [
        {
            name: 'David Thompson',
            role: 'Head Analyst',
            bio: 'Former professional footballer with 15+ years of experience in sports analysis.',
            imageUrl: '/placeholder-team.png',
        },
        {
            name: 'Lisa Chen',
            role: 'Data Scientist',
            bio: 'Expert in statistical modeling and machine learning for sports predictions.',
            imageUrl: '/placeholder-team.png',
        },
        {
            name: 'Marcus Rodriguez',
            role: 'Scout',
            bio: 'Former scout for top European clubs with extensive network in football.',
            imageUrl: '/placeholder-team.png',
        },
    ]

    for (const teamMemberData of teamMembers) {
        await prisma.teamMember.create({
            data: teamMemberData,
        })
    }

    // Create sample VIP prediction categories
    const categories = [
        {
            name: 'Premier League',
            slug: 'premier-league',
            description: 'Top tier English football predictions',
            successRate: 78.5,
            totalPicks: 45,
        },
        {
            name: 'La Liga',
            slug: 'la-liga',
            description: 'Spanish league predictions',
            successRate: 82.1,
            totalPicks: 32,
        },
    ]

    for (const categoryData of categories) {
        await prisma.vIPPredictionCategory.create({
            data: categoryData,
        })
    }

    // Create sample VIP predictions
    const vipPredictions = [
        {
            categoryId: 1, // Premier League
            homeTeam: 'Manchester United',
            awayTeam: 'Arsenal',
            league: 'Premier League',
            matchTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            prediction: 'Home Win',
            odds: 2.10,
            analysis: 'United has been in great form at home this season.',
            confidence: 85,
            status: 'won',
            result: '2-1',
            createdBy: 1,
        },
        {
            categoryId: 1, // Premier League
            homeTeam: 'Chelsea',
            awayTeam: 'Liverpool',
            league: 'Premier League',
            matchTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            prediction: 'Draw',
            odds: 3.40,
            analysis: 'Both teams are evenly matched.',
            confidence: 75,
            status: 'won',
            result: '1-1',
            createdBy: 1,
        },
        {
            categoryId: 2, // La Liga
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            league: 'La Liga',
            matchTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            prediction: 'Home Win',
            odds: 1.95,
            analysis: 'Madrid is stronger at home.',
            confidence: 80,
            status: 'won',
            result: '3-1',
            createdBy: 1,
        },
    ]

    for (const vipPredictionData of vipPredictions) {
        await prisma.vIPPrediction.create({
            data: vipPredictionData,
        })
    }

    console.log('✅ Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 