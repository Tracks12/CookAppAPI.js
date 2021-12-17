/**
 * Project : CookAppAPI
 * Name    : receipes.js
 * Date    : 04/11/2021
 * Autor   : CARDINAL Florian
 */

// Import Modules
import express from "express";
import { ObjectID } from "mongodb";
import jwt from "jsonwebtoken";

// Import Constants & Utils
import { TOKEN_SECRET } from '../common/constants.js';
import { Database } from "../common/database.js";
import { checkToken } from "../common/utils.js";

// Receipes instances
const Receipes = express();

export default Receipes
	.on("mount", () => console.log("[i] - Receipes CRUD correctly mounted !"))
	.use(checkToken)
	.get("/all", async (req, res) => {
		return(
			!jwt.verify(req.headers.authorization, TOKEN_SECRET).isAdmin
			? res.status(403).json({ success: false, error: "You don't have administrator permissions" })
			: res.status(200).json(await Database.collection("receipes").find().toArray())
		);
	})
	.get("/", async (req, res) => {
		let data = await Database.collection("receipes").find({ userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) }).toArray();
		res.status(200).json(data);
	})
	.get("/:id", async (req, res) => {
		let data = await Database.collection("receipes").findOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });

		res
			.status(data ? 200 : 403)
			.json(data ? data : {});
	})
	.post("/", async (req, res) => {
		let request = await Database.collection("receipes").insertOne({ ...req.body, userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });

		res
			.status(request ? 200 : 500)
			.json({ success: request ? true : false });
	})
	.put("/:id", async (req, res) => {
		let { _id, ...body } = req.body;
		let request = await Database.collection("receipes").updateOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) }, { $set: body });

		res
			.status(request.matchedCount > 0 ? 200 : 403)
			.json({ success: request.matchedCount > 0 });
	})
	.delete("/:id", async (req, res) => {
		let request = await Database.collection("receipes").deleteOne({ _id: new ObjectID(req.params.id), userid: new ObjectID(jwt.verify(req.headers.authorization, TOKEN_SECRET)._id) });

		res
			.status(request.deletedCount > 0 ? 200 : 403)
			.json({ success: request.deletedCount > 0 });
	});

/**
 * END
 */
