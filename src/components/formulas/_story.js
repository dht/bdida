import React from "react";

import { Formulas } from "./Formulas";

let data = {};

export default (storiesOf, mod, action) => {
    storiesOf("Formulas", mod)
        .add("Basic", () => <Formulas />);
};
