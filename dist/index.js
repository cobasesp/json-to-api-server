#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_express = __toESM(require("express"));

// src/JsonManager.ts
var import_promises = require("fs/promises");
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
    const content = await (0, import_promises.readFile)(this.jsonPath, "utf-8");
    return JSON.parse(content);
  }
  getData() {
    return this.apiData;
  }
  async setData(data) {
    this.apiData = data;
    await (0, import_promises.writeFile)(this.jsonPath, JSON.stringify(this.apiData, null, 2), "utf-8");
  }
};

// src/index.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var jsonFile = process.argv[2] ? import_path.default.resolve(process.cwd(), process.argv[2]) : import_path.default.resolve(process.cwd(), "api.json");
if (!import_fs.default.existsSync(jsonFile)) {
  console.error(`No se encontr\xF3 el archivo JSON: ${jsonFile}`);
  process.exit(1);
}
var apiConfig = JSON.parse(import_fs.default.readFileSync(jsonFile, "utf-8"));
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
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
