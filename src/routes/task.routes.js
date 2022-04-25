const express = require('express');
const router = express.Router();
const Task = require('../models/task')

router.get('/', async(req,res)=>{
    const task = await Task.find();
    res.json(task)
})
router.get('/:id', async(req,res)=>{
    const task = await Task.findById(req.params.id);
    res.json(task)
})
router.post('/',async(req,res)=>{
    const {title , description} = req.body;
    const taske = new Task({title,description});
    await taske.save();
    res.json({status : "insertado"})
})
router.put('/:id',async(req,res)=>{
    const { id } = req.params;
    await Task.findByIdAndUpdate(id,req.body);
    res.json({status: "actualizado"});
})
router.delete('/:id',async(req,res)=>{
    const { id } = req.params;
    await Task.findByIdAndRemove(id);
    res.json({status: "Eliminado"});
})

module.exports = router;