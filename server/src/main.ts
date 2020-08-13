//Node imports
import path from "path";

//Library imports
import express, { Express, NextFunction, Request, Response } from "express";

//App imports
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";

// Express app.
const app: Express = express();


// Handle JSON in request.
app.use(express.json());


// Serve client.
app.use("/", express.static(path.join(__dirname, "../../client/dist")));


// Enable CORS to call API from anywhere.
app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
  inResponse.header("Access-Control-Allow-Origin", "*");
  inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  inNext();
});


//REST endpoints

// Get list of mailboxes.
app.get("/mailboxes",
  async (inRequest: Request, inResponse: Response) => {
    console.log("GET /mailboxes (1)");
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
      console.log("GET /mailboxes (1): Ok", mailboxes);
      inResponse.json(mailboxes);
    } catch (inError) {
      console.log("GET /mailboxes (1): Error", inError);
      inResponse.send("error");
    }
  }
);

//List messages of mailbox
app.get("/mailboxes/:mailbox",
  async (inRequest: Request, inResponse: Response) => {
    console.log("GET /mailboxes (2)", inRequest.params.mailbox);
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const messages: IMAP.IMessage[] = await imapWorker.listMessages({
        mailbox : inRequest.params.mailbox
      });
      console.log("GET /mailboxes (2): Ok", messages);
      inResponse.json(messages);
    } catch (inError) {
      console.log("GET /mailboxes (2): Error", inError);
      inResponse.send("error");
    }
  }
);

//Get a message
app.get("/messages/:mailbox/:id",
  async (inRequest: Request, inResponse: Response) => {
    console.log("GET /messages (3)", inRequest.params.mailbox, inRequest.params.id);
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const messageBody: string = await imapWorker.getMessageBody({
        mailbox : inRequest.params.mailbox,
        id : parseInt(inRequest.params.id, 10)
      });
      console.log("GET /messages (3): Ok", messageBody);
      inResponse.send(messageBody);
    } catch (inError) {
      console.log("GET /messages (3): Error", inError);
      inResponse.send("error");
    }
  }
);

// Delete a message.
app.delete("/messages/:mailbox/:id",
  async (inRequest: Request, inResponse: Response) => {
    console.log("DELETE /messages");
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      await imapWorker.deleteMessage({
        mailbox : inRequest.params.mailbox,
        id : parseInt(inRequest.params.id, 10)
      });
      console.log("DELETE /messages: Ok");
      inResponse.send("ok");
    } catch (inError) {
      console.log("DELETE /messages: Error", inError);
      inResponse.send("error");
    }
  }
);

