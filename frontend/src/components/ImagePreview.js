import { Card, Col } from 'react-bootstrap';

const ImagePreview = ({
  filesArray,
  setActiveImage
}) => {
  const totalItems = filesArray.length;
  const constructedImages = [];
  for (let i = 1; i <= totalItems; i++) {
    const key = `image-${i}`;
    constructedImages.push((
      <Card
        key={key}
        className="preview-img-card"
      >
        <Card.Img
          src={`http://localhost:8081/static/${filesArray[i - 1]}`}
          className="preview-img"
          onClick={() => setActiveImage(filesArray[i - 1])}
        />
      </Card>
    ));
  }
  return (
    <Col
      className="image-preview-container"
      lg={3}
    >
      {constructedImages}
    </Col>
  );
};

export default ImagePreview;
