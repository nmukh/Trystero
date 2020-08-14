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
}
