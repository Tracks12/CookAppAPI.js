/**
 * Project : CookAppAPI
 * Name    : database.js
 * Date    : 04/11/2021
 * Autor   : CARDINAL Florian
 */

import { MongoClient } from "mongodb";

import { DB_URL, DB_NAME } from './constants.js';

export let db;

MongoClient.connect(DB_URL, (err, client) => {
	console.log("[i] - MongoDB remote successfully connected !");
	db = client.db(DB_NAME);
});

/**
 * END
 */
