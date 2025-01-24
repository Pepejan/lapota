import { log } from "console";
import { Resource } from "sst";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient();

export async function handler() {
    const result = await client.send(
        new ScanCommand({
            TableName: Resource.LinkTable.name,
        })
    );
    log(result);
    //if (!item) {
    //    return { statusCode: 404, body: JSON.stringify({ error: "Link not found" }) };
    //}
    //log(event);
    //log(item);
    return {
        statusCode: 302,
        body: JSON.stringify({
            count: result.Count,
            items: result.Items.map(item => ({ ...unmarshall(item), short: `${Resource.Api.url}/${item.id.S}` })),
            //jk: unmarshall(result.Items),
        }),
    };
}

