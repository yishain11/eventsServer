import { searchInData } from "./fileUtils.js";

export async function findStoredUser(username) {
    const userInData = await searchInData("../data/users.json", "username", username)
    if (userInData) {
        console.log(`username ${username} found`);
        return userInData
    }
    return false
}