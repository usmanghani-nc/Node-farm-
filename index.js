const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////
// FILES
// blocking code synchronos 

// const data = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(data);


// non-blocking asynchrous code //

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1) => {
//         console.log(data1);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data2) => {
//             console.log(data2);
//             fs.writeFile(`./text/final.txt`, `${data1}/n${data2}`, 'utf-8', err => {
//                 console.log('File have been Written')
//             })
//         })
//     })
// })


/////////////////
// SERVER & ROUT

// pass 2 variables request and response in the call back function
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {

    const {
        pathname,
        query
    } = url.parse(req.url, true)


    // overview
    if (pathname === '/' || pathname === "/overview") {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    } else if (pathname === '/product') {
        res.writeHead(200, {
            'content-type': 'text/html'
        })
        const product = dataObj[query['']];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end('<h2>page was not found 404</h2>')
    }

})
server.listen(4000, '192.168.1.104', () => {
    console.log('Server live on -> 192.168.1.104:4000 ');
});