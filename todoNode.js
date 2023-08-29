const http= require("http");
const fs= require("fs");
const path = require("path");

const PORT= process.env.PORT || 3000;

let todos=[];

const listTodos = (req,res)=>{
res.setHeader("Content-Type","application/json");
res.end(JSON.stringify(todos));
};

const addTodo = (req,res)=>{
const body=[];

req.on("data",(chunk)=>{
body.push(chunk);
}).on("end",()=>{
   const newItem= JSON.parse(Buffer.concat(body).toString()); 
   todos.push(newItem);
   res.end(JSON.stringify(newItem));
})
};
const editTodo = (req,res) =>{
    const todoId= Number(req.url.split("/")[1]);
    console.log(req.url.split("/")[1]);
    console.log(todoId);
    const index = todos.findIndex( todo => Number(todo.id) === Number(todoId));
    if(index >= 0){
        const body=[];
        req.on("data",(chunk)=>{
            body.push(chunk);
            }).on("end",()=>{
               const newItem= JSON.parse(Buffer.concat(body).toString()); 
               todos[index]= newItem
               res.end(JSON.stringify(newItem));
            })
    }else{
        res.writeHeader(404);
        res.end("Todo non existent");
    }
    
}

const removeTodo =(req,res) =>{
    const todoId= Number(req.url.split("/")[1]);
    console.log(req.url.split("/")[1]);
    console.log(todoId);
    todos=todos.filter( todo => Number(todo.id) !== Number(todoId));
    res.end(JSON.stringify(todos));
}


const notFound = (req,res) =>{

res.setHeader("Content-Type", "text/html");
const filePath = path.join(__dirname,"notFound.html");
const readStream = fs.createReadStream(filePath);
readStream.pipe(res);
res.writeHeader(400);
}

const requestListener=(req,res)=>{
const method = req.method;
const route = req.url;
console.log(method,route);

if(method==="GET" && route==="/"){
    listTodos(req,res);
}
else if(method==="POST" && route==="/"){
    addTodo(req,res);
}
else if(method==="PUT" ){
    editTodo(req,res);
}
else if(method==="DELETE"){
    removeTodo(req,res);
}
else{
    notFound(req,res);
};

};

const server= http.createServer(requestListener);

server.listen(PORT, "localhost", () =>{
console.log(`Server Up n Running on Port: ${PORT}`);
});

