const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses incoming requests with JSON payload

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1bdxs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient to interact with MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Main function to handle MongoDB connection and routes
async function run() {
  try {
    // Connect to MongoDB
    // await client.connect();
    console.log("Connected to MongoDB!");

    // Collections
    const visaCollection = client.db("sunflower").collection("visa");
    const applicationCollection = client.db("sunflower").collection("application");

    // GET route to fetch all visas
    app.get('/visa', async (req, res) => {
      const cursor = visaCollection.find(); // Finds all documents in the visa collection
      const results = await cursor.toArray(); // Converts cursor to array
      res.send(results); // Sends the array of visas as a response
    });

    // GET route to fetch a single visa by ID
    app.get("/visa/:id", async (req, res) => {
      const id = req.params.id; // Extracts the ID from the URL
      const query = { _id: new ObjectId(id) }; // Creates a query to find the visa by ID
      const result = await visaCollection.findOne(query); // Finds the visa by ID
      res.send(result); // Sends the visa data as a response
    });

    // POST route to add a new visa
    app.post("/visa", async (req, res) => {
      try {
        const newVisa = req.body; // Extracts the new visa data from the request body
        console.log("Adding new visa:", newVisa); // Logs the new visa data
        const result = await visaCollection.insertOne(newVisa); // Inserts the new visa into the collection
        res.status(201).send(result); // Sends a response with status 201 and the result of insertion
      } catch (error) {
        console.error("Error adding visa:", error); // Logs the error if any occurs
        res.status(500).send({ error: "Failed to add visa" }); // Sends an error response if the operation fails
      }
    });

    // GET route to fetch all applications
    app.get('/application', async (req, res) => {
      const cursor = applicationCollection.find(); // Finds all applications
      const results = await cursor.toArray(); // Converts cursor to array
      res.send(results); // Sends the array of applications as a response
    });

  


    // GET route to fetch a single application by ID
app.get("/application/:id", async (req, res) => {
  const id = req.params.id; // Extracts the ID from the URL
  try {
    const query = { _id: new ObjectId(id) }; // Creates a query to find the application by ID
    const result = await applicationCollection.findOne(query); // Finds the application by ID
    if (result) {
      res.json(result); // Sends the application data as a JSON response
    } else {
      res.status(404).json({ message: "Application not found" }); // Handle not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching application" }); // Handle error
  }
});

    // POST route to add a new application
    app.post("/application", async (req, res) => {
      try {
        const application = req.body; // Extracts the new application data from the request body
        console.log("Adding new application:", application); // Logs the new application data
        const result = await applicationCollection.insertOne(application); // Inserts the new application into the collection
        res.status(201).send(result); // Sends a response with status 201 and the result of insertion
      } catch (error) {
        console.error("Error adding application:", error); // Logs the error if any occurs
        res.status(500).send({ error: "Failed to add application" }); // Sends an error response if the operation fails
      }
    });

    


    // PUT route to update a visa by ID
// app.put("/visa/:id", async (req, res) => {
//   const { id } = req.params; // Extracts the visa ID from the URL
//   const updatedVisa = req.body; // Extracts the updated visa data from the request body

//   try {
//     const result = await visaCollection.updateOne(
//       { _id: new ObjectId(id) }, // Finds the visa by ID
//       { $set: updatedVisa } // Updates the visa with the new data
//     );

//     if (result.modifiedCount === 0) { // Checks if the visa was not found or not updated
//       return res.status(404).send("Visa not found or no changes made");
//     }

//     res.status(200).send("Visa updated successfully"); // Sends success message
//   } catch (err) {
//     console.error("Error updating visa:", err); // Logs the error if any occurs
//     res.status(500).send("Internal server error"); // Sends an error response if the operation fails
//   }
// });


// PUT route to update a visa by ID
// app.put("/visa/:id", async (req, res) => {
//   const { id } = req.params; // Extracts the visa ID from the URL
//   const updatedVisa = req.body; // Extracts the updated visa data from the request body

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).send("Invalid visa ID format"); // Validate the ID format
//   }

//   try {
//     // Update visa in the database using ObjectId
//     const result = await visaCollection.updateOne(
//       { _id: new ObjectId(id) }, // Finds the visa by ID
//       { $set: updatedVisa } // Updates the visa with the new data
//     );

//     if (result.modifiedCount === 0) {
//       // If no document was modified, either visa not found or no changes made
//       return res.status(404).send("Visa not found or no changes made");
//     }

//     res.status(200).send("Visa updated successfully"); // Sends success message
//   } catch (err) {
//     console.error("Error updating visa:", err); // Logs the error if any occurs
//     res.status(500).send("Internal server error"); // Sends an error response if the operation fails
//   }
// });
// const { ObjectId } = require("mongodb"); // Ensure ObjectId is imported from the MongoDB package

// PUT route to update a visa by ID
app.put("/visa/:id", async (req, res) => {
  const id  = req.params.id; // Extracts the visa ID from the URL
  const filter = { _id: new ObjectId(id) }; 
  const options = { upsert: true }; 

  const updatedVisa = req.body; // Extracts the updated visa data from the request body
    
  const visa ={
    $set: { // Updates the visa with the new data
      visaType: updatedVisa.visaType,
      processingTime: updatedVisa.processingTime,
      fee: updatedVisa.fee,
      validity: updatedVisa.validity,
      applicationMethod: updatedVisa.applicationMethod,
    }
  }
  const result = await visaCollection.updateOne(filter, visa, options);
 
  res.status(200).send(result); // 
 
});




// DELETE route to delete a visa application by ID

app.delete("/application/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received ID to delete:", id); // Log the received ID

  const query = { _id: new ObjectId(id) };

  try {
    // Delete the visa application
    const result = await applicationCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Visa application not found" });
    }

    res.status(200).json({ message: "Visa application deleted successfully" });
  } catch (error) {
    console.error("Error deleting visa application:", error);
    res.status(500).json({
      message: "An error occurred while deleting the visa application",
    });
  }
});






    // DELETE route to delete a visa by ID
    app.delete("/visa/:id", async (req, res) => {
      const id = req.params.id; // Extracts the visa ID from the URL
      const query = { _id: new ObjectId(id) }; // Creates a query to find the visa by ID
    
      try {
        const result = await visaCollection.deleteOne(query); // Deletes the visa by ID
        if (result.deletedCount === 0) { // Checks if the visa was not found
          return res.status(404).json({ message: "Visa not found" });
        }
        res.status(200).send({ message: "Visa deleted successfully!" }); // Sends success message
      } catch (err) {
        res.status(500).json({ error: "Failed to delete visa" }); // Sends an error response if the operation fails
      }
    });

    // Health check route
    app.get("/", (req, res) => {
      res.send("Sunflower is running!"); // Sends a message indicating the server is running
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`); // Logs the server start message
    });
  } catch (error) {
    console.error("Error starting the server:", error); // Logs an error if the server fails to start
  }
}

run().catch((error) => {
  console.error("Failed to connect to MongoDB:", error); // Logs an error if MongoDB connection fails
});
