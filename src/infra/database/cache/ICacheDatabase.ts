export interface ICacheInput {
	key: string;
	value: string;
}

export interface ICacheDatabase {
	set(input: ICacheInput): Promise<string>;

	get(key: string): Promise<unknown>;
}
