/**
 * Project : CookAppAPI
 * Name    : utils.js
 * Date    : 04/11/2021
 * Autor   : CARDINAL Florian
 */

// Import Modules
import jwt from "jsonwebtoken";

// Import Constants
import { TOKEN_SECRET } from './constants.js';

export const checkToken = (req, res, next) => {
	jwt.verify(req.headers.authorization, TOKEN_SECRET, (err, user) => {
		if(err)
			return res.sendStatus(401);

		next();
	});
};

export const requestLogger = (req, res, next) => {
	let date = new Date();
	console.log(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}][${req.ip}]: ${req.method} ${req.url}`);
	next();
};

/**
 * END
 */
