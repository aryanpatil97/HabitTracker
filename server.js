const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')

const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/habitdb2', 
 { useNewUrlParser: true, useUnifiedTopology: true 

 })
 //Model
 const HabitSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    category:{type:String,required:true},
    tags:[{type:String}],
    dates:[{type:Date}]
 })

 const Habit =mongoose.model('Habit',HabitSchema)

 //Route
 app.post('/habits',async(req,res) =>{
     const {name,description,category,tags}=req.body;
     try{
        const newHabit= new Habit({name,description,category,tags})
        await newHabit.save()
        res.status(200).json(newHabit)
     }catch(err){
        res.status(400).json({error:err.message})
     }
 })

 app.get('/habits',async(req,res) =>{
    try{
        const habits= await Habit.find();
        res.status(200).json(habits)
    }catch(err){
        res.status(400).json({error:err.message})
    }
 })



 app.put('/habits/:id',async(req,res) =>{
    const {name,description,category,tags}=req.body;
    try{
        const updateHabit= await Habit.findByIdAndUpdate(
            req.params.id,
            {name,description,category,tags},
            {new:true}
        )
        res.status(200).json(updateHabit)
    }catch(err){
        res.status(400).json({error:err.message})
    }
 })

 app.delete('/habits/:id',async(req,res) =>{
    const {id} =req.params
    try{
      await Habit.findByIdAndDelete(id)
      res.status(200).json({message:'Habit deleted successfully'})
    }catch(error){
        res.status(400).json({error:err.message})
    }
 })
 app.listen(5000,() => console.log('server connected'))