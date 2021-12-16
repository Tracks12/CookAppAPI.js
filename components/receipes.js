/**
 * Project : CookAppAPI
 * Name    : receipes.js
 * Date    : 04/11/2021
 * Autor   : CARDINAL Florian
 */

import express from "express";
import { ObjectID } from "mongodb";
import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from '../common/constants.js';
import { db } from "../common/database.js";
import { checkToken } from "../common/utils.js";

export const receipes = express();

receipes
	.on("mount", () => console.log("[i] - Receipes CRUD correctly mounted !"))
	.use(checkToken)
	.get("/all", async (req, res) => {
		if(jwt.verify(req.headers.authorization, TOKEN_SECRET).isAdmin)
			return res.status(200).json(await db.collection("receipes").find().toArray());

		res.status(403);
	})
	.get("/", async (req, res) => {
		let data = await db.collection("receipes").find({ userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) }).toArray();
		res.status(200).json(data);
	})
	.get("/:id", async (req, res) => {
		let data = await db.collection("receipes").findOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });

		res
			.status(data ? 200 : 403)
			.json(data ? data : {});
	})
	.post("/", async (req, res) => {
		let request = await db.collection("receipes").insertOne({ ...req.body, userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });

		res
			.status(request ? 200 : 500)
			.json({ success: request ? true : false });
	})
	.put("/:id", async (req, res) => {
		let {_id, ...body} = req.body;
		let request = await db.collection("receipes").updateOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) }, { $set: body });

		res
			.status(request.matchedCount > 0 ? 200 : 403)
			.json({ success: request.matchedCount > 0 });
	})
	.delete("/:id", async (req, res) => {
		let request = await db.collection("receipes").deleteOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });

		res
			.status(request.deletedCount > 0 ? 200 : 403)
			.json({ success: request.deletedCount > 0 });
	});

/**
 * END
 */
