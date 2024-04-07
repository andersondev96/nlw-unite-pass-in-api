import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { getEvent } from "./routes/get-event";
import { RegisterForEvent } from "./routes/register-for-event";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(RegisterForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)

app.listen({ port: 3333 }).then(() => {
	console.log('HTTP server running!')
})