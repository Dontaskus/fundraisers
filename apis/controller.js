const express=require('express')
const db=require('../db/db-details')
const connection=db.connection()
connection.connect()
const route=express.Router()
//The List active fundraisers endpoint
route.get("/fundraisers", (req, res)=>{
	connection.query("select * from fundraisers where active != 0", (err, records,fields)=> {
		 if (err){
			 console.error("Error while retrieve the data");
		 }else{
			 res.send(records);
		 }
	})
})
//The Single Fundraiser Endpoint
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

//The Search Endpoint

route.get("/fundraisers/search/:search", (req, res) => {
    const { search } = req.params;
    if (!search) {
        return res.status(400).send({ message: "Search query is required." });
    }

    const searchQuery = `%${search}%`;
    connection.query(
        `SELECT * FROM fundraisers WHERE organizer LIKE ? OR city LIKE ? OR caption LIKE ?`,
        [searchQuery, searchQuery, searchQuery],
        (err, records) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            } else {
                res.status(200).send(records);
            }
        }
    );
});

module.exports=route