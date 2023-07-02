const http = require('http');
const path = require('path');
const fs = require('fs');

// creating a server
const server = http.createServer((req, res) => {

// below way isn't efficient since every page we add, we'd have to check the req path and do this 
// we'd rather make the file path dynamic
/*
  // if request url is /, load the homepage, if request url is /about, load about page
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (error, content) => {
      // writeHead writes to the headers (allows us to see content type in console's network tab)
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

      if (error) throw error;

      // want to output the content of the file
      res.end(content);
    })
  }

  // if we want this to be a REST api, we want the server to be serving json instead of html
    // normally we'd fetch data from a db and serve that
  if (req.url === '/api/users') {
    const users = [
      { name: 'Bob Smith', age: 40},
      { name: 'John Doe', age: 30}
    ];

    // since content type is json, we'd change content type to application/json
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    // then we turn the js array object(users) into json
    res.end(JSON.stringify(users));
  }
*/


  // build file path
  // to set to req url, we'll use ternary operator that says --> req.url === '/' ? 'index.html' : req.url
  //                     req.url === '/' ? 'index.html' : req.url
  // if the request url is equal to / (root), load index.html(homepage) in public folder, else load req.url (whatever other page that is)
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // get extension of file
  let extname = path.extname(filePath);

  // initial content type
  let contentType = 'text/html'

  // check extension and set content type
  switch(extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      // if error is ENOENT, send user to error page, else it's a some server error
      // error will have a code object that contains the error code 
      if (error.code === 'ENOENT') {
        // ENOENT <-- error code means page isn't found
        fs.readFile(path.join(__dirname, 'public', '404.html'), (error, content) => {
          res.writeHead(200, { 'Cotent-Type': 'text/html' });
          res.end(content, 'utf8');
        });
      } else {
        // some server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // if no error, then it's a success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }

  });

});

// when deployed, it's not always going to run on port 3000 
// port will run on what a may host decides on, which will be in an environment variable
  // process.env.PORT || 3000 <-- it'll first look for env variable or run on port 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

