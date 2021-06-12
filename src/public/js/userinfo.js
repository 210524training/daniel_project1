const data = sessionStorage.getItem('user');
if(data) {
  const currentUser = JSON.parse(data);
  if(currentUser) {
    const stuff = `
      <div>
        <p>logged in as ${currentUser.ID}</p>
      </div>`;
    const body = document.getElementsByTagName('body')[0];
    body.innerHTML += stuff;
  } else {
    console.log('Not Logged in!');
  }
} else {
  console.log('Not Logged in!');
}
