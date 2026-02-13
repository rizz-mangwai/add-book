class Place {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.name = data.name?.trim() || '';
    this.country = data.country?.trim() || '';
    this.visit = data.visit?.trim() || '';
    this.landmarks = data.landmarks?.trim() || '';
    this.notes = data.notes?.trim() || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  get displayName() {
    return this.name + (this.country ? ` (${this.country})` : '');
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      country: this.country,
      visit: this.visit,
      landmarks: this.landmarks,
      notes: this.notes,
      createdAt: this.createdAt
    };
  }

  static fromJSON(json) {
    return new Place(json);
  }
}

const places = loadPlaces();
let selectedId = null;

const elements = {
  form: document.getElementById('placeForm'),
  nameInput: document.getElementById('placeName'),
  countryInput: document.getElementById('country'),
  visitInput: document.getElementById('visitYear'),
  landmarksInput: document.getElementById('landmarks'),
  notesInput: document.getElementById('notes'),
  list: document.getElementById('placeList'),
  detailView: document.getElementById('detailView')
};


function loadPlaces() {
  try {
    const data = localStorage.getItem('travelPlaces');
    if (!data) return [];
    return JSON.parse(data).map(Place.fromJSON);
  } catch (e) {
    console.error('Failed to load places', e);
    return [];
  }
}

function savePlaces() {
  localStorage.setItem('travelPlaces', JSON.stringify(places));
}

function renderList() {
  elements.list.innerHTML = '';

  if (places.length === 0) {
    const li = document.createElement('li');
    li.className = 'place-item';
    li.textContent = 'No places saved yet... start exploring!';
    li.style.color = '#868e96';
    elements.list.appendChild(li);
    return;
  }
  places.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  places.forEach(place => {
    const li = document.createElement('li');
    li.className = 'place-item';
    li.textContent = place.displayName;
    li.dataset.id = place.id;

    if (place.id === selectedId) li.classList.add('active');

    li.addEventListener('click', () => {
      selectedId = place.id;
      renderList();
      renderDetail(place);
    });

    elements.list.appendChild(li);
  });
}

function renderDetail(place) {
  if (!place) {
    elements.detailView.innerHTML = `
      <div class="empty-state">
        ← Select a place from the list to see details
      </div>`;
    return;
  }

  let html = `
    <div class="detail-card">
      <div class="detail-title">${place.name}</div>
      <div class="detail-meta">
        ${place.country ? place.country + ' • ' : ''}
        ${place.visit || 'Date not specified'}
      </div>

      ${place.landmarks ? `
        <div class="detail-section">
          <h4>Landmarks / Highlights</h4>
          <p style="white-space: pre-line;">${place.landmarks}</p>
        </div>
      ` : ''}

      ${place.notes ? `
        <div class="detail-section">
          <h4>Notes & Memories</h4>
          <p style="white-space: pre-line;">${place.notes}</p>
        </div>
      ` : ''}

      <div class="detail-section" style="font-size:0.9rem; color:#868e96; margin-top:2rem;">
        Added: ${new Date(place.createdAt).toLocaleDateString()}
      </div>
    </div>
  `;

  elements.detailView.innerHTML = html;
}

function clearForm() {
  elements.nameInput.value = '';
  elements.countryInput.value = '';
  elements.visitInput.value = '';
  elements.landmarksInput.value = '';
  elements.notesInput.value = '';
}
elements.form.addEventListener('submit', e => {
  e.preventDefault();

  const newPlace = new Place({
    name: elements.nameInput.value,
    country: elements.countryInput.value,
    visit: elements.visitInput.value,
    landmarks: elements.landmarksInput.value,
    notes: elements.notesInput.value
  });

  if (!newPlace.name) {
    alert('Please enter a place name');
    return;
  }

  places.push(newPlace);
  savePlaces();
  renderList();

  selectedId = newPlace.id;
  renderDetail(newPlace);
  clearForm();
});

// Initial render
renderList();

if (places.length > 0) {
  selectedId = places[0].id;
  renderDetail(places[0]);
  renderList();
}
