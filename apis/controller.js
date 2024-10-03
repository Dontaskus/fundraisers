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
// The Single Fundraiser Endpoint with Donation Details
route.get("/fundraisers/:id", (req, res) => {
    const { id } = req.params;

    // Query to get the fundraiser details and donations
    const fundraiserQuery = `
        SELECT f.*, d.DONATION_ID, d.DATE, d.AMOUNT, d.GIVER
        FROM fundraisers f
        LEFT JOIN DONATION d ON f.id = d.FUNDRAISER_ID
        WHERE f.id = ?
    `;

    connection.query(fundraiserQuery, [id], (err, records) => {
        if (err) {
            console.error("Error while retrieving the data:", err);
            res.status(500).send({ error: "Database retrieval error" });
        } else {
            if (records.length > 0) {
                // Grouping the donations with the fundraiser details
                const fundraiserDetails = {
                    id: records[0].id,
                    organizer: records[0].organizer,
                    caption: records[0].caption,
                    target_fund: records[0].target_fund,
                    current_fund: records[0].current_fund,
                    city: records[0].city,
                    active: records[0].active,
                    category_id: records[0].category_id,
                    donations: records.map(record => ({
                        donation_id: record.DONATION_ID,
                        date: record.DATE,
                        amount: record.AMOUNT,
                        giver: record.GIVER
                    })).filter(donation => donation.donation_id) 
                };
                res.send(fundraiserDetails);
            } else {
                res.status(404).send({ error: "Fundraiser not found" });
            }
        }
    });
});


// The POST endpoint to create a new donation
route.post("/donations", (req, res) => {
    const { date, amount, giver, fundraiser_id } = req.body;

    // To ensure all required fields are provided
    if (!date || !amount || !giver || !fundraiser_id) {
        return res.status(400).send({ error: "All fields (date, amount, giver, fundraiser_id) are required." });
    }

    const insertDonationQuery = `
        INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID) 
        VALUES (?, ?, ?, ?)
    `;

    connection.query(insertDonationQuery, [date, amount, giver, fundraiser_id], (err, result) => {
        if (err) {
            console.error("Error while inserting donation:", err);
            res.status(500).send({ error: "Database error while inserting donation." });
        } else {
            res.status(201).send({
                message: "Donation successfully created",
                donation_id: result.insertId,  
                donation: {
                    date,
                    amount,
                    giver,
                    fundraiser_id
                }
            });
        }
    });
});

//The Search Endpoint

route.get("/search", (req, res) => {
    const  search  = req.query.search;
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
