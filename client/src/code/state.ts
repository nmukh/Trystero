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


        showHidePleaseWait: function (inVisible: boolean): void {
            this.setState({ pleaseWaitVisible: inVisible });
        }.bind(inParentComponent)

        addMailboxToList: function (inMailbox: IMAP.IMailbox): void {
            //copy list
            const cl: IMAP.IMailbox[] = this.state.mailboxes.slice(0);
            //add new element
            cl.push(inMailbox);
            // update list in state
            this.setState({ mailboxes: cl });
        }.bind(inParentComponent)

        addContactToList : function(inContact: Contacts.IContact): void {
            const cl = this.state.contacts.slice(0);
            cl.push({ _id : inContact._id,
            name : inContact.name, email : inContact.email });
            this.setState({ contacts : cl });
            }.bind(inParentComponent)
            


    }
};