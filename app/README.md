#### Vérifier que l'API est en ligne :
`GET http://localhost:5000/status`
(doit renvoyer `{ success: true }`)
#### Récupérer toutes les recettes :
`GET http://localhost:5000/receipes`
#### Récupérer une recette :
`GET http://localhost:5000/receipes/<id de la recette à récupérer>`
#### Créer une nouvelle recette :
`POST http://localhost:5000/receipes`
- L'objet à insérer sera dans le body de la requête
- C'est votre API qui doit générer un `_id` pour cette nouvelle recette
#### Modifier une recette existante :
`PUT http://localhost:5000/receipes/<id de la recette>`
- L'objet modifié sera dans le body de la requête
#### Supprimer une recette :
`DELETE http://localhost:5000/receipes/<id de la recette à supprimer>`

### Datamodel :
```json
[
	{
		"_id": "vTH0Jed4X-VAH5GpM-Zwa",
		"name": "Mousse express au Nutella",
		"nbParts": 6,
		"ingredients": [
			{ "name": "Mascarpone", "quantity": 200, "unit": "g" },
			{ "name": "Oeufs", "quantity": 2 },
			{ "name": "Nutella", "quantity": 5, "unit": "cuillères à soupe" },
			{ "name": "Sucre", "quantity": 60, "unit": "g" },
		],
		"steps": [
			"Séparez les blancs et les jaunes d'oeufs. Battez les jaunes avec le sucre et ajoutez le mascarpone puis le Nutella.",
			"Montez les blancs en neige. Incorporez-les progressivement à la première préparation à l'aide d'une spatule.",
			"Versez la mousse dans des verrines et réservez au frais pendant au moins 3 heures. Servez bien froid."
		]
	},
	{
		"_id": "rhF2d0e79oMBXf0FJXbag",
		"name": "Tarte au chèvre et saumon",
		"nbParts": 4,
		"ingredients": [
			{ "name": "Saumon frais", "quantity": 250, "unit": "g" },
			{ "name": "Oeufs", "quantity": 5 },
			{ "name": "Pâte feuilletée", "quantity": 1, "unit": "rouleau" },
			{ "name": "Chèvre", "quantity": 1, "unit": "bûche" },
			{ "name": "Crème fraîche épaisse", "quantity": 20, "unit": "cL" },
		],
		"steps": [
			"Préchauffez le four à 180°. Etalez la pâte feuilletée dans un moule à tarte.",
			"Dans un grand récipient, écrasez le chèvre à l'aide d'une fourchette. Incorporez progressivement les oeufs.",
			"Découpez le saumon en dés. Ciselez l'aneth. Ajoutez à la préparation la crème, les dés de saumon, l'aneth, le sel et le poivre. Mélangez le tout.",
			"Versez la préparation sur la pâte feuilletée. Enfournez durant 40 minutes. Servez chaud ou tiède."
		]
	}
]
```
