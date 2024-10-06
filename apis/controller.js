const express=require('express')
const db=require('../db/db-details')
const connection=db.connection()
connection.connect()
const route=express.Router()
// The GET endpoint for categories
route.get('/api/categories', (req, res) => {
    const sql = 'SELECT * FROM categories'; 
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve categories' });
      }
  
      res.json(results);
    });
  });
  

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
// POST endpoint to insert a new donation for a specific fundraiser
route.post("/donations", (req, res) => {
    const { date, amount, giver, fundraiser_id } = req.body;

    // Ensuring all required fields are provided
    if (!date || !amount || !giver || !fundraiser_id) {
        return res.status(400).json({
            error: "All fields (date, amount, giver, fundraiser_id) are required."
        });
    }

    const insertDonationQuery = `
        INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(insertDonationQuery, [date, amount, giver, fundraiser_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error inserting donation." });
        }

        res.status(201).json({
            message: "Donation successfully created",
            donation_id: result.insertId,
            donation: {
                date,
                amount,
                giver,
                fundraiser_id
            }
        });
    });
});
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
// The POST endpoint to create a new fundraiser
route.post("/fundraisers", (req, res) => {
    const { category_id, organizer, caption, city, current_fund, active, target_fund } = req.body;

    if (!category_id || !organizer || !caption || !city || current_fund === undefined || active === undefined || target_fund === undefined) {
        return res.status(400).send({ error: "All fields (category_id, organizer, caption, city, current_fund, active, target_fund) are required." });
    }

    const insertFundraiserQuery = `
        INSERT INTO fundraisers (category_id, organizer, caption, city, current_fund, active, target_fund)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(insertFundraiserQuery, [category_id, organizer, caption, city, current_fund, active, target_fund], (err, result) => {
        if (err) {
            console.error("Error while inserting fundraiser:", err);
            res.status(500).send({ error: "Database error while inserting fundraiser." });
        } else {
            res.status(201).send({
                message: "Fundraiser successfully created",
                fundraiser_id: result.insertId,  // Get the auto-incremented ID of the new fundraiser
                fundraiser: {
                    category_id,
                    organizer,
                    caption,
                    city,
                    current_fund,
                    active,
                    target_fund
                }
            });
        }
    });
});

route.post('/fundraisers', async (req, res) => {
    const { category_id, organizer, caption, city, current_fund, active, target_fund } = req.body;

    if (!category_id || !organizer || !caption || !city || !current_fund || active === undefined || !target_fund) {
        return res.status(400).json({ error: "All fields (category_id, organizer, caption, city, current_fund, active, target_fund) are required." });
    }

        const query = `
            INSERT INTO fundraisers (category_id, organizer, caption, city, current_fund, active, target_fund)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.query(query, [category_id, organizer, caption, city, current_fund, active, target_fund]);

        res.status(201).json({ message: "Fundraiser created successfully!" });
        res.status(500).json({ error: "An error occurred while creating the fundraiser." });
});


// The PUT endpoint to update an existing fundraiser by ID
route.put("/fundraisers/:id", (req, res) => {
    const { id } = req.params;
    const { category_id, organizer, caption, city, current_fund, active, target_fund } = req.body;

    if (!category_id && !organizer && !caption && !city && current_fund === undefined && active === undefined && target_fund === undefined) {
        return res.status(400).send({ error: "At least one field (category_id, organizer, caption, city, current_fund, active, target_fund) is required to update." });
    }
    let updateFields = [];
    let updateValues = [];

    if (category_id !== undefined) {
        updateFields.push("category_id = ?");
        updateValues.push(category_id);
    }
    if (organizer !== undefined) {
        updateFields.push("organizer = ?");
        updateValues.push(organizer);
    }
    if (caption !== undefined) {
        updateFields.push("caption = ?");
        updateValues.push(caption);
    }
    if (city !== undefined) {
        updateFields.push("city = ?");
        updateValues.push(city);
    }
    if (current_fund !== undefined) {
        updateFields.push("current_fund = ?");
        updateValues.push(current_fund);
    }
    if (active !== undefined) {
        updateFields.push("active = ?");
        updateValues.push(active);
    }
    if (target_fund !== undefined) {
        updateFields.push("target_fund = ?");
        updateValues.push(target_fund);
    }

    updateValues.push(id); 

    const updateQuery = `
        UPDATE fundraisers
        SET ${updateFields.join(", ")}
        WHERE id = ?
    `;

    connection.query(updateQuery, updateValues, (err, result) => {
        if (err) {
            console.error("Error while updating fundraiser:", err);
            res.status(500).send({ error: "Database error while updating fundraiser." });
        } else if (result.affectedRows === 0) {
            res.status(404).send({ error: "Fundraiser not found." });
        } else {
            res.status(200).send({
                message: "Fundraiser updated successfully",
                fundraiser_id: id,
                updatedFields: req.body
            });
        }
    });
});

// DELETE endpoint to delete a fundraiser by ID if it has no donations
route.delete('/fundraisers/:id', (req, res) => {
    const fundraiserId = req.params.id;

    // Checking if the fundraiser has any donations
    const checkDonationsQuery = `
        SELECT COUNT(*) AS donationCount FROM DONATION WHERE FUNDRAISER_ID = ?
    `;

    connection.query(checkDonationsQuery, [fundraiserId], (err, donationCheckResult) => {
        if (err) {
            return res.status(500).json({ error: "Error checking donations." });
        }

        if (donationCheckResult[0].donationCount > 0) {
            // Fundraiser has donations, so it cannot be deleted
            return res.status(400).json({
                error: "Cannot delete this fundraiser because it has existing donations."
            });
        }

        // Fundraiser has no donations, so it can be deleted
        const deleteFundraiserQuery = `
            DELETE FROM FUNDRAISERS WHERE id = ?
        `;

        connection.query(deleteFundraiserQuery, [fundraiserId], (err, deleteResult) => {
            if (err) {
                return res.status(500).json({ error: "Error deleting fundraiser." });
            }

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ error: "Fundraiser not found" });
            }

            res.status(200).json({ message: "Fundraiser deleted successfully" });
        });
    });
});

module.exports=route
