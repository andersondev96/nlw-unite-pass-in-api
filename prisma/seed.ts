import { prisma } from '../src/lib/prisma'

async function seed() {
	await prisma.event.create({
		data: {
			id: 'cb0e032a-fd91-440c-8093-34ae7b8566e7',
			title: 'Unite Summit',
			slug: 'unite-summit',
			details: 'Um evento p/ devs apaixonados (as) por código',
			maximumAttendees: 120,
		}
	})
}


seed().then(() => {
	console.log("Database seeded!")
	prisma.$disconnect()
})