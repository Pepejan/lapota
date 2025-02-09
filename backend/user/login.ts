import { log } from "console";
import { Resource } from "sst";
import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { verify } from "utils/password";
import { SECRETS } from "utils/consts";

const { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = process.env;
const ACCESS_TOKEN_SECRET = Resource.AccessTokenSecret.value;
const REFRESH_TOKEN_SECRET = Resource.RefreshTokenSecret.value;

const client = new DynamoDBClient();

export async function handler(event: APIGatewayProxyEventV2) {
    log(event);
    // todo: middleware lib, verification and sanatization, parsing, etc.
    const { email, password } = JSON.parse(event.body);

    const { Items: items } = await client.send(
        new ScanCommand({
            TableName: Resource.UserTable.name,
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ":email": marshall(email),
            }
        })
    );

    const item = unmarshall(items[0]);

    console.log(ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY);

    //const accessToken = ;

    if (verify(item.passwordHash, password)) {
        throw new Error("Invalid credentials");
    }

    if (!item) {
        throw new Error("Failed to create user");
    }

    return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(item)),
    };
}


