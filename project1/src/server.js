const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const query = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handleGet = (request, response, parsedURL) => {
    if(parsedURL.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
    }
    if (parsedURL.pathname === "/getPokemonByType") {
        const type = parsedURL.searchParams.get("query");
        console.log(type);
        jsonHandler.getPokemonByParam(request, response, 'type', type);
    } 
    if (parsedURL.pathname === "/getPokemonByName") {
        const name = parsedURL.searchParams.get("query");
        console.log(name);
        jsonHandler.getPokemonByParam(request, response, 'name', name);
    }
    if (parsedURL.pathname === "/getPokemonById") {
        const id = parsedURL.searchParams.get('query');
        console.log(id);
        jsonHandler.getPokemonByParam(request, response, 'id', id);
    }
    if (parsedURL.pathname === "/getPokemonByWeakness") {
        const weakness = parsedURL.searchParams.get('query');
        console.log(weakness);
        jsonHandler.getPokemonByParam(request, response, 'weaknesses', weakness);
    }
    else {
        htmlHandler.getIndex(request, response);
    }
}

const parseBody = (request, response, handler) => {
    
    const body =[];
    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        request.body = query.parse(bodyString);

        handler(request, response);
    });
}

const handlePost = (request, response, parsedURL) => {
    if (parsedURL.pathname === "/addPokemon") {
        parseBody(request, response, jsonHandler.addPokemon);
    }
    if (parsedURL.pathname === "/addPokemonToTeam") {
        parseBody(request, response, jsonHandler.addPokemonToTeam);
    }
}

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

    // If post
    if (request.method === 'POST') {
        // Handle post
        handlePost(request, response, parsedURL);
    }
    else {
        handleGet(request, response, parsedURL);
    }
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
  });