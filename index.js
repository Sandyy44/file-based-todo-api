const express = require('express')
const app = express()
const fs = require('fs');
const port = 4588;

app.use(express.json())

app.get('/todos', (req, res) => {
  let limit = parseInt(req.query.limit)
  let skip = parseInt(req.query.skip)
  if (isNaN(limit) && isNaN(skip)) {
    fs.readFile("./toDo.json", { encoding: "utf-8" }, (error, data) => {
      res.status(200).json({ message: "Successful request", data })
    })
  }
  else {
    fs.readFile("./toDo.json", { encoding: "utf-8" }, (error, data) => {
      let toDoArr = JSON.parse(data)
      let filteredArr = toDoArr.slice(skip, skip + limit)
      res.status(200).json({ message: "Successful request", data: JSON.stringify(filteredArr) })
    })
  }
})

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id
  fs.readFile("./toDo.json", { encoding: "utf-8" }, (error, data) => {
    let toDoArr = JSON.parse(data)
    let selectedToDoIndex = toDoArr.findIndex((ele) => ele.id == id)
    if (selectedToDoIndex == -1) {
      return res.status(404).json({ message: "Element id not found" })
    }
    toDoArr.splice(selectedToDoIndex, 1)
    fs.writeFile("./toDo.json", JSON.stringify(toDoArr), () => {
      res.status(204).json()
    })
  })
})

app.get('/todos/:id', (req, res) => {
  let id = req.params.id
  fs.readFile("./toDo.json", { encoding: "utf-8" }, (error, data) => {
    let toDoArr = JSON.parse(data)
    let selectedToDo = toDoArr.find((ele) => ele.id == id)
    if (!selectedToDo) {
      return res.status(404).json({ message: "Element id not found" })
    }
    res.status(200).json({ message: "Successful request", data: JSON.stringify(selectedToDo) })
  })
})

app.post('/todos', (req, res) => {
  let { title, status } = req.body
  fs.readFile("./toDo.json", { encoding: "utf-8" }, (error, data) => {
    let toDoArr = JSON.parse(data)
    let id = toDoArr.length === 0 ? 0 : toDoArr[toDoArr.length - 1].id + 1;
    if (!status) status = "to-do"
    toDoArr.push({ id, title, status })
    fs.writeFile("./toDo.json", JSON.stringify(toDoArr), () => {
      res.status(201).json({ message: "Created successfully", data: JSON.stringify(toDoArr) })
    })
  })
})

app.patch('/todos/:id', (req, res) => {
  let newData = req.body
  let id = req.params.id
  fs.readFile("./toDo.json", { encoding: "utf-8" }, (error, data) => {
    let toDoArr = JSON.parse(data)
    let selectedToDo = toDoArr.find((ele) => ele.id == id)
    if (!selectedToDo) {
      return res.status(404).json({ message: "Element id not found" })
    }
    Object.assign(selectedToDo, newData)
    fs.writeFile("./toDo.json", JSON.stringify(toDoArr), () => {
      res.status(201).json({ message: "Created successfully", data: JSON.stringify(selectedToDo) })
    })
  })
})


app.listen(port, () => {
  console.log(`listening on port ${port}`);
})