//@ts-ignore
import { utils } from "ffjavascript";
import crypto from "crypto";

export function rbigint(): bigint { return utils.leBuff2int(crypto.randomBytes(31)) };

