/**
 * NavBar component
 *
 * @author 
 */


import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './NavBar.css';


function NavBar(props) {
  const { handleLogout, username, settings, link } = props;

  return (
    <div className='navbar'>
      <Navbar bg="" variant="dark">
        <Container>
          <Navbar.Brand href= {link}>
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
        <div className='username'>
          Welcome, {username}!
          {settings}
        </div>
        <div className='logOut'>
          <button onClick={handleLogout}>Log out</button>
        </div>
      
    </div>
  );
}

export default NavBar;