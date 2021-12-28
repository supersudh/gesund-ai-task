const express = require("express");
const multer = require("multer");
const cors = require("cors");
const extract = require('extract-zip');
const fs = require("fs")

const upload = require("./upload");
const app = express()

app.use('/static', express.static('public'))

//Add the client URL to the CORS policy
const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.post("/upload_file", upload.single("file"), async function (req, res) {
  if (!req.file) {
    //If the file is not uploaded, then throw custom error with message: FILE_MISSING
    throw Error("FILE_MISSING")
  } else {
    //If the file is uploaded, then send a success response.
    console.log(req.file);
    const {
      originalname,
      path: relativePath,
      filename
    } = req.file;
    const absolutePath = `${__dirname}/${relativePath}`;
    try {
      const targetUnzipDirectory = `${__dirname}/public/`;
      await extract(absolutePath, { dir: targetUnzipDirectory });
      const path = targetUnzipDirectory;
      const filesArray = fs.readdirSync(path).filter(file => fs.lstatSync(path + file).isFile());
      res.send({ status: "success", filesArray })
    } catch (error) {
      console.log('Error in /upload_file');
      console.log(error);
      throw Error("INTERNAL_ERROR");
    }
  }
})

//Express Error Handling
app.use(function (err, req, res, next) {
  // Check if the error is thrown from multer
  if (err instanceof multer.MulterError) {
    res.statusCode = 400
    res.send({ code: err.code })
  } else if (err) {
    // If it is not multer error then check if it is our custom error for FILE_MISSING
    if (err.message === "FILE_MISSING" || err.message === "INVALID_TYPE") {
      res.statusCode = 400
      res.send({ code: err.message })
    } else {
      //For any other errors set code as GENERIC_ERROR
      res.statusCode = 500
      res.send({ code: "GENERIC_ERROR" })
    }
  }
})

//Start the server in port 8081
const server = app.listen(8081, function () {
  const port = server.address().port

  console.log("App started at http://localhost:%s", port)
})