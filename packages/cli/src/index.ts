#!/usr/bin/env node

import { program } from "commander";
import { serveCommand } from "./commands/serve";
import { version } from "../package.json";

program.addCommand(serveCommand).version(version);

program.parse(process.argv);
