import { escapeHtml } from "../utils/escapeHtml.js";
import { formatTimestamp } from "../utils/date.js";

export function renderEntries(container, entries, { onEdit, onDelete }) {
  if (!entries.length) {
    container.innerHTML = "<p>No entries yet.</p>";
    return;
  }

  container.innerHTML = entries
    .map(
      (e) => `
    <article class="entry" data-id="${e.id}">
      <header>
        <h3>${escapeHtml(e.tag)} ${escapeHtml(e.title)}</h3>
        <small>${formatTimestamp(e.created_at)}</small>
      </header>
      <dl>
        <dt>Symptom</dt><dd>${escapeHtml(e.symptom)}</dd>
        <dt>Tried</dt><dd>${escapeHtml(e.tried)}</dd>
        <dt>Root cause</dt><dd>${escapeHtml(e.root_cause)}</dd>
        <dt>Fix</dt><dd>${escapeHtml(e.fix)}</dd>
        <dt>Lesson</dt><dd>${escapeHtml(e.lesson)}</dd>
      </dl>
      <div class="actions">
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </div>
    </article>`,
    )
    .join("");

  container
    .querySelectorAll('button[data-action="edit"]')
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        onEdit(btn.closest(".entry").dataset.id),
      ),
    );
  container
    .querySelectorAll('button[data-action="delete"]')
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        onDelete(btn.closest(".entry").dataset.id),
      ),
    );
}
