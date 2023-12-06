
//importing libraries
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios';
// import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import './Goals.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Delete from '../Users/delete.png';
import edit from '../Users/edit.png';
import calendar from '../Goals/calendar.png'



//importing libraries


export default function Goals() {
  //intializing useStates
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [goalData, setGoalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');
  const [goalToUpdate, setGoalToUpdate] = useState(null);
  const { id: goalId } = useParams();
  console.log(goalId)
  //intializing useStates

  //posting goal
  const addGoal = async (e) => {
    e.preventDefault();
    try {
      console.log('State Values:', { name, target, startDate, endDate, type });

      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc';

      const response = await axios.post(
        'http://localhost:4000/api/goals/goal',
        {
          name,
          target: parseInt(target),
          startDate,
          endDate,
          type,
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Assuming response.data contains the newly added goal
        setGoalData((prevGoals) => [...prevGoals, response.data]);
        setName('');
        setTarget(0);
        setStartDate('');
        setEndDate('');
        setType('');
        handleShowSuccessModal();

      }
    } catch (error) {
      console.error(error);
    }
  };
    //posting goal

  //updating goal
  const updateGoal = async (e) => {
    e.preventDefault();

    try {
      if (!goalToUpdate) {
        console.error('Error: Goal ID is not defined.');
        return;
      }

      console.log('State Values:', { name, target, startDate, endDate, type });

      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc';

      const response = await axios.patch(
        `http://localhost:4000/api/goals/goal/${goalToUpdate}`,
        {
          name,
          target: parseInt(target),
          startDate,
          endDate,
          type,
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Assuming response.data contains the updated goal
        const updatedGoal = response.data;

        // Update the existing goal in the array
        setGoalData((prevGoals) =>
          prevGoals.map((goal) =>
            goal.id === updatedGoal.id ? updatedGoal : goal
          )
        );

        setName('');
        setTarget(0);
        setStartDate('');
        setEndDate('');
        setType('');
        handleCloseUpdateForm();
      }
    } catch (error) {
      console.error(error);
    }
  };


//setting the vlue when the user presses on the pen in order to update the goal
  const handleUpdateClick = async (goalId) => {
    try {
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInJvbGUiOiJtb3N0YWZhIiwiaWF0IjoxNzAxNjk1MTE5LCJleHAiOjE3MDQyODcxMTl9.SfCl8C1eWMPRkagT_i0QnNSwr-CWfxSoFB5uovG86Nk';
      const response = await axios.get(`http://localhost:4000/api/goals/goal/${goalId}`, 
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
      );

      if (response.status === 200) {
        console.log(goalId)
        const goal = response.data;

        // Populate the update form with goal data
        setName(goal.name);
        setTarget(goal.target);
        setStartDate(goal.startDate);
        setEndDate(goal.endDate);
        setType(goal.type);
        setGoalToUpdate(goalId)

        // Show the update form
        handleShowUpdateForm();
      }
    } catch (error) {
      console.error('Error fetching goal for update:', error);
    }
  };
  //setting the vlue when the user presses on the pen in order to update the goal

//handeling the delete function
  const handleDeleteClick = (goalId) => {
    setGoalToDelete(goalId);
    setConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setGoalToDelete(null);
    setConfirmDelete(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc'; 
      const response = await axios.delete(`http://localhost:4000/api/goals/goal/${goalToDelete}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('Delete Response:', response);

      if (response.status === 200) {
        setConfirmDelete(false);
        setGoalToDelete(null);
        setGoalData((prevGoals) => prevGoals.filter((goal) => goal.id !== goalToDelete));
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };
  //handeling the delete function

  //setting boolean values for showing the modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);
  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowUpdateForm = () => setShowUpdateForm(true);
  const handleCloseUpdateForm = () => setShowUpdateForm(false);
  //setting boolean values for showing the modal

//Fetching the Goal Data
  useEffect(() => {
    const fetchData = async () => {
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMTU1ODAwOCwiZXhwIjoxNzA0MTUwMDA4fQ.sGRHYaRreOUSbAuyGHqBcZUcbt1Su1Ogxv6PooQ0tnc';       
      try {
        const response = await axios.get('http://localhost:4000/api/goals/goal', 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
        );
        console.log(response.data);
        setGoalData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  //Fetching the Goal Data
  
  const Box = ({ goal,handleDeleteClick,handleUpdateClick}) => (
    <div className="box">
      <h2>{goal.name}</h2>
      <ul className='goals-ul'>
        <li className='goals-li'>{goal.target}</li>
        <div className='goal-img'><img className= 'delete'src={Delete} alt=''  onClick={() => handleDeleteClick(goal.id)}/><br/>
        <img className='edit'src={edit} alt='' onClick={() => handleUpdateClick(goal.id)} /></div>
        <span className='goals-span'>{goal.startDate}</span>&nbsp;&nbsp;<img src={calendar} alt='' />&nbsp;&nbsp;<span className='goals-span'>{goal.endDate}</span>
      </ul>
    </div>
  );

  return (	    
        <div><div className='goal-title'>Goals</div>
        <div className="Add-Goal">
        <Button className="goal-button" variant="primary" onClick={handleShowModal}>
          Add Goal
        </Button>
      </div>
      <div className="goal-container">
      <div className="goal-row">
        {goalData.map((goal) =>(
        <Box
        key={goal.id}
          goal={goal}
          handleDeleteClick={handleDeleteClick}
          handleUpdateClick={handleUpdateClick}
        />
        ))}
        
      </div>
    </div>
      

<Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Add Goal</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form onSubmit={addGoal}>
      <div className="form-group">
        <label htmlFor="goalName">Goal Name:</label>
        <input type="text" className="form-control" id="goalName"
         placeholder="Enter goal name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="target">Target:</label>
        <input type="number" className="form-control" 
        id="target" placeholder="Enter target" value={target} onChange={(e) => setTarget(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" className="form-control" id="startDate" value={startDate}
        onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="endDate">End Date:</label>
        <input type="date" className="form-control" id="endDate"value={endDate}
        onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="type">Type:</label>
         <select className="form-control" id="type"
        value={type} onChange={(e) => setType(e.target.value)} placeholder='Choose Type'>
          <option value="" disabled>Select Type</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
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
      {confirmDelete && goalToDelete && (//Modal for confirmation deletion
        <Modal show={confirmDelete} onHide={handleCancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this goal?</p>
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

      <Modal show={showUpdateForm} onHide={handleCloseUpdateForm}>
        <Modal.Header closeButton>
          <Modal.Title>Update Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={updateGoal}>
          <div className="form-group">
        <label htmlFor="goalName">Goal Name:</label>
        <input type="text" className="form-control" id="goalName"
         placeholder="Enter goal name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="target">Target:</label>
        <input type="number" className="form-control" 
        id="target" placeholder="Enter target" value={target} onChange={(e) => setTarget(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" className="form-control" id="startDate" value={startDate}
        onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="endDate">End Date:</label>
        <input type="date" className="form-control" id="endDate"value={endDate}
        onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="type">Type:</label>
         <select className="form-control" id="type"
        value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="" disabled>Select Type</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select> 

      </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateForm}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

    </div>
  );
}	  