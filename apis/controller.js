const express=require('express')
const db=require('../db/db-details')
const connection=db.connection()
connection.connect()
const route=express.Router()
route.get("/fundraisers", (req, res)=>{
	connection.query("select * from fundraisers", (err, records,fields)=> {
		 if (err){
			 console.error("Error while retrieve the data");
		 }else{
			 res.send(records);
		 }
	})
})

route.get("/fundraisers/:id", (req, res)=>{
	const {id}=req.params
	connection.query("select * from fundraisers where id=?",[id], (err, record,fields)=> {
		 if (err){
			 console.error("Error while retrieve the data");
		 }else{
			 res.send(record);
		 }
	})
})

module.exports=route