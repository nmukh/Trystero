//Imports
import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";

import { IServerInfo } from "./ServerInfo";

//Worker class for SMTP 

export class Worker {
    private static serverInfo: IServerInfo;
    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }

    //method takes in object that adheres to SendMailOptions interface
    public sendMessage(inOptions: SendMailOptions):
    //wrap calls to nodemailer in Promise object, but promise to return string eventually. 
        Promise<string> {
        return new Promise((inResolve, inReject) => {
            //transport is passed server information
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);
            //inOptions contains message details passed in from client.
            transport.sendMail(inOptions,
                //union type for inError to prevent compilation error
                (inError: Error | null, inInfo: SentMessageInfo) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve();
                    }
                }
            );
        });
    }
}


