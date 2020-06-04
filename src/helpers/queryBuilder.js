const exampleQueryObj = {
	fields: ['*', 'cover.url', 'platforms'],
	limit: 25,
	where: [
		'platforms !=n',
		'platforms = (163, 92, 6)',
		'parent_game = null',
		'total_rating >= 75',
		'total_rating_count >= 100',
		'id != 1942'
	],
	sort: 'total_rating desc'
};

function buildQuery(queryObj) {
	if (typeof queryObj !== 'object' || Array.isArray(queryObj)) throw new TypeError("Provided argument must be an object.");
	if (!queryObj.fields) throw new SyntaxError("No fields provided in argument object. If trying to return all fields, include '*'");

	let query = '';
	//* Work with 'fields' key
	Array.isArray(queryObj.fields) ?
		query += `fields: ${queryObj.fields.join(',')};` :
		query += `fields: ${queryObj.fields};`;
	//* Work with 'limit' key
	if (queryObj.limit) query += ` limit: ${queryObj.limit.toString()};`;
	//* Work with 'where' key
	if (queryObj.where) Array.isArray(queryObj.where) ? 
		query += ` where: ${queryObj.where.join(' & ')};` :
		query += ` where: ${queryObj.where};`
	//* Work with 'sort' key
	if (queryObj.sort) query += ` sort: ${queryObj.sort};`
	//* Work with 'exclude' key
	if (queryObj.exclude) Array.isArray(queryObj.exclude) ? 
		query += ` exclude: ${queryObj.exclude.join(',')};` :
		query += ` exclude: ${queryObj.exclude};`
	return query
};

module.exports = buildQuery;