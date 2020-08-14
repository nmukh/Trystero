//Node and Library imports
import * as path from "path";
const Datastore = require("nedb");

//Interface for describing a Contact
export interface IContact {
    _id?: number,
    name: string,
    email: string
  }
