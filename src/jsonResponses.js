const pokemons = require('./pokedex.json');

const pokemonTeam = [];

// Response w/ a JSON object
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  // Headers
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  response.writeHead(status, headers);

  // If it isn't a head, return the content
  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

const addPokemon = (request, response) => {
  let responseJSON = {
    message: 'Fields are not fulfilled',
  };

  const { name, id, img } = request.body;

  if (!name || !id || !img) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  // Create a new pokemon object
  if (!pokemons[name]) {
    responseCode = 201;
    pokemons[name] = {
      name, id, img,
    };
  }

  if (responseCode === 201) {
    responseJSON = {
      message: 'Created Successfully',
      name,
      id,
      img,
    };
    console.log(responseJSON);

    return respondJSON(request, response, responseCode, responseJSON);
  }
  return false;
};

const addPokemonToTeam = (request, response) => {
  const { name } = request.body;

  // Find the Pokémon in the pokedex
  const foundPokemon = pokemons.find((p) => p.name.toLowerCase() === name.toLowerCase());
  pokemonTeam.push(foundPokemon);

  console.log(foundPokemon);
  console.log(pokemonTeam);

  return respondJSON(request, response, 201, foundPokemon);
};

const getPokemonByParam = (request, response, param, input) => {
  if (!input) {
    return respondJSON(request, response, 400, { message: `Missing ${param} parameter` });
  }

  // Ensure pokemons is properly loaded
  const filteredPokemons = pokemons.filter((p) => {
    // If the field is an array (e.g., type), check for inclusion
    if (Array.isArray(p[param])) {
      return p[param].map((val) => val.toLowerCase()).includes(input.toLowerCase());
    }
    // Otherwise, compare directly (for name or id)
    return String(p[param]).toLowerCase() === input.toLowerCase();
  });

  // Handle no matches
  if (filteredPokemons.length === 0) {
    return respondJSON(request, response, 404, { message: `No Pokémon found for ${param}: ${input}` });
  }

  // Build response, only want name and image to display
  const responseJSON = {
    pokemons: filteredPokemons.map((p) => ({
      name: p.name,
      img: p.img,
    })),
  };

  return respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  notFound,
  getPokemonByParam,
  addPokemon,
  addPokemonToTeam,
};
