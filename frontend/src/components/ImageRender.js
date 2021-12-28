import { Col } from "react-bootstrap";

const ImageRenderer = ({
  activeImage
}) => {
  return (
    <Col
      className="image-renderer-container"
      lg={6}
    >
      <img
        // src="https://image.shutterstock.com/image-photo/blonde-woman-having-fun-sparkler-600w-511370386.jpg"
        src={activeImage ? `http://localhost:8081/static/${activeImage}` : undefined}
        alt="Select an Image to proceed"
        className="selected-img"
      />
    </Col>
  );
};

export default ImageRenderer;
