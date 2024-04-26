const http = require('http');
const fs = require('fs')
const path = require('path')
const {MongoClient} = require('mongodb');  
async function mongodbConnection(){ 
    const url ="mongodb+srv://devarapalli:venkatasaisandeep@cluster0.t5rqeke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(url);
    try {
        await client.connect();
            console.info("Database is connected successfully");
            const data =await mydatacomputerstore(client);
            return data;
    } catch (e) {
        console.error("Error in connecting the database : ", e)
    } finally {
        await client.close();
        console.log("Database connection is closed");
    }
}
async function mydatacomputerstore(client ){
    const cursor = client.db("computerdb").collection("computerstore").find({});
    const results = await cursor.toArray();
    const js= (JSON.stringify(results));
    console.log(js);
    return results;
};
// Create server object
http.createServer(async (req,res)=>{
    console.log(req.url)
    if(req.url =='/'){
        // load the index.html and throw that
        fs.readFile(path.join(__dirname,'/public','index.html'), (err,content) =>{
            if(err){
                if(err.code == "ENOENT"){
                    res.writeHead(404,{"content-type":"text/html"});
                    res.end("<h1>404 Page Not Found!</h1>");
                }
                else{
                    res.writeHead(500, { "content-type": "text/plain" });
                    res.end("Internal Server Error");
                }
            }
            else{
                res.writeHead(200,{'Content-Type':'text/html'});
                res.end(content);
            }
        })
    }
    else if (req.url =='/api'){//displays the data from mongo db
        const computerData =await mongodbConnection();
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.writeHead(200,{"content-type":"application/json"});
        res.end(JSON.stringify(computerData));
    }
    else if (req.url =='/localapi'){//displays the data from db.json file
        fs.readFile(path.join(__dirname,'/public','db.json'), (err,content) =>{
            if (err) throw err;
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(content);
        })
    }
    else {
        res.writeHead(404,{'Content-Type':'text/html'});
        res.end("<h1> 404 </h1>");
    }
  }).listen(1628, () => console.log('Server running on port 1628 ...'));