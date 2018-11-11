import React from "react";

import { Tag } from "./Tag";

let data = {};

export default (storiesOf, mod, action) => {
    storiesOf("Tag", mod)
        .add("Basic", () => <Tag />);
};
