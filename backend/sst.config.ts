/// <reference path="./.sst/platform/config.d.ts" />

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

        api.route("POST /create", {
            handler: "create.handler",
            link: [linkTable, api],
        });

        api.route("GET /{id}", {
            handler: "redirect.handler",
            link: [linkTable],
        })

        return {
            api: api.url,
            linkTable: linkTable.name,
            //userTable: userTable.name,
        }
    },
});
