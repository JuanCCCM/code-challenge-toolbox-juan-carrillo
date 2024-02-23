import DataTable from "./components/dataTable";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {
  return (
    <Container fluid className="bg-light">
      <Row>
        <Col className="d-flex bg-danger text-white justify-content-center">
          <h1>Toolbox Challenge - Juan Carrillo</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
