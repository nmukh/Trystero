//Imports
const ImapClient = require("emailjs-imap-client");
import { ParsedMail } from "mailparser";
import { simpleParser } from "mailparser";
import { IServerInfo } from "./ServerInfo";


//Interface describing mailbox
export interface ICallOptions {
    mailbox: string,
    id?: number
}

//Interface describing received message
export interface IMessage {
    id: string, date: string,
    from: string,
    subject: string, body?: string
}

//Interface describing mailbox
export interface IMailbox {
    name: string,
    path: string
}

// Disable certificate validation, necessary for making IMAP server calls 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//Define worker class
export class Worker {
    private static serverInfo: IServerInfo;
    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }
    //Creates emailjs-imap-client object and connects it to server
    private async connectToServer(): Promise<any> {
        //Create client with and host and port and user/password from serverInfo
        const client: any = new ImapClient.default(
            Worker.serverInfo.imap.host,
            Worker.serverInfo.imap.port,
            { auth: Worker.serverInfo.imap.auth }
        );
        //reduce logging information noise
        client.logLevel = client.LOG_LEVEL_NONE;
        //error handler
        client.onerror = (inError: Error) => {
            console.log(
                "IMAP.Worker.listMailboxes(): Connection error",
                inError
            );
        };
        await client.connect();
        //client returned to caller
        return client;
    }
    // Return a list of mailboxes
    public async listMailboxes(): Promise<IMailbox[]> {

        const client: any = await this.connectToServer();

        const mailboxes: any = await client.listMailboxes();

        await client.close();

        // Translate from emailjs-imap-client mailbox objects to app-specific objects.  At the same time, flatten the list
        // of mailboxes via recursion.
        const finalMailboxes: IMailbox[] = [];
        const iterateChildren: Function = (inArray: any[]): void => {
            inArray.forEach((inValue: any) => {
                finalMailboxes.push({
                    name: inValue.name,
                    path: inValue.path
                });
                iterateChildren(inValue.children);
            });
        };
        iterateChildren(mailboxes.children);

        return finalMailboxes;
    }
    //List information about messages in a named mailbox
    public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {

        const client: any = await this.connectToServer();

        // Select the mailbox first.  This gives us the message count.
        const mailbox: any = await client.selectMailbox(inCallOptions.mailbox);
        console.log(`IMAP.Worker.listMessages(): Message count = ${mailbox.exists}`);

        // If there are no messages, return an empty array.
        if (mailbox.exists === 0) {
            await client.close();
            return [];
        }

        // Messages exist, get them.  They are returned in order by uid, so FIFO.
        //1:* is a query for paging mechanism, where * is all.
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            "1:*",
            ["uid", "envelope"]
        );

        await client.close();

        // Translate from emailjs-imap-client message objects to app-specific objects.
        const finalMessages: IMessage[] = [];
        messages.forEach((inValue: any) => {
            finalMessages.push({
                id: inValue.uid,
                date: inValue.envelope.date,
                from: inValue.envelope.from[0].address,
                subject: inValue.envelope.subject
            });
        });

        return finalMessages;
    }
    //Get plain-text body of single message
    public async getMessageBody(inCallOptions: ICallOptions):
        Promise<string> {
        const client: any = await this.connectToServer();
        //Because body can be multiple parts, request an array. Specify specific message ID in the call
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox, inCallOptions.id,
            ["body[]"], { byUid: true }
        );
        const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);
        await client.close();
        return parsed.text!;
    }
    //Delete a message
    public async deleteMessage(inCallOptions: ICallOptions):
        Promise<any> {
        const client: any = await this.connectToServer();
        //Pass mailbox name and unique ID of message to delete
        await client.deleteMessages(
            inCallOptions.mailbox, inCallOptions.id, { byUid: true }
        );
        await client.close();
    }


}
