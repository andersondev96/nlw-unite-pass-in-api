import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { generateSlug } from "../utils/generate-slug"
import { BadRequest } from "./_errors/bad-request"

export async function updateEvent(app: FastifyInstance) {
	app.
		withTypeProvider<ZodTypeProvider>()
		.put('/events/:eventId', {
			schema: {
				summary: 'Update an event',
				tags: ['events'],
				params: z.object({
					eventId: z.string(),
				}),
				body: z.object({
					title: z.string().min(4),
					details: z.string(),
					maximumAttendees: z.number().int().positive().nullable()
				}),
				response: {
					204: z.null()
				}
			}
		}, async (request, reply) => {

			const { eventId } = request.params

			const {
				title,
				details,
				maximumAttendees } = request.body

			const eventExists = await prisma.event.findUnique({
				where: {
					id: eventId
				}
			})

			if (!eventExists) {
				throw new BadRequest('Event does not exists')
			}

			const slug = generateSlug(title)

			const eventWithSameSlug = await prisma.event.findUnique({
				where: {
					slug,
				}
			})

			if (eventWithSameSlug) {
				throw new BadRequest(`Another event with same title already exists.`)
			}

			await prisma.event.update({
				where: {
					id: eventId,
				},

				data: {
					title,
					details,
					maximumAttendees,
					slug,
				}
			})

			return reply.status(204).send()
		})
}

