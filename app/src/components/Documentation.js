/**
 * Documentation Page component
 * 
 * 
 * @author Cristian Mitoi
 */

import './Documentation.css'

function Documentation() {
    return (
        <div className='documentation'>
            <h1 className='title'>Documentation for API</h1>
            <p>&nbsp; Student ID: 20010102</p>
            <p>&nbsp; Name: Mitoi Cristian</p>

            <h4>Endpoints</h4>
            <p>&nbsp; Endpoints will only allow Get and Post methods.</p>

            <h4>Messages Endpoint</h4>
            <p>&nbsp; This endpoint displays all the messages that buyers submited in the app</p>
            <p><a className='link' href="https://cashed-benches.000webhostapp.com/dissertation/api/messages">cashed-benches.000webhostapp.com/dissertation/api/messages</a></p>
            
            <h4>Donors Endpoint</h4>
            <p>&nbsp; Shows information about donors from the database.</p>
            <p><a className='link' href="https://cashed-benches.000webhostapp.com/dissertation/api/donor">cashed-benches.000webhostapp.com/dissertation/api/donor</a></p>
            <p>&nbsp; Donor endpoint supports the use of a product_id parameter. It links the donor to the item and displays information about the type of item that was donated. For example:</p>
            <a className='link' href="https://cashed-benches.000webhostapp.com/dissertation/api/donor?product_id=1999-3000">cashed-benches.000webhostapp.com/dissertation/api/donor<strong>?product_id</strong>=1999-3000</a>

            <h4>Authentication Endpoint</h4>
            <p>&nbsp; It only allows Post requests.</p>
            <p>&nbsp; This endpoint accepts two parameters: username and password.</p>
            <p>&nbsp; These parameters are posted to the API. If the username and password match a user in the database, then a valid JWT is returned, otherwise appropiate errors are returned.</p>
            <a className='link' href="https://cashed-benches.000webhostapp.com/dissertation/api/auth">cashed-benches.000webhostapp.com/dissertation/api/auth</a>

            <h4>Update Endpoint</h4>
            <p>&nbsp; This endpoint allows only Post requests alongside with two parameters: message_id and status.</p>
            <p>&nbsp; Updating can only happen when signed in with a verified JWT.</p>
            <p>&nbsp; If the parameters are missing, a http response is returned (400), and if the token is invalid, then another http response is returned (401).</p>
            <a className='link' href="https://cashed-benches.000webhostapp.com/dissertation/api/update">cashed-benches.000webhostapp.com/dissertation/api/update</a>

            <h4>Defalut Endpoint</h4>
            <p>&nbsp; This one handles invalid endpoints by returning a 404 http response alongside with an appropiate message.</p>
            <a className='link' href="https://cashed-benches.000webhostapp.com/dissertation/api/wrongEndpoint">cashed-benches.000webhostapp.com/dissertation/api/wrongEndpoint</a>

            <h4>Optional Response Code</h4>
            <p>&nbsp; The 500 response code is returned when an exception occurs.</p>

        </div>

    );
}
 
export default Documentation;