// Modules importations
import express from "express";
import cors from "cors";
import { readFile, writeFile } from 'fs/promises';
import { nanoid } from "nanoid";

// Load data files
const dataPath = './database/receipes.json';
const data = JSON.parse(await readFile(new URL(dataPath, import.meta.url)));

// Json persistance
function updateStorage() {
	writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// App instance
const app = express();
const receipes = express();

receipes
	.on("mount", () => {
		console.log("[i] - Receipes CRUD correctly mounted !")
	})
	.get("/", (req, res) => res.json(data))
	.get("/:id", (req, res) => res.json(data.find((obj) => obj._id === req.params.id)))
	.post("/", (req, res) => {
		req.body["_id"] = nanoid();
		data.push(req.body);

		updateStorage();
		res.json({ success: true });
	})
	.put("/:id", (req, res) => {
		let index = data.map(x => x._id).indexOf(req.params.id);
		data[index] = req.body;

		updateStorage();
		res.json({ success: true });
	})
	.delete("/:id", (req, res) => {
		let index = data.map(x => x._id).indexOf(req.params.id);
		data.splice(index, 1);

		updateStorage();
		res.json({ success: true });
	});

app
	.use(cors())
	.use(express.json())
	.get("/status", (req, res) => res.json({ success: true }))
	.use("/receipes", receipes);

app.listen(5000, () => console.log("[i] - Server is listening on 127.0.0.1:5000"));
