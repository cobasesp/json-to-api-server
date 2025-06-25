import express from 'express';
import JsonManager from './JsonManager';
import fs from 'fs';
import path from 'path';

// Obtiene el argumento de la línea de comandos o usa 'api.json' en el cwd
const jsonFile = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), 'api.json');

if (!fs.existsSync(jsonFile)) {
  console.error(`JSON file not found: ${jsonFile}`);
  process.exit(1);
}

// Carga el JSON
const apiConfig = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

const app = express();
const PORT = 3000;

app.use(express.json());

// Cambia aquí: pasa jsonFile al constructor
const jsonManager = new JsonManager(jsonFile);

setTimeout(() => {
    let apiData = jsonManager.getData();
    console.log(apiData.endpoints);

    apiData.endpoints.forEach((endpoint) => {
        const key = Object.keys(endpoint)[0];
        console.log(`\nCREATING ROUTES FOR --> ${key}`);

        // GET ALL
        console.log(`GET '/${key}'`);
        app.get(`/${key}`, (_req, res) => {
            res.json(endpoint);
        });

        // GET BY ID
        console.log(`GET '/${key}/:id'`);
        app.get(`/${key}/:id`, (req, res) => {
            const id = parseInt(req.params.id, 10);
            const items = endpoint[key];
            const item = items.find((el: any) => el.id === id);
            if (item) {
                res.json(item);
            } else {
                res.status(404).json({ error: 'Not found' });
            }
        });

        // POST NEW ITEM
        console.log(`POST '/${key}'`);
        app.post(`/${key}`, (req, res) => {
            const items = endpoint[key];
            const newItem = req.body;
            const lastId = items.length > 0 ? Math.max(...items.map((el: any) => el.id)) : 0;

            newItem.id = lastId + 1;
            items.push(newItem);
            jsonManager.setData(apiData)
            res.status(200).json(newItem);
        });

        // POST UPDATE ITEM
        console.log(`POST '/${key}/:id'`);
        app.post(`/${key}/:id`, (req, res) => {
            const id = parseInt(req.params.id, 10);
            const items = endpoint[key];
            const index = items.findIndex((el: any) => el.id === id);

            if (index === -1) {
                res.status(404).json({ error: 'Not found' });
            }

            const newItem = req.body;

            items[index] = { ...items[index], ...req.body, id };
            jsonManager.setData(apiData)
            res.status(200).json(items[index]);
        });

         // DELETE ITEM
        console.log(`DELETE '/${key}/:id'`);
        app.delete(`/${key}/:id`, (req, res) => {
            const id = parseInt(req.params.id, 10);
            const items = endpoint[key];
            const index = items.findIndex((el: any) => el.id === id);

            if (index === -1) {
                res.status(404).json({ error: 'Not found' });
            }

            const deletedItem = items.splice(index, 1)[0];
            jsonManager.setData(apiData)
            res.status(200).json(deletedItem);
        });
    });

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    })
}, 1000);
