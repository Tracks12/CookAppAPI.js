/**
 * Project : CookAppAPI
 * Name    : index.js
 * Date    : 27/10/2021
 * Autor   : CARDINAL Florian
 */

// Import Modules
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Import Constants & Utils
import { EXPRESS_IP, EXPRESS_PORT, TOKEN_SECRET, TOKEN_DURATION } from './common/constants.js';
import { Database } from "./common/database.js";
import { requestLogger } from "./common/utils.js";

// Import Components
import Receipes from "./components/receipes.js";

// App instances
const App = express();

App
	.use(cors())
	.use(express.json())
	.use(requestLogger)
	.get("/status", (req, res) => res.status(Database ? 200 : 502).json({ success: Database ? true : false }))
	.use("/receipes", Receipes)
	.post("/login", async (req, res) => {
		let Collection = Database.collection("users");
		let user = await Collection.findOne({ user: req.body.user });
		let token = user ? jwt.sign({ _id: user._id, isAdmin: user.isAdmin, exp: Math.floor(Date.now() / 1000) + TOKEN_DURATION }, TOKEN_SECRET) : undefined;

		if(!user)
			return res.status(404).json({ success: false, error: "user wasn't found" });

		bcrypt.compare(req.body.pass, user.pass, (err, result) => {
			res
				.set({ authorization: token })
				.status(user && result ? 200 : !result ? 401 : 502)
				.json({ success: user && result });
		});
	})
	.post("/register", async (req, res) => {
		let Collection = Database.collection("users");
		let user = {
			name: await Collection.findOne({ user: req.body.user }),
			email: await Collection.findOne({ email: req.body.email })
		};

		if(user.name || user.email)
			return res.status(409).json({ success: false, error: user.name ? "user already exist" : "mail address already exist" });

		bcrypt.hash(req.body.pass, 10, async (err, hash) => {
			let { pass, ...body } = req.body;
			let request = await Collection.insertOne({ isAdmin: false, ...body, pass: hash });

			res
				.status(request ? 200 : 502)
				.json({ success: request ? true : false });
		});
	});

App.listen(EXPRESS_PORT, EXPRESS_IP, () => console.log(`[i] - Server is listening on ${EXPRESS_IP ? EXPRESS_IP : "0.0.0.0"}:${EXPRESS_PORT}`));

/**
 * END
 */
