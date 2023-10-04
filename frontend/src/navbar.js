import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function NavbarTop() {
  return (
    <Navbar data-bs-theme="dark" bg="primary" className="bg-body-tertiary">
      <Container>
        {/* <img src={usaalogo} alt='logo'/> */}
        <Navbar.Brand href="#home">EnterpriseWiki</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Spaces" id="basic-nav-dropdown">
            </NavDropdown>
            <Nav.Link href="#Calendars">Calendars</Nav.Link>
            <Nav.Link href="#Analytics">Analytics</Nav.Link>
            <Button type="submit">Create</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Form inline>
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search"
              className=" mr-sm-2"
            />
          </Col>
          <Col xs="auto">
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
    </Navbar>
  );
}