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
