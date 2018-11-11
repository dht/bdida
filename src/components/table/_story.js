import React from "react";

import { Table } from "./Table";

let data = {};

export default (storiesOf, mod, action) => {
    storiesOf("Table", mod)
        .add("Basic", () => <Table />);
};
