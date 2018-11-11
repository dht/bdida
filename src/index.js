import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

ReactDOM.render(
    <Router>
        <div id="router">
            <Route exact path="/" component={App} />
            <Route exact path="/:permutationId" component={App} />
        </div>
    </Router>,
    document.getElementById("root")
);
serviceWorker.unregister();
