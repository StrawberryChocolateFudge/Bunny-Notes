//@ts-ignore
import { snarkjs } from "snarkjs";

import crypto from "crypto";
//@ts-ignore
import circomlib from "circomlib";

async function main() { console.log(snarkjs) }


main().catch(err => {
    console.error(err);
    process.exitCode = 1;
})