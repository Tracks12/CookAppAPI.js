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
import { db } from "./common/database.js";
import { receipes } from "./components/receipes.js";

// App & Receipes instances
const app = express();

app
	.use(cors())
	.use(express.json())
	.use((req, res, next) => {
		let date = new Date();
		console.log(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}][${req.ip}]: ${req.method} ${req.url}`);
		next();
	})
	.get("/status", (req, res) => res.status(200).json({ success: db ? true : false }))
	.use("/receipes", receipes)
	.post("/login", async (req, res) => {
		let user = await db.collection("users").findOne({ user: req.body.user });
		let token = user ? jwt.sign({ _id: user._id, isAdmin: user.isAdmin, exp: Math.floor(Date.now() / 1000) + TOKEN_DURATION }, TOKEN_SECRET) : undefined;

		if(!user)
			return res.status(404).json({ success: false, error: "user wasn't found" });

		bcrypt.compare(req.body.pass, user.pass, (err, result) => {
			res
				.set({ authorization: token })
				.status(user ? 200 : 500)
				.json({ success: user && result });
		});
	})
	.post("/register", async (req, res) => {
		let user = await db.collection("users").findOne({ user: req.body.user, email: req.body.email });
		let token = user ? jwt.sign({ _id: user._id, isAdmin: user.isAdmin, exp: Math.floor(Date.now() / 1000) + TOKEN_DURATION }, TOKEN_SECRET) : undefined;

		if(user)
			return res.status(409).json({ success: false, error: "user already exist" });

		bcrypt.hash(req.body.pass, 10, async (err, hash) => {
			let request = await db.collection("users").insertOne({ isAdmin: false, ...req.body, pass: hash });

			res
				.set({ authorization: token })
				.status(request ? 200 : 500)
				.json({ success: request ? true : false });
		});
	});

app.listen(EXPRESS_PORT, EXPRESS_IP, () => console.log(`[i] - Server is listening on ${EXPRESS_IP ? EXPRESS_IP : "0.0.0.0"}:${EXPRESS_PORT}`));

/**
 * END
 */
