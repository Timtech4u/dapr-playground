const express = require("express");

// Dapr SDK
// > npm install dapr-client
const { DaprClient, CommunicationProtocolEnum } = require("dapr-client");

const app = express();
const port = 3000;

// // Our Order service only interacts with Dapr sidecar running in local.
// const daprHost = "127.0.0.1";

const daprHost = "http://34.83.117.202"; // Dapr Sidecar Host, could also be https://example.com
const daprPort = "3500";

// Create a new Dapr client
const client = new DaprClient(
  daprHost,
  // // The HTTP port that the Dapr sidecar is listening on.
  // // We should use this env var to connect to Dapr sidecar
  // process.env.DAPR_HTTP_PORT,
  daprPort,
  CommunicationProtocolEnum.HTTP
);

// Name of the state store component, defined in Redis.yaml file.
const STATE_STORE_NAME = "redis-store";

app.use(express.json());

app.post("/orders", async (req, res) => {
  const order = req.body;

  // We can use this Dapr client to store data into database.
  const response = await client.state.save(STATE_STORE_NAME, [
    {
      key: new Date().getTime().toString(), // Generate a unique key.
      value: order,
    },
  ]);

  res.json(response);
});

app.listen(port, () => console.log(`server listens on port ${port}`));
