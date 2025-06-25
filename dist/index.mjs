#!/usr/bin/env node

// src/index.ts
import express from "express";

// src/JsonManager.ts
import { readFile, writeFile } from "fs/promises";
var JsonManager = class {
  apiData = [];
  jsonPath;
  constructor(jsonPath) {
    this.jsonPath = jsonPath;
    (async () => {
      this.apiData = await this.readDbJson();
    })();
  }
  async readDbJson() {
    const content = await readFile(this.jsonPath, "utf-8");
    return JSON.parse(content);
  }
  getData() {
    return this.apiData;
  }
  async setData(data) {
    this.apiData = data;
    await writeFile(this.jsonPath, JSON.stringify(this.apiData, null, 2), "utf-8");
  }
};

// src/index.ts
import fs from "fs";
import path from "path";
var jsonFile = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.resolve(process.cwd(), "api.json");
if (!fs.existsSync(jsonFile)) {
  console.error(`No se encontr\xF3 el archivo JSON: ${jsonFile}`);
  process.exit(1);
}
var apiConfig = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
var app = express();
var PORT = 3e3;
app.use(express.json());
var jsonManager = new JsonManager(jsonFile);
setTimeout(() => {
  let apiData = jsonManager.getData();
  console.log(apiData.endpoints);
  apiData.endpoints.forEach((endpoint) => {
    const key = Object.keys(endpoint)[0];
    console.log(`
CREANDO RUTAS PARA --> ${key}`);
    console.log(`GET '/${key}'`);
    app.get(`/${key}`, (_req, res) => {
      res.json(endpoint);
    });
    console.log(`GET '/${key}/:id'`);
    app.get(`/${key}/:id`, (req, res) => {
      const id = parseInt(req.params.id, 10);
      const items = endpoint[key];
      const item = items.find((el) => el.id === id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: "No encontrado" });
      }
    });
    console.log(`POST '/${key}'`);
    app.post(`/${key}`, (req, res) => {
      const items = endpoint[key];
      const newItem = req.body;
      const lastId = items.length > 0 ? Math.max(...items.map((el) => el.id)) : 0;
      newItem.id = lastId + 1;
      items.push(newItem);
      jsonManager.setData(apiData);
      res.status(200).json(newItem);
    });
    console.log(`POST '/${key}/:id'`);
    app.post(`/${key}/:id`, (req, res) => {
      const id = parseInt(req.params.id, 10);
      const items = endpoint[key];
      const index = items.findIndex((el) => el.id === id);
      if (index === -1) {
        res.status(404).json({ error: "No encontrado" });
      }
      const newItem = req.body;
      items[index] = { ...items[index], ...req.body, id };
      jsonManager.setData(apiData);
      res.status(200).json(items[index]);
    });
    console.log(`DELETE '/${key}/:id'`);
    app.delete(`/${key}/:id`, (req, res) => {
      const id = parseInt(req.params.id, 10);
      const items = endpoint[key];
      const index = items.findIndex((el) => el.id === id);
      if (index === -1) {
        res.status(404).json({ error: "No encontrado" });
      }
      const deletedItem = items.splice(index, 1)[0];
      jsonManager.setData(apiData);
      res.status(200).json(deletedItem);
    });
  });
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}, 1e3);
