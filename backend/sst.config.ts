/// <reference path="./.sst/platform/config.d.ts" />
import { HandlerBuilder } from "./utils/handlerBuilder";
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
        const linkTable = new sst.aws.Dynamo("LinkTable", {
            fields: {
                id: "string",
            },
            primaryIndex: { hashKey: "id" },
        });

        const api = new sst.aws.ApiGatewayV2("Api");

        api.route("GET /health", "health.handler");

        api.route(`GET /me`, user("me"))

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
            linkTable: linkTable.name,
            //userTable: userTable.name,
        }
    },
});
