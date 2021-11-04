/**
 * Project : CookAppAPI
 * Name    : utils.js
 * Date    : 04/11/2021
 * Autor   : CARDINAL Florian
 */

import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from './constants.js';

export const checkToken = (req, res, next) => {
	jwt.verify(req.headers.authorization, TOKEN_SECRET, (err, user) => {
		if(err)
			return res.sendStatus(401);

		next();
	});
};

/**
 * END
 */
