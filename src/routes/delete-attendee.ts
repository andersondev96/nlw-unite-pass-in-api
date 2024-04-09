import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function deleteAttendee(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.delete('/attendees/:attendeeId', {
			schema: {
				summary: 'Delete an attendee',
				tags: ['attendees'],
				params: z.object({
					attendeeId: z.coerce.number().int(),
				}),
				response: {
					204: z.null()
				}
			}
		}, async (request, reply) => {

			const { attendeeId } = request.params

			const attendeeExists = await prisma.attendee.findUnique({
				where: {
					id: attendeeId
				}
			})

			if (!attendeeExists) {
				throw new BadRequest('Attendee does not exists')
			}

			await prisma.attendee.delete({
				where: {
					id: attendeeId
				}
			})

			return reply.status(204).send()
		})
}