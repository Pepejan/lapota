import { log } from "console";
import { Resource } from "sst";
import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import crypto from "crypto";

const DEFAULT_TOKEN_LENGTH = 8;

const client = new DynamoDBClient();

function generateBase64Token(length: number): string {
    const l = Math.ceil(length * 3 / 4);

    const randomBytes = crypto.randomBytes(l);

    return randomBytes.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "").substring(0, length);
}

async function getUnusedId(): Promise<string> {
    const id = generateBase64Token(DEFAULT_TOKEN_LENGTH);

    const { Item } = await client.send(
        new GetItemCommand({
            TableName: Resource.LinkTable.name,
            Key: { id: { S: id } },
        })
    );

    // potential loop
    if (Item) {
        return await getUnusedId();
    }

    return id;
}

export async function handler(event: any) {
    const item = await client.send(
        new PutItemCommand({
            TableName: Resource.LinkTable.name,
            Item: {
                id: { S: await getUnusedId() },
                link: { S: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
            },
        })
    )

    log(event);
    return {
        statusCode: 200,
        body: JSON.stringify(item),
    };
}

