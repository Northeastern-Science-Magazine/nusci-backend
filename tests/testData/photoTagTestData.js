import PhotoTag from "../../app/models/dbModels/photoTag";
import Accounts from "../../app/models/enums/accounts.js";
import AccountStatus from "../../app/models/enums/accountStatus.js";
//import validUsernameQueryRaisa from "../../userTestData.js"

export const validTag = {
    tagName: "Issue1",
    color: "red", 
    creatingUser: "raisa",
    creationTime: "2024-02-27T00:00:00.000Z",
    ModicationTime: "2024-03-27T00:00:00.000Z",
}

export const validTag2 = {
    tagName: "Issue2",
    color: "blue", 
    creatingUser: "raisa",
    creationTime: "2024-02-27T00:00:00.000Z",
    ModicationTime: "2024-03-27T00:00:00.000Z",
}

export const existingTag = {
    tagName: "Issue1",
    color: "red", 
    creatingUser: "raisa",
    creationTime: "2024-03-27T00:00:00.000Z",
    ModicationTime: "2024-04-27T00:00:00.000Z",
};
