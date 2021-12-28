import { useState } from "react";
import { Container, Row, } from "react-bootstrap"

import './App.scss';
import ImagePreview from "./components/ImagePreview";
import ImageRenderer from "./components/ImageRender";
import ImageUpload from "./components/ImageUpload";

import axiosInstance from "./utils/axios"


function App() {
  const [selectedFiles, setSelectedFiles] = useState()
  const [progress, setProgress] = useState()
  const [error, setError] = useState()
  const [filesArray, setFilesArray] = useState([]);
  const [activeImage, setActiveImage] = useState('');

  const submitHandler = e => {
    e.preventDefault() //prevent the form from submitting
    let formData = new FormData()

    if (!selectedFiles || !selectedFiles[0]) {
      return setError("Please select a file before uploading!");
    }


    formData.append("file", selectedFiles[0])
    setError("")
    axiosInstance.post("/upload_file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: data => {
        //Set the progress value to show the progress bar
        setProgress(Math.round((100 * data.loaded) / data.total))
      },
    })
      .then(({data: sucessResponse}) => {
        setFilesArray(sucessResponse.filesArray);
      })
      .catch(error => {
        const { code } = error?.response?.data
        switch (code) {
          case "FILE_MISSING":
            setError("Please select a file before uploading!")
            break
          case "LIMIT_FILE_SIZE":
            setError("File size is too large. Please upload files below 1GB!")
            break
          case "INVALID_TYPE":
            setError(
              "This file type is not supported! Only .zip files are allowed"
            )
            break
          default:
            setError("Sorry! Something went wrong. Please try again later")
            break
        }
      })
  }

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <ImageUpload
            submitHandler={submitHandler}
            setSelectedFiles={setSelectedFiles}
            progress={progress}
            error={error}
          />
          <ImagePreview
            filesArray={filesArray}
            setActiveImage={setActiveImage}
          />
          <ImageRenderer activeImage={activeImage} />
        </Row>
      </Container>
    </div>
  );
}

export default App;
