const http = require('http');
const fs = require('fs');
var requests = require('requests');
const homefile = fs.readFileSync("home.html","utf-8");
const port = process.env.PORT || 3000

const replaceval = (tempVal, orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp-273.15).toFixed(2));
    temperature = temperature.replace("{%tempmin%}",(orgVal.main.temp_min-273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}",(orgVal.main.temp_max-273.15).toFixed(2));
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}
const server = http.createServer((req,res) =>{
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=e0046c1ac9c25c1ed02ec713a593008d')
        .on('data', (chunk) => {
          const objdata = JSON.parse(chunk);
          const arrData = [objdata];
          const realTimeData = arrData.map((val) => replaceval(homefile, val)).join("");
          res.write(realTimeData);
          //console.log(arrData);
        })
        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
        });
    }
})
server.listen(port,()=>{
console.log(`listening at port ${port}`);
});