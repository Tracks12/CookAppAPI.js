/**
 * Project : CookAppAPI
 * Name    : database.js
 * Date    : 04/11/2021
 * Autor   : CARDINAL Florian
 */

// Import Modules
import { MongoClient } from "mongodb";

// Import Constants
import { DB_URL, DB_NAME } from './constants.js';

export let Database;

MongoClient.connect(DB_URL, (err, client) => {
	console.log(err ? "[!] - MongoDB remote not connected !" : "[i] - MongoDB remote successfully connected !");

	if(err)
		return;

	Database = client.db(DB_NAME);
});

/**
 * END
 */
