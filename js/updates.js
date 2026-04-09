fetch('data/updates.json')
  .then(response => response.json())
  .then(data => {
    const allUpdatesContainer = document.getElementById('updates-container');
    const latestUpdateContainer = document.getElementById('latest-update-container');

    function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    function createUpdateCard(update, headingTag = 'h3', dateLabel = 'Posted:') {
      const post = document.createElement('div');
      post.classList.add('card', 'update-post');

      post.innerHTML = `
        <${headingTag}>${update.title}</${headingTag}>
        <p class="update-date"><strong>${dateLabel}</strong> ${formatDate(update.date)}</p>
        <p>${update.content}</p>
      `;

      return post;
    }

    // Render all updates on updates.html
    if (allUpdatesContainer) {
      data.forEach(update => {
        allUpdatesContainer.appendChild(createUpdateCard(update, 'h3', 'Posted:'));
      });
    }

    // Render latest update only on index.html
    if (latestUpdateContainer && data.length > 0) {
      latestUpdateContainer.appendChild(createUpdateCard(data[0], 'h3', 'Last updated:'));
    }
  })
  .catch(error => {
    console.error('Error loading updates:', error);

    const allUpdatesContainer = document.getElementById('updates-container');
    const latestUpdateContainer = document.getElementById('latest-update-container');

    if (allUpdatesContainer) {
      allUpdatesContainer.innerHTML = '<p>Unable to load updates at this time.</p>';
    }

    if (latestUpdateContainer) {
      latestUpdateContainer.innerHTML = '<p>Unable to load the latest update at this time.</p>';
    }
  });