/**
 * Branded navbar Component
 * 
 * 
 * @author 
 */

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './BrandBar.css';

function BrandBar() {
  return (
    <div className='navbar'> 
      <Navbar bg="" variant="dark">
        <Container>
          <Navbar.Brand>
            <img
              alt=""
              src={require('./img/logo3.png')}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Brand Name
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
}

export default BrandBar;