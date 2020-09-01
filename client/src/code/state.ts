import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";


export function createState(inParentComponent) {

    return {
        waitVisible : false

    }
};