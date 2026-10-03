import { addEntry, getAllEntries, updateEntry, deleteEntry, searchEntries } from './diary.js';

const form = document.getElementById('diary-form');
const entriesContainer = document.getElementById('entries');
const searchInput = document.getElementById('search-input');
const cancelEditBtn = document.getElementById('cancel-edit');
const formFieldset = document.getElementById('form-fieldset');

let editingId = null;

// Render entries
function renderEntries(entries) {
  if (entries.length === 0) {
    entriesContainer.innerHTML = '<p>No entries yet.</p>';
    return;
  }
  entriesContainer.innerHTML = entries
    .map(
      (e) => `
    <div class="entry" data-id="${e.id}">
      <h3>${escapeHtml(e.tag)} – ${escapeHtml(e.title)}</h3>
      <div class="field"><strong>Symptom:</strong> ${escapeHtml(e.symptom)}</div>
      <div class="field"><strong>Tried:</strong> ${escapeHtml(e.tried)}</div>
      <div class="field"><strong>Root cause:</strong> ${escapeHtml(e.root_cause)}</div>
      <div class="field"><strong>Fix:</strong> ${escapeHtml(e.fix)}</div>
      <div class="field"><strong>Lesson:</strong> ${escapeHtml(e.lesson)}</div>
      <div class="actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>`
    )
    .join('');

  // Attach listeners
  document.querySelectorAll('.edit-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => startEdit(e.target.closest('.entry').dataset.id))
  );
  document.querySelectorAll('.delete-btn').forEach((btn) =>
    btn.addEventListener('click', (e) => handleDelete(e.target.closest('.entry').dataset.id))
  );
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// Load all entries
async function loadEntries() {
  try {
    const entries = await getAllEntries();
    renderEntries(entries);
  } catch (err) {
    console.error(err);
    entriesContainer.innerHTML = '<p>Error loading entries.</p>';
  }
}

// Handle form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const entry = {
    tag: formData.get('tag'),
    title: formData.get('tag').replace(/^\[.*?\]\s*/, '') || formData.get('tag'),
    symptom: formData.get('symptom'),
    tried: formData.get('tried'),
    rootCause: formData.get('rootCause'),
    fix: formData.get('fix'),
    lesson: formData.get('lesson'),
  };

  try {
    if (editingId) {
      await updateEntry(editingId, {
        tag: entry.tag,
        title: entry.title,
        symptom: entry.symptom,
        tried: entry.tried,
        root_cause: entry.rootCause,
        fix: entry.fix,
        lesson: entry.lesson,
      });
      cancelEdit();
    } else {
      await addEntry(entry);
    }
    form.reset();
    await loadEntries();
  } catch (err) {
    alert('Error saving entry: ' + err.message);
  }
});

// Start editing
async function startEdit(id) {
  const entries = await getAllEntries();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;
  editingId = id;
  form.tag.value = entry.tag;
  form.symptom.value = entry.symptom;
  form.tried.value = entry.tried;
  form.rootCause.value = entry.root_cause;
  form.fix.value = entry.fix;
  form.lesson.value = entry.lesson;
  cancelEditBtn.style.display = 'inline-block';
  formFieldset.querySelector('legend').textContent = 'Edit Entry';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  editingId = null;
  form.reset();
  cancelEditBtn.style.display = 'none';
  formFieldset.querySelector('legend').textContent = 'New Entry';
}

cancelEditBtn.addEventListener('click', cancelEdit);

// Delete
async function handleDelete(id) {
  if (!confirm('Delete this entry?')) return;
  try {
    await deleteEntry(id);
    await loadEntries();
  } catch (err) {
    alert('Error deleting entry: ' + err.message);
  }
}

// Search
searchInput.addEventListener('input', async () => {
  const q = searchInput.value.trim();
  if (!q) {
    await loadEntries();
    return;
  }
  try {
    const results = await searchEntries(q);
    renderEntries(results);
  } catch (err) {
    console.error(err);
  }
});

// Initial load
loadEntries();