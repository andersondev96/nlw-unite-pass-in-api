import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function deleteEvent(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.delete('/events/:eventId', {
			schema: {
				summary: 'Delete an event',
				tags: ['events'],
				params: z.object({
					eventId: z.string(),
				}),
				response: {
					204: z.null()
				}
			}
		}, async (request, reply) => {

			const { eventId } = request.params

			const eventExists = await prisma.event.findUnique({
				where: {
					id: eventId
				}
			})

			if (!eventExists) {
				throw new BadRequest('Event does not exists')
			}

			await prisma.event.delete({
				where: {
					id: eventId
				}
			})

			return reply.status(204).send()
		})
}