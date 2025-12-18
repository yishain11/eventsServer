
import { Router } from "express"
import { IO, searchInData } from "../utils/fileUtils.js";
import { checkUsernameAndPassword } from "../utils/authUtils.js";

export const ticketsRouter = Router()

ticketsRouter.post("/tickets/buy", async (req, res) => {
    if (!await checkUsernameAndPassword(res, req.body)) {
        return
    }
    const { eventName, quantity } = req.body
    if (!eventName || !quantity) {
        console.log(`no eventName or ticketsForSale received from user`);
        res.status(401).end("no eventName or ticketsForSale recieved")
        return
    }
    if (isNaN(parseInt(quantity))) {
        console.log(`quantity is not a number`);
        res.status(400).end(`quantity is not a number`)
        return
    }
    // check event name 
    const storedEvent = await searchInData("../data/events.json", "eventName", eventName)
    if (!storedEvent) {
        console.log(`event name: ${eventName} not found`);
        res.status(404).end(`event name: ${eventName} not found`)
        return
    }
    if (storedEvent.ticketsForSale - parseInt(quantity) <= 0) {
        console.log(`not enough tickets to buy: ${storedEvent.ticketsForSale} in event ${eventName}`);
        res.status(500).end(`not enough tickets to buy: ${storedEvent.ticketsForSale} in event ${eventName}`)
        return
    }
    // create a recite
    const username = req.body.username
    const receipt = { username, eventName, ticketsBought: quantity }
    const storedReceipts = await IO("../data/receipts.json")
    storedReceipts.push(receipt)
    const storeRes = await IO("../data/receipts.json", storedReceipts, "write")
    if (storeRes === false) {
        console.log(`problem with saving new receipt`);
        res.status(500).end("problem, new receipt was not saved")
        return
    }
    // update available tickets in event
    const allEvents = await IO("../data/events.json")
    for (const event of allEvents) {
        if (event.eventName === eventName) {
            event.ticketsForSale -= quantity
        }
    }
    await IO("../data/events.json", allEvents, "write")
    res.status(200).end("Tickets purchased successfully")
    return
})