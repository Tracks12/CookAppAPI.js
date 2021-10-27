/**
 * Project : CookAppAPI
 * Name    : index.js
 * Date    : 27/10/2021
 * Autor   : CARDINAL Florian
 */

// Modules importations
import express from "express";
import cors from "cors";
import { MongoClient, ObjectID } from "mongodb";

// MongoDB remote connection
import { dbURL, dbName, port } from './constants.js';
let db;

MongoClient.connect(dbURL, (err, client) => {
	console.log("[i] - MongoDB remote successfully connected !");
	db = client.db(dbName);
});

// App & Receipes instances
const app = express();
const receipes = express();

receipes
	.on("mount", () => console.log("[i] - Receipes CRUD correctly mounted !"))
	.get("/", async (req, res) => {
		let data = await db.collection("receipes").find().toArray();
		res.status(200).json(data);
	})
	.get("/:id", async (req, res) => {
		let data = await db.collection("receipes").findOne({ _id: new ObjectID(req.params.id) });
		res.status(200).json(data);
	})
	.post("/", async (req, res) => {
		await db.collection("receipes").insertOne(req.body);
		res.status(200).json({ success: true });
	})
	.put("/:id", async (req, res) => {
		let {_id, ...body} = req.body;
		await db.collection("receipes").updateOne({ _id: new ObjectID(req.params.id) }, { $set: body });
		res.status(200).json({ success: true });
	})
	.delete("/:id", async (req, res) => {
		await db.collection("receipes").deleteOne({ _id: new ObjectID(req.params.id) });
		res.status(200).json({ success: true });
	});

app
	.use(cors())
	.use(express.json())
	.get("/status", (req, res) => res.json({ success: true }))
	.use("/receipes", receipes);

app.listen(port, () => console.log(`[i] - Server is listening on 127.0.0.1:${port}`));

/**
 * END
 */
