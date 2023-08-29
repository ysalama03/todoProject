const express = require("express");
const PORT=process.env.PORT || 5000;
const app = express();

let todos = [];

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const loggerMidWare = (req,res,next)=>{
    console.log(req.method,req.url);
    next();
}

app.use(loggerMidWare);

app.get("/", (req,res) =>{
    console.log(todos);
    res.send({todos});
});

app.post("/", (req,res) =>{
const body = req.body;
console.log(body);

if(Object.keys(body).length > 0){
    todos.push(body);
    res.send(body);
}else{
    res.status(400).send({message: "Cannot send empty body."});
}
})

app.delete('/:id', (req,res)=>{
    const todoID = req.params.id;
    console.log(todoID);
    todos= todos.filter(todo=>Number(todo.id) !== Number(todoID));
    res.send(todos);

})

app.put('/:id', (req,res)=>{
    const todoID = req.params.id;

    const index = todos.findIndex(todo=> Number(todo.id) === Number(todoID));
    
    if(index >= 0){
        todos[index]= req.body;
        res.send(todos[index]);
    }else{
        res.status(404).send("todo non existent");
    }
})
app.listen(PORT, "localhost", ()=>{
    console.log(`Server Up N Runnin!\nPort: ${PORT} `);
});