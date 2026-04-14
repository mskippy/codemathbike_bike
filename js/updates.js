fetch('data/updates.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('updates-container');

    if (!data || data.length === 0) {
      container.innerHTML = '<p>No updates available at this time.</p>';
      return;
    }

    container.innerHTML = '';

    data.slice(0, 2).forEach((update, index) => {
      const post = document.createElement('div');
      post.classList.add('update-post');

      if (index === 0) {
        post.classList.add('latest-update-card');
      };

      post.innerHTML = `
        <h2>${update.title}</h2>
        <p><strong>${new Date(update.date).toLocaleDateString()}</strong></p>
        <div>${update.content}</div>
        ${index === 0 ? '<p><a class="results-link" href="/results/division_results.html">View Results</a></p>' : ''}
      `;

      container.appendChild(post);
    });
  })
  .catch(error => {
    console.error('Error loading updates:', error);
    document.getElementById('updates-container').innerHTML = '<p>Unable to load updates at this time.</p>';
  });