/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert */
const data1 = sessionStorage.getItem('user');
const currentUser1 = JSON.parse(data1);

async function sendReimRequest() {
  const eventType = document.getElementById('eventType');
  const rawCost = document.getElementById('rawCost');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  const location = document.getElementById('location');
  const description = document.getElementById('description');
  const gradingFormat = document.getElementById('gradingFormat');
  const justification = document.getElementById('justification');
  const approverEmail = document.getElementById('approverEmail');
  // const interestedParties = document.getElementById('interestedParties');

  if(!eventType || !rawCost) {
    alert('Missing inputs!');
    return;
  }
  const response = await fetch('http://localhost:3000/employee/reim', {
    body: JSON.stringify({
      id: currentUser1.ID,
      eventType: eventType.value,
      rawCost: rawCost.value,
      startDate: startDate.value,
      endDate: endDate.value,
      location: location.value,
      description: description.value,
      gradingFormat: gradingFormat.value,
      justification: justification.value,
      approverEmail: approverEmail.value,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
  // onst returnedData = await response.json();
  alert(response);
  window.location.href = 'http://localhost:3000/employee';
}

async function getPreApproval() {
  const response = await fetch('http://localhost:3000/employee/reim/json', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
  const obj = await response.json();
  document.getElementById('preApprovals').innerHTML += JSON.stringify(obj.res, 2, '\n');
}

async function preReim() {
  const reimID = document.getElementById('reimID');
  const approve = document.getElementById('approveOrNot');
  const reason = document.getElementById('reason');
  const response = await fetch('http://localhost:3000/employee/prereim/', {
    body: JSON.stringify({
      reimID: reimID.value,
      approve: approve.value,
      reason: reason.value,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  });
  alert(response.toString());
  window.location.href = 'http://localhost:3000/employee';
}

async function postReim() {
  const reimID = document.getElementById('reimID1');
  const approve = document.getElementById('postApprove');
  const reason = document.getElementById('reason1');
  const amount = document.getElementById('finalAmount');
  const response = await fetch('http://localhost:3000/employee/postreim/', {
    body: JSON.stringify({
      reimID: reimID.value,
      approve: approve.value,
      reason: reason.value,
      finalAmount: amount.value,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  });
  alert(response.toString());
  window.location.href = 'http://localhost:3000/employee';
}
