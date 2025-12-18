
import { Router } from "express"
import { IO } from "../utils/fileUtils.js";
import { checkUsernameAndPassword } from "../utils/authUtils.js";

export const eventRouter = Router()

eventRouter.post("/events", async (req, res) => {
    if (!await checkUsernameAndPassword(res, req.body)) {
        return
    }
    const { eventName, ticketsForSale } = req.body
    if (!eventName || !ticketsForSale) {
        console.log(`no eventName or ticketsForSale received from user`);
        res.status(401).end("no eventName or ticketsForSale recieved")
        return
    }
    if (isNaN(parseInt(ticketsForSale))) {
        console.log(`ticketsForSale is not a number`);
        res.status(400).end(`ticketsForSale is not a number`)
        return
    }
    const storedEvents = await IO("../data/events.json")
    storedEvents.push({ eventName, ticketsAvailable: ticketsForSale, createdBy: req.body.username })
    const storeRes = await IO("../data/events.json", storedEvents, "write")
    if (storeRes === false) {
        console.log(`problem with saving event`);
        res.status(500).end("problem, event was not saved")
        return
    }
    res.status(200).end("Event created successfully")
    return
})