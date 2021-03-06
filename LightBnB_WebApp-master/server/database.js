const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `SELECT * FROM users WHERE email = $1`
  const queryParams = [`${email}`]
  return pool.query(queryString, queryParams)
  .then(res => res.rows[0]);

  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `SELECT * FROM users WHERE id = $1`
  const queryParams = [`${id}`]
  return pool.query(queryString, queryParams)
  .then(res => res.rows[0]);}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`
  const queryParams = [`${user.name}`, `${user.email}`, `${user.password}`]
  return pool.query(queryString, queryParams)
  // .then(res => res.rows[0]);
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `SELECT reservations.*, properties.*
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < NOW()::date
  ORDER BY start_date
  LIMIT $2;`
  const queryParams = [`${guest_id}`, limit]
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 * 
 * {
  city,
  owner_id,
  minimum_price_per_night,
  maximum_price_per_night,
  minimum_rating
}
 */
const getAllProperties = function(options, limit = 10) {
 const queryParams = [];
  
 let queryString = `
 SELECT properties.*, AVG(property_reviews.rating) as average_rating
 FROM properties
 LEFT OUTER JOIN property_reviews ON properties.id = property_reviews.property_id
 `;
 
  //city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }

 //owner id
 if (options.owner_id) {
   queryParams.push(options.owner_id);
   queryString += `WHERE owner_id = $${queryParams.length} ${options.minimum_price_per_night || options.maximum_price_per_night ? 'AND ' : ''}`;
 }


 if (options.minimum_price_per_night && options.maximum_price_per_night) {
   queryParams.push(options.minimum_price_per_night * 100);
   queryString += `cost_per_night BETWEEN $${queryParams.length} AND `;
   queryParams.push(options.maximum_price_per_night * 100);
   queryString += `$${queryParams.length}`;
 } else if (options.minimum_price_per_night) {
   queryParams.push(options.minimum_price_per_night * 100);
   queryString += `cost_per_night >= $${queryParams.length}`;
 } else if (options.maximum_price_per_night) {
   queryParams.push(options.maximum_price_per_night * 100);
   queryString += `cost_per_night <= $${queryParams.length}`;
 }

 //group
 queryString += `
 GROUP BY(properties.id)`;

  if (options.minimum_rating) {
   queryParams.push(options.minimum_rating);
   queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
 }

 queryParams.push(limit);
 queryString += `
 ORDER BY cost_per_night
 LIMIT $${queryParams.length};
 `;

 return pool
   .query(queryString, queryParams)
   .then((res) => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 * // Property 
{
  owner_id: int,
  title: string,
  description: string,
  thumbnail_photo_url: string,
  cover_photo_url: string,
  cost_per_night: string,
  street: string,
  city: string,
  province: string,
  post_code: string,
  country: string,
  parking_spaces: int,
  number_of_bathrooms: int,
  number_of_bedrooms: int
}
 */
const addProperty = function(property) {
  const queryParams = Object.values(property);
  let queryString = `
  INSERT INTO properties (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
  VALUES(`;

  queryParams.forEach((param, i) => {
    queryString += `${i === 0 ? '' : ', '}$${i + 1}${i === queryParams.length - 1 ? ')' : ''}`;
  });

  queryString += `
  RETURNING *;`;

  return pool.query(queryString, queryParams)
    .then(res => res.rows);
}
exports.addProperty = addProperty;
