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
  alert('Success!');
  window.location.href = 'http://localhost:3000/employee';
}
