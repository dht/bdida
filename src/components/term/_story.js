import React from "react";

import { Term } from "./Term";

let data = {};

export default (storiesOf, mod, action) => {
    storiesOf("Term", mod)
        .add("Basic", () => <Term />);
};
