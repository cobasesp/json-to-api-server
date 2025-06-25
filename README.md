# JSON to API server

A npm module to build an entire RESTful API from a single JSON file — for development purposes only.

[See changelog here](CHANGELOG.md?plain=0)

## 🚀 Installation

```bash
npm install json-to-api-server --save-dev
```

## 🛠 Usage

### Basic usage

In your project folder, create an `api.json` file with your API structure. This JSON must have an `endpoints` child on it's root, and add inside a list of endpoints (routes) with list of objects that will be the routes and data of that routes

Example `api.json`:
```json
{
    "endpoints": [
      {
          "users": [
            { "id": 1, "name": "Alice" },
            { "id": 2, "name": "Bob" }
          ]
      }
    ]
}
```

Then run:
```bash
json-server
```
By default, it will look for `api.json` in the current directory.

### Custom JSON file

You can specify a custom JSON file:
```bash
json-server ./my-api.json
```

---

## 📦 Features

- Zero-config REST API from a JSON file
- Supports GET, POST (create/update), DELETE
- Hot-reloads data on each request
- Perfect for prototyping and mocking APIs

---

## 📝 API Endpoints

For each endpoint in your JSON, the following routes are created:

- `GET    /<resource>`        — List all items
- `GET    /<resource>/:id`    — Get item by ID
- `POST   /<resource>`        — Create new item
- `POST   /<resource>/:id`    — Update item by ID
- `DELETE /<resource>/:id`    — Delete item by ID

---

## ⚠️ Disclaimer

This tool is intended for development and prototyping only. **Do not use in production.**

---

## 📄 License

ISC

---
