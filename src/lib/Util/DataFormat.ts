import * as v8 from 'v8';

function serialize(data: any): Buffer {
	return v8.serialize(data);
}

function deserialize(data: any): any {
	return v8.deserialize(data.slice(11));
}

export { serialize, deserialize };
