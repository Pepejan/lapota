import { hash as ahash, verify as averify } from "argon2";

export async function hash(password: string): Promise<string> {
    return ahash(password);
}

export async function verify(hash: string, password: string): Promise<boolean> {
    return averify(hash, password);
}
