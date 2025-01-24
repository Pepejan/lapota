import { log } from "console";
import { Resource } from "sst";
import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import crypto from "crypto";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const MAX_REPEAT_COUNT = 5;
const DEFAULT_TOKEN_LENGTH = 8;

const client = new DynamoDBClient();

function generateBase64Token(length: number): string {
    const l = Math.ceil(length * 3 / 4);

    const randomBytes = crypto.randomBytes(l);

    return randomBytes.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "").substring(0, length);
}

async function getUnusedId(repeatCount = 0): Promise<string> {
    if (repeatCount >= MAX_REPEAT_COUNT) {
        throw new Error("Unable to find an unused ID");
    }

    const id = generateBase64Token(DEFAULT_TOKEN_LENGTH);

    const { Item } = await client.send(
        new GetItemCommand({
            TableName: Resource.LinkTable.name,
            Key: { id: { S: id } },
        })
    );

    if (Item) {
        return await getUnusedId(repeatCount + 1);
    }

    return id;
}

export async function handler(event: APIGatewayProxyEventV2) {
    log(event);
    const { url } = JSON.parse(event.body);

    const id = await getUnusedId();
    await client.send(
        new PutItemCommand({
            TableName: Resource.LinkTable.name,
            Item: marshall({
                id,
                link: url,
            }),
        })
    )

    let { Item: item } = await client.send(
        new GetItemCommand({
            TableName: Resource.LinkTable.name,
            Key: marshall({
                id
            }),
        })
    );

    if (!item) {
        throw new Error("Failed to create link");
    }

    item = unmarshall(item);
    item.short = `${Resource.Api.url}/${id}`;

    return {
        statusCode: 200,
        body: JSON.stringify(item),
    };
}

