import axios, { AxiosResponse } from "axios";
import { config } from "./config";


export interface IMailbox { name: string, path: string }


//  interface to describe a received message.  body is optional since it isn't sent when listing
// messages.
export interface IMessage {
  id: string,
  date: string,
  from: string,
  subject: string,
  body?: string
}
