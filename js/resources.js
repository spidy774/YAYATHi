/* ============================================================
   RESOURCES PAGE — category filter
   ============================================================ */

function renderResources(category) {
  const grid = document.getElementById("resources-grid");
  if (!grid) return;

  const visible =
    category === "All"
      ? SCOPE_RESOURCES
      : SCOPE_RESOURCES.filter((r) => r.category === category);

  grid.innerHTML = visible.length
    ? visible.map(resourceCardHTML).join("")
    : `<div class="empty-state">No resources in this category yet.</div>`;

  grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));

  /* Re-attach resource card tilt (main.js handles new cards via event delegation) */
  if (typeof refreshScrollReveals === "function") refreshScrollReveals();
}

function initResourceFilter() {
  const bar = document.getElementById("category-filter");
  if (!bar) return;

  bar.innerHTML = RESOURCE_CATEGORIES.map(
    (cat, i) =>
      `<button class="chip" data-category="${cat}" aria-pressed="${i === 0}">${cat}</button>`
  ).join("");

  const chips = bar.querySelectorAll(".chip");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      renderResources(chip.dataset.category);
      try { history.replaceState(null, "", `?category=${encodeURIComponent(chip.dataset.category)}`); }
      catch (_) { /* Safari file:// safety */ }
    });
  });

  const params = new URLSearchParams(location.search);
  const initial = params.get("category") || "All";
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.category === initial)));
  renderResources(initial);
}

document.addEventListener("DOMContentLoaded", initResourceFilter);
