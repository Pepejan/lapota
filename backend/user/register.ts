import { log } from "console";
import { Resource } from "sst";
import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { hash } from "utils/password";

const client = new DynamoDBClient();

export async function handler(event: APIGatewayProxyEventV2) {
    const id = randomUUID();

    log(event);
    // todo: middleware lib, verification and sanatization, parsing, etc.
    const { email, password } = JSON.parse(event.body);

    const passwordHash = await hash(password);

    await client.send(
        new PutItemCommand({
            TableName: Resource.UserTable.name,
            Item: marshall({
                id,
                email,
                passwordHash,
            }),
        })
    )

    const { Item: item } = await client.send(
        new GetItemCommand({
            TableName: Resource.UserTable.name,
            Key: marshall({
                id
            }),
        })
    );

    if (!item) {
        throw new Error("Failed to create user");
    }

    return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(item)),
    };
}

