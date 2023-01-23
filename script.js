customElements.define('al-comment', class extends HTMLElement {
  constructor() {
    super();
    const template = document.querySelector('template').content;
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.cloneNode(true));
  }
});

async function updateComments() {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const feed = document.querySelector('.feed-content');
  feed.innerHTML = '';

  // Google Sheets API returns a 2D array of the requested range
  const values = await fetch('/comments')
    .then(r => r.json())
    .then(obj => obj['values']);

  if (values === undefined) {
    feed.insertAdjacentHTML('beforeend', '<p>No comments in the last 24 hours.</p>');
    return;
  }

  values
    .map(r => ({
      timestamp: new Date(r[0]),
      name: r[1],
      comment: r[2]
    }))
    .filter(r => r.timestamp > Date.now() - ONE_DAY)
    .reverse()
    .forEach(r => {
      const e = document.createElement('al-comment');
      e.insertAdjacentHTML('beforeend', `<span slot="name">${r.name}</slot>`);
      e.insertAdjacentHTML('beforeend', `<span slot="timestamp">${r.timestamp.toLocaleString()}</slot>`);
      e.insertAdjacentHTML('beforeend', `<span slot="comment">${r.comment}</slot>`);
      feed.append(e);
    });

  if (feed.innerHTML === '') {
    feed.insertAdjacentHTML('beforeend', '<p>No comments in the last 24 hours.</p>');
  }
}

document.querySelector('form').addEventListener('submit', async e => {
  e.preventDefault();
  const formUrl = e.target.action;
  const payload = new URLSearchParams(new FormData(e.target));

  // Assume the submission was successful. There's no way to see the response.
  await fetch(formUrl, {
    method: 'POST',
    body: payload,
    mode: 'no-cors'
  });

  const input = document.querySelector('input');
  const textarea = document.querySelector('textarea');
  input.value = '';
  textarea.value = '';

  updateComments();
});

updateComments();