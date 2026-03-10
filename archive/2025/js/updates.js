fetch('data/updates.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('updates-container');

    data.forEach(update => {
      const post = document.createElement('div');
      post.classList.add('update-post');

      post.innerHTML = `
        <h2>${update.title}</h2>
        <p><strong>${new Date(update.date).toLocaleDateString()}</strong></p>
        <p>${update.content}</p>
        <hr />
      `;

      container.appendChild(post);
    });
  })
  .catch(error => {
    console.error('Error loading updates:', error);
    document.getElementById('updates-container').innerHTML = '<p>Unable to load updates at this time.</p>';
  });
