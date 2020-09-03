import axios, { AxiosResponse } from "axios";
import { config } from "./config";

//interface describing contact. _id is optional
export interface IContact {
_id?: number, name: string, email: string
}

