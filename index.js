/**
 * Project : CookAppAPI
 * Name    : index.js
 * Date    : 27/10/2021
 * Autor   : CARDINAL Florian
 */

// Import Modules
import express from "express";
import cors from "cors";
import { MongoClient, ObjectID } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Import Constants & Utils
import { DB_URL, DB_NAME, EXPRESS_IP, EXPRESS_PORT, TOKEN_SECRET } from './common/constants.js';
import { checkToken } from "./common/utils.js";

// MongoDB remote connection
let db;

MongoClient.connect(DB_URL, (err, client) => {
	console.log("[i] - MongoDB remote successfully connected !");
	db = client.db(DB_NAME);
});

// App & Receipes instances
const app = express();
const receipes = express();

receipes
	.on("mount", () => console.log("[^] - Receipes CRUD correctly mounted !"))
	.get("/all", checkToken, async (req, res) => {
		if(jwt.verify(req.headers.authorization, TOKEN_SECRET).isAdmin) {
			let data = await db.collection("receipes").find().toArray();
			return res.status(200).json(data);
		}

		res.status(403);
	})
	.get("/", checkToken, async (req, res) => {
		let data = await db.collection("receipes").find({ userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) }).toArray();
		res.status(200).json(data);
	})
	.get("/:id", checkToken, async (req, res) => {
		let data = await db.collection("receipes").findOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });
		res.status(data ? 200 : 403).json(data ? data : {});
	})
	.post("/", checkToken, async (req, res) => {
		let request = await db.collection("receipes").insertOne({ ...req.body, userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });
		res.status(request ? 200 : 500).json({ success: request ? true : false });
	})
	.put("/:id", checkToken, async (req, res) => {
		let {_id, ...body} = req.body;
		let request = await db.collection("receipes").updateOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) }, { $set: body });
		res.status(request.matchedCount > 0 ? 200 : 403).json({ success: request.matchedCount > 0 });
	})
	.delete("/:id", checkToken, async (req, res) => {
		let request = await db.collection("receipes").deleteOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });
		res.status(request.deletedCount > 0 ? 200 : 403).json({ success: request.deletedCount > 0 });
	});

app
	.use(cors())
	.use(express.json())
	.use((req, res, next) => {
		console.log(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}][${req.ip}]: ${req.method} ${req.url}`);
		next();
	})
	.get("/status", (req, res) => res.json({ success: db ? true : false }))
	.use("/receipes", receipes)
	.post("/login", async (req, res) => {
		let user = await db.collection("users").findOne(req.body);
		let token = user ? jwt.sign({ _id: user._id, isAdmin: user.isAdmin, exp: Math.floor(Date.now() / 1000) + 20 }, TOKEN_SECRET) : undefined;
		res.set({ authorization: token }).status(user ? 200 : 401).json({ success: user ? true : false });
	})
	.post("/register", async (req, res) => {
		let user = await db.collection("users").findOne(req.body);

		if(user)
			return res.status(200).json({ success: false });

		let request = await db.collection("users").insertOne({ isAdmin: false, ...req.body });
		res.status(request ? 200 : 500).json({ success: request ? true : false });
	});

app.listen(EXPRESS_PORT, EXPRESS_IP, () => console.log(`[i] - Server is listening on ${EXPRESS_IP ? EXPRESS_IP : "0.0.0.0"}:${EXPRESS_PORT}`));

/**
 * END
 */
