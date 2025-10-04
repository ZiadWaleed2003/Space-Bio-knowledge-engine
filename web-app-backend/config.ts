/* eslint-disable n/no-process-env */

import path from "path";
import dotenv from "dotenv";
import moduleAlias from "module-alias";

// Check the env
const NODE_ENV = process.env.NODE_ENV ?? "development";

// Configure moduleAlias
if (__filename.endsWith("js")) {
    moduleAlias.addAlias("@src", __dirname + "/dist");
}
