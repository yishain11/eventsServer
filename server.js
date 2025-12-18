import express from "express"
import { userRouter } from "./routers/users.router.js";
import { eventRouter } from "./routers/event.router.js";
import { ticketsRouter } from "./routers/tickets.router.js";

const server = express()

server.use(express.json())

server.use((req, res, next) => {
    console.log(`req url: ${req.url} method: ${req.method}, params: ${JSON.stringify(req.params)}, body: ${JSON.stringify(req.body)}`);
    next()
})

server.use(userRouter)
server.use(ticketsRouter)
server.use(eventRouter)

server.listen(3535, () => {
    console.log(`server listening on ${3535}`);
})