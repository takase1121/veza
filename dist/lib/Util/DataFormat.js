"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v8 = require("v8");
function serialize(data) {
    return v8.serialize(data);
}
exports.serialize = serialize;
function deserialize(data) {
    return v8.deserialize(data.slice(11));
}
exports.deserialize = deserialize;
//# sourceMappingURL=DataFormat.js.map