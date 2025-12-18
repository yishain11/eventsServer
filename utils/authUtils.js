import { searchInData } from "./fileUtils.js";

export async function checkUsernameAndPassword(res, body) {
    if (!body) {
        console.log(`no body`);
        res.status(400).end("missing body data")
        return
    }
    const { username, password } = body
    if (!username || !password) {
        console.log(`no username or passwod received from user`);
        res.status(401).end("no username or password recieved")
        return
    }
    console.log(`checking username and password`);
    const userInData = await searchInData("../data/users.json", "username", username)
    if (!userInData) {
        console.log(`username ${username} does not exists`);
        res.status(401).end(`username ${username} does not exists`)
        return
    }
    if (userInData.password !== password) {
        console.log(`username and password dont match`);
        res.status(401).end(`username and password dont match`)
        return
    }
    return true
}