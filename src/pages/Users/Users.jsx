import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../Users/Users.css';
import prev from '../Users/prev.png';
import next from '../Users/next.png';
import edit from '../Users/edit.png';
import Delete from '../Users/delete.png';
import profile from '../Users/profile.png';
import TransactionsPagination from '../Transactions/Paginagion';

export default function Users() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [userData, setUserData] = useState([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(userData.length / itemsPerPage);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role_id, setRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshPage, setRefreshPage] = useState(false);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedUsers = userData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  
  const isDuplicateGoalName = (nameToCheck) => {
    return userData.some((user) => user.username === nameToCheck);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowUpdateForm = () => setShowUpdateForm(true);
  const handleCloseUpdateForm = () => setShowUpdateForm(false) && resetFormFields();


//handeling the delete function
const handleDeleteClick = (userId) => {
  setUserToDelete(userId);
  setConfirmDelete(true);
};

const handleCancelDelete = () => {
  setUserToDelete(null);
  setConfirmDelete(false);
};

const handleConfirmDelete = async () => {
  try {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc'; 
    const response = await axios.delete(`http://localhost:4000/api/users/user/${userToDelete}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    console.log('Delete Response:', response);

    if (response.status === 200) {
      setConfirmDelete(false);
      setUserToDelete(null);
      setUserData((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
      alert("User has been deleted successfully")
    }
  } catch (error) {
    console.log(userToDelete)
    console.error('Error deleting user:', error);
  }
};
//handeling the delete function




const updateUser = async (e) => {
  e.preventDefault();

  try {
    // // Check for duplicate user name
    if (isDuplicateGoalName(username) && username !== userToUpdate.username) {
      alert('Duplicate user name');
      return;
    }
   

    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc';

    const response = await axios.patch(
      `http://localhost:4000/api/users/user/${userToUpdate}`,
      {
        username,
          email,
          password,
          role_id
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      const updatedUser = response.data;

      // Update the existing goal in the array
      setUserData((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      handleCloseUpdateForm();
      setRefreshPage(true);
    }
  } catch (error) {
    console.error(error);
  }
};



//setting the vlue when the user presses on the pen in order to update the goal
const handleUpdateClick = async (userId) => {
  try {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc';
    const response = await axios.get(`http://localhost:4000/api/users/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.status === 200) {
      const user = response.data;

      setUserName(user.username);
      setEmail(user.email);
      setPassword(user.password);
      setRoleId(user.role_id.name);
      setUserToUpdate(userId)

      // Update the state with the fetched user data, replacing the existing user with the same ID
      setUserData((prevUsers) => {
        const updatedUsers = prevUsers.map((prevUser) => 
          prevUser.id === user.id ? user : prevUser
        );
        return updatedUsers;
      });

      // Show the update form
      handleShowUpdateForm();
    }
  } catch (error) {
    console.error('Error fetching user for update:', error);
  }
};

//setting the vlue when the user presses on the pen in order to update the goal






  useEffect(() => {
    const fetchRoles = async () => {
        const authToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc';
      try {
        const response = await axios.get('http://localhost:4000/api/roles/role', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data);
        setRoles(response.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchRoles();
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      const authToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc';
      try {
        const response = await axios.get(
          'http://localhost:4000/api/users/user',
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [refreshPage]);


//posting goal
const addUser = async (e) => {
    e.preventDefault();
    try {
      console.log('State Values:', { username, email,password,role_id});
  
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc';
  
      const response = await axios.post(
        'http://localhost:4000/api/users/user',
        {
          username,
          email,
          password,
          role_id
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        setUserData((prevUsers) => [...prevUsers, response.data]);
        setUserName('');
        setEmail('');
        setPassword('');
        setRoleId('');
        handleShowSuccessModal();
    
        // Use setRefreshPage to trigger a refresh
        setRefreshPage((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    }
  };
    //posting goal




  return (
    <div className='user-container'>
    <div className="User">
        <span className='user-title'>Users</span>
        <button type='submit' className="User-Add-button" onClick={handleShowModal}>
  Add New User
</button>    <div className="User-form">
        <div>&nbsp;</div>
    <table className='user-table'>
        <thead>
            <tr className='user-table-title'>
                <th className='user-table-header'></th>
                <th className='user-table-header'>Name</th>
                <th className='user-table-header'>Role</th>
                <th className='user-table-header'>&nbsp;&nbsp;</th>
                <th className='user-table-header'></th>
            </tr>
        </thead>
            <tbody className='user-table-body'>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td className='user-table-body'>
                    <img className='user-img' src={profile} alt='' />
                  </td>
                  <td className='user-table-body'>{user.username}</td>
                  <td className='user-table-body'>{user.role.name}</td>
                  <td className='user-table-body'>
                    <img  className='user-img' src={Delete} alt='' onClick={() => handleDeleteClick(user.id)} />
                  </td>
                  <td className='user-table-body'>
                    <img className='user-img' src={edit} alt='' onClick={() => handleUpdateClick(user.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TransactionsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="pagination-users" // Add your desired class name here
        />
        </div>
        
      </div>




      <Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Add User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form onSubmit={addUser}>
      <div className="form-group">
        <label htmlFor="goalName">Username:</label>
        <input type="text" className="form-control" id="userName" required
         placeholder="Enter user name" value={username} onChange={(e) => setUserName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="target">Email:</label>
        <input type="email" className="form-control" required
        id="target" placeholder="Enter target" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Password:</label>
        <input type="password" className="form-control" id="startDate" value={password}
        onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
  <label htmlFor="type">Role:</label>
  <select
    className="form-control"
    id="role_id"
    value={role_id}
    onChange={(e) => setRoleId(e.target.value)}
    placeholder='Choose Type'
    required
  >
    <option value="" disabled>Select Type</option>
    {roles.map((role) => (
      <option key={role.id} value={role.id}>
        {role.name}
      </option>
    ))}
  </select>
</div>

      <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Close
    </Button>
    <Button variant="primary"  type='submit'>
      Submit
    </Button>
  </Modal.Footer>
    </form>
    
  </Modal.Body>
 
</Modal>

<Modal show={showUpdateForm} onHide={handleCloseUpdateForm}>
  <Modal.Header closeButton>
    <Modal.Title>Add User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form onSubmit={updateUser}>
      <div className="form-group">
        <label htmlFor="goalName">Username:</label>
        <input type="text" className="form-control" id="userName" required
         placeholder="Enter user name" value={username} onChange={(e) => setUserName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="target">Email:</label>
        <input type="email" className="form-control" required
        id="target" placeholder="Enter target" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Password:</label>
        <input type="password" className="form-control" id="startDate" value={password}
        onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
  <label htmlFor="type">Role:</label>
  <select
    className="form-control"
    id="role_id"
    value={role_id}
    onChange={(e) => setRoleId(e.target.value)}
    placeholder='Choose Type'
    required
  >
    <option value="" disabled>Select Type</option>
    {roles.map((role) => (
      <option key={role.id} value={role.id}>
        {role.name}
      </option>
    ))}
  </select>
</div>

      <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseUpdateForm}>
      Close
    </Button>
    <Button variant="primary"  type='submit'>
      Submit
    </Button>
  </Modal.Footer>
    </form>
    
  </Modal.Body>
 
</Modal>



<Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Goal has been successfully added!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      {confirmDelete && userToDelete && (//Modal for confirmation deletion
        <Modal show={confirmDelete} onHide={handleCancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this user?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete}>
              No
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        
      //Modal for confirmation deletion
      )}

    </div>
  );
}
