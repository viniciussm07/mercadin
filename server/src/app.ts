import express, { type Express } from "express";

export const app: Express = express();
import swaggerUi from "swagger-ui-express";

app.use(express.json());

const swaggerDocs = {
    openapi: "3.0.0",
    info: {
        title: "Mercadin",
        version: "1.0.0",
        description: "",
    },
    tags: [
        {
            name: "Teste",
            description: "Rotas de verificação do sistema",
        },
    ],
    paths: {
        "/": {
            get: {
                tags: ["Teste"],
                summary: "Rota de teste",
                responses: {
                    200: {
                        description: "Retorna o famoso Hello World",
                    },
                },
            },
        },
    },
};
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/", (request, response) => {
    return response.send("Hello World");
});
