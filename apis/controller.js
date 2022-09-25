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

module.exports=router