import { ApiRespData } from "./src/models/api.model";
import { GameApiService } from "./src/services/api/game.api.service";
import { PrismaDatabaseService } from "./src/services/prisma.database.service";
import { removeEmptyKeys } from "./src/utils/util";

const express = require('express')
const app = express()

app.use(express.json());

const gameSvc = new GameApiService(new PrismaDatabaseService());

async function sendResult(res: any, data: ApiRespData) {
  res.status(data.statusCode);
  let respData = data.failureText ? data.failureText : data.successText;
  res.send(await removeEmptyKeys(respData));
}

app.post('/game', async (req, res) => {
  sendResult(res, await gameSvc.add(req.body));
})

app.get('/game', async (req, res) => {
  sendResult(res, await gameSvc.get(req.query.name));
})

app.delete('/game', async (req, res) => {
  sendResult(res, await gameSvc.del(req.query.name));
})

app.listen(3000, () => {
  console.log("Server listening on", 3000);
})