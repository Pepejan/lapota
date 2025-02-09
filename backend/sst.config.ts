/// <reference path="./.sst/platform/config.d.ts" />
import { HandlerBuilder } from "utils/handlerBuilder";
import { SECRETS, VARIABLE_NAMES } from "utils/consts";

const user = HandlerBuilder("user");
const link = HandlerBuilder("link");


export default $config({
    app(input) {
        return {
            name: "shortie",
            removal: input?.stage === "production" ? "retain" : "remove",
            protect: ["production"].includes(input?.stage),
            home: "aws",
        };
    },
    async run() {
        const secrets = Object.fromEntries(Object.values(SECRETS).map(value => [value, new sst.Secret(value, value)]));
        const variables = Object.fromEntries(VARIABLE_NAMES.map(value => [value, process.env[value]]));

        console.log(variables);

        const linkTable = new sst.aws.Dynamo("LinkTable", {
            fields: {
                id: "string",
            },
            primaryIndex: { hashKey: "id" },
        });

        const userTable = new sst.aws.Dynamo("UserTable", {
            fields: {
                id: "string",
            },
            primaryIndex: { hashKey: "id" },
        });

        const atTable = new sst.aws.Dynamo("AccessTokenTable", {
            fields: {
                id: "string",
            },
            primaryIndex: { hashKey: "id" },
        });

        //// refresh token for real swag
        //const rtTable = new sst.aws.Dynamo("RefreshTokenTable", {
        //    fields: {
        //        id: "string",
        //    },
        //    primaryIndex: { hashKey: "id" },
        //});

        const api = new sst.aws.ApiGatewayV2("Api");

        api.route("GET /health", "health.handler");

        api.route("GET /me", {
            handler: user("me"),
            link: [userTable, atTable],
            nodejs: {
                install: ["argon2"],
            }
        });

        api.route("POST /register", {
            handler: user("register"),
            link: [userTable, atTable],
            nodejs: {
                install: ["argon2"],
            }
        });

        api.route("POST /login", {
            handler: user("login"),
            link: [userTable, atTable, secrets[SECRETS.ACCESS_TOKEN_SECRET], secrets[SECRETS.REFRESH_TOKEN_SECRET]],
            environment: {
                ...variables,
            },
            nodejs: {
                install: ["argon2"],
            }
        });

        api.route("POST /create", {
            handler: link("create"),
            link: [linkTable, api],
        });

        api.route("GET /list", {
            handler: link("list"),
            link: [linkTable, api],
        });

        api.route("GET /{id}", {
            handler: link("redirect"),
            link: [linkTable],
        });

        return {
            api: api.url,
        }
    },
});
