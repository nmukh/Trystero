import "normalize.css";
import "../css/main.css";

import React from "react";
import ReactDOM from "react-dom";

import BaseLayout from "./components/BaseLayout";
import * as IMAP from "./IMAP";
import * as Contacts from "./Contacts";

//Render UI
const baseComponent = ReactDOM.render(<BaseLayout />, document.body);

//Fetch mailbox and contacts
baseComponent.state.showHidePleaseWait(true);

