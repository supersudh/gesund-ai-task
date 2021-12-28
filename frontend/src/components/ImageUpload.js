import React from 'react';
import { Alert, Col, Form, Button, ProgressBar } from "react-bootstrap"

const ImageUpload = ({
  submitHandler,
  setSelectedFiles,
  progress,
  error
}) => {
  return (
    <Col
      className="image-upload-container"
      lg={3}
    >
      <Form
        action="http://localhost:8081/upload_file"
        method="post"
        encType="multipart/form-data"
        onSubmit={submitHandler}
      >
        <Form.Group>
          <Form.Control
            id="exampleFormControlFile1"
            label="Select a File"
            type="file"
            onChange={e => {
              setSelectedFiles(e.target.files)
            }}
          />
        </Form.Group>
        <Form.Group>
          <Button variant="info" type="submit" className="upload-btn">
            Upload
          </Button>
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        {!error && progress && (
          <ProgressBar now={progress} label={`${progress}%`} />
        )}
      </Form>
    </Col>
  );
};

export default ImageUpload;
