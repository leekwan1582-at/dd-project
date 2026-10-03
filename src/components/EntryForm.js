import { todayTag } from "../utils/date.js";

export function EntryForm({ onSubmit, onCancel }) {
  const form = document.getElementById("diary-form");
  const cancelBtn = document.getElementById("cancel-edit");
  const legend = document.getElementById("form-legend");

  // Prefill tag with today's date on first load
  form.tag.value = `${todayTag()} `;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const rawTag = fd.get("tag").trim();
    const match = rawTag.match(/^\[dd-\d{4}-\d{2}-\d{2}\]\s*(.*)$/);
    const tag = match
      ? rawTag.match(/^\[dd-\d{4}-\d{2}-\d{2}\]/)[0]
      : todayTag();
    const title = match ? match[1] : rawTag;

    onSubmit({
      tag,
      title,
      symptom: fd.get("symptom"),
      tried: fd.get("tried"),
      rootCause: fd.get("rootCause"),
      fix: fd.get("fix"),
      lesson: fd.get("lesson"),
    });
  });

  cancelBtn.addEventListener("click", onCancel);

  return {
    fill(entry) {
      form.tag.value = `${entry.tag} ${entry.title}`;
      form.symptom.value = entry.symptom;
      form.tried.value = entry.tried;
      form.rootCause.value = entry.root_cause;
      form.fix.value = entry.fix;
      form.lesson.value = entry.lesson;
      cancelBtn.style.display = "inline-block";
      legend.textContent = "Edit Entry";
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    reset() {
      form.reset();
      form.tag.value = `${todayTag()} `;
      cancelBtn.style.display = "none";
      legend.textContent = "New Entry";
    },
  };
}
