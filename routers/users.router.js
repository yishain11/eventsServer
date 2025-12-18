
import { Router } from "express"
import { IO, searchInData } from "../utils/fileUtils.js";
import { findStoredUser } from "../utils/userUtils.js";

export const userRouter = Router()

userRouter.post("/register", async (req, res) => {
    if (!await checkUsernameAndPassword(res, req.body)) {
        return
    }
    console.log(`checking username uniquness`);
    const isUserExists = await searchInData("../data/users.json", "username", username)
    if (isUserExists) {
        console.log(`username ${username} already found`);
        res.status(401).end(`username: ${username} already exists`)
        return
    }
    const storedUsers = await IO("../data/users.json")
    storedUsers.push({ username, password })
    const storeRes = await IO("../data/users.json", storedUsers, "write")
    if (storeRes === false) {
        console.log(`problem with saving user`);
        res.status(500).end("problem, user was not saved")
        return
    }
    res.status(200).end("User registered successfully")
    return
})

userRouter.get("/users/:username/summary", async (req, res) => {
    const username = req.params.username
    if (!username) {
        res.status(400).end("no username")
        return
    }
    if (!await findStoredUser(username)) {
        res.status(404).end(`given username: ${username} not found`)
        return
    }
    const storedReciepts = await IO("../data/receipts.json")
    const userSummary = {
        totalTicketsBought: 0,
        events: [],
        averageTicketsPerEvent: 0
    }
    storedReciepts.filter((recieptObj) => {
        return recieptObj.username === username
    }).forEach((recieptObj) => {
        recieptObj.ticketsBought = parseInt(recieptObj.ticketsBought)
        userSummary.events.push(recieptObj.eventName)
        userSummary.totalTicketsBought += recieptObj.ticketsBought
    })
    if (!(userSummary.events.length === 0)) {
        userSummary.averageTicketsPerEvent = (userSummary.totalTicketsBought / userSummary.events.length)
    }
    console.log(`created user summary: ${JSON.stringify(userSummary)}`);
    res.status(200).json(userSummary).end()
    return
})