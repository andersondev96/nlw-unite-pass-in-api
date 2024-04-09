import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function updateAttendee(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.put('/attendees/:attendeeId', {
			schema: {
				summary: 'Update an attendee',
				tags: ['attendees'],
				params: z.object({
					attendeeId: z.coerce.number().int()
				}),
				body: z.object({
					name: z.string().min(4),
					email: z.string().email()
				}),
				response: {
					204: z.null()
				}
			}
		}, async (request, reply) => {

			const { attendeeId } = request.params

			const { name, email } = request.body

			const attendeeExists = await prisma.attendee.findUnique({
				where: {
					id: attendeeId
				}
			})

			if (!attendeeExists) {
				throw new BadRequest('Attendee does not exist')
			}

			await prisma.attendee.update({
				where: {
					id: attendeeId
				},
				data: {
					name,
					email
				}
			})

			return reply.status(204).send()
		})
}