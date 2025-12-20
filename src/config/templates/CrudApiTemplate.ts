import { ApiTemplateType } from "../../Schema/ApiSchema";

export const CrudApiTemplate: ApiTemplateType = {
    name: "crud-api-template",
    template: [
        {
            method: "GET",
            endpoint: "/",
            action: "find",
            RequestBodyFromCollection: true,
            routeActions: [
                {
                    action:"find",
                }
            ]
        },
        {
            method: "GET",
            endpoint: "/{id}",
            action: "get item by id",
            RequestBodyFromCollection: true,
            routeActions: [
                {
                    action:"findOne",
                    filterBy: [
                        {
                            field: "id",
                            type: "string",
                            required: true
                        }
                    ]
                }
            ]
        },
        {
            method: "POST",
            endpoint: "/",
            action: "get item by id",
            RequestBodyFromCollection: true,
            routeActions: [
                {
                    action:"insertOne",
                }
            ]
        },
        {
            method: "PUT",
            endpoint: "/",
            action: "updateOne",
            RequestBodyFromCollection: true,
            routeActions: [
                {
                    action:"updateOne",
                    filterBy: [
                        {
                            field: "id",
                            type: "string",
                            required: true
                        }
                    ]
                }
            ]
        }
    ]
}