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

