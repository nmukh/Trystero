import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";


export function createState(inParentComponent) {

    return {
        waitVisible: false,
        contacts: [],

        mailboxes: [],

        messages: [],

        // The view that is currently showing ("welcome", "message", "compose", "contact" or "contactAdd").
        currentView: "welcome",

        currentMailbox: null,

        // The details of the message currently being viewed or composed 
        messageID: null,
        messageDate: null,
        messageFrom: null,
        messageTo: null,
        messageSubject: null,
        messageBody: null,

        // The details of the contact currently being viewed or added
        contactID: null,
        contactName: null,
        contactEmail: null

    }
};