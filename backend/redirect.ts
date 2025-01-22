import { log } from "console";
import { Resource } from "sst";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const client = new DynamoDBClient();

export async function handler(event: APIGatewayProxyEventV2) {
    const id = event.rawPath.substring(1);
    console.log(id);

    if (!id) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid ID" }) };
    }
    const { Item: item } = await client.send(
        new GetItemCommand({
            TableName: Resource.LinkTable.name,
            Key: { id: { S: id } },
        })
    );
    if (!item) {
        return { statusCode: 404, body: JSON.stringify({ error: "Link not found" }) };
    }
    log(event);
    log(item);
    return {
        statusCode: 302,
        headers: { Location: item.link.S },
        body: "",
    };
}

