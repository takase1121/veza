/// <reference types="node" />
declare function serialize(data: any): Buffer;
declare function deserialize(data: any): any;
export { serialize, deserialize };
