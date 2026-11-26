
const materials = [
  {
    id: 1,
    category: "Обновления",
    name: "Системные обновления PS4",
    description: "Информация о системных обновлениях PlayStation 4.",
    icon: "↻",
    version: "Каталог версий"
  },
  {
    id: 2,
    category: "Прошивки PS4",
    name: "Прошивки PlayStation 4",
    description: "Архив версий системной прошивки PS4.",
    icon: "⚙",
    version: "Каталог версий"
  },
  {
    id: 3,
    category: "Приложения",
    name: "Приложения для PS4",
    description: "Подборка приложений и полезных инструментов.",
    icon: "▣",
    version: "Каталог приложений"
  },
  {
    id: 4,
    category: "Игры для PS4",
    name: "Игровая библиотека PS4",
    description: "Каталог игр с информацией о каждой игре.",
    icon: "🎮",
    version: "Каталог игр"
  },
  {
    id: 5,
    category: "Файлы",
    name: "Дополнительные файлы",
    description: "Полезные материалы и дополнительные файлы.",
    icon: "▤",
    version: "Каталог файлов"
  }
];

let activeCategory = "Все";

const results = document.getElementById("results");
const searchInput = document.getElementById("search");
const title = document.getElementById("catalog-title");
const empty = document.getElementById("empty");
const backButton = document.getElementById("back-button");

function renderMaterials() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = materials.filter(item => {
    const categoryMatch =
      activeCategory === "Все" ||
      item.category === activeCategory;

    const searchMatch =
      (item.name + " " + item.description + " " +
       item.category + " " + item.version)
      .toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  results.innerHTML = "";

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";

    const icon = document.createElement("div");
    icon.className = "card-icon";
    icon.textContent = item.icon;

    const type = document.createElement("div");
    type.className = "card-type";
    type.textContent = item.category.toUpperCase();

    const name = document.createElement("h3");
    name.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    const button = document.createElement("button");
    button.textContent = "Открыть раздел →";
    button.addEventListener("click", () => openMaterial(item.id));

    card.append(icon, type, name, description, button);
    results.appendChild(card);
  });

  empty.hidden = filtered.length !== 0;
}

function selectCategory(category) {
  activeCategory = category;
  title.textContent = category;
  backButton.hidden = false;
  searchInput.value = "";

  renderMaterials();
  document.getElementById("catalog").scrollIntoView({
    behavior: "smooth"
  });
}

function resetCategory() {
  activeCategory = "Все";
  title.textContent = "Все материалы";
  backButton.hidden = true;
  searchInput.value = "";
  renderMaterials();
}

function showHome() {
  document.getElementById("home").scrollIntoView({
    behavior: "smooth"
  });
}

function showCatalog() {
  document.getElementById("catalog").scrollIntoView({
    behavior: "smooth"
  });
}

function showAbout() {
  document.getElementById("about").scrollIntoView({
    behavior: "smooth"
  });
}

function openMaterial(id) {
  const item = materials.find(material => material.id === id);

  if (!item) return;

  document.getElementById("modal-category").textContent =
    item.category.toUpperCase();

  document.getElementById("modal-title").textContent =
    item.name;

  document.getElementById("modal-description").textContent =
    item.description + " Здесь будет список доступных версий и подробная информация.";

  const downloadArea = document.getElementById("modal-download");

  downloadArea.innerHTML = `
    <div class="modal-note">
      Материалы этого раздела ещё не добавлены.
      Ссылки на загрузки появятся после проверки файлов.
    </div>
  `;

  document.getElementById("modal").style.display = "flex";
}

function hideModal() {
  document.getElementById("modal").style.display = "none";
}

function closeModal(event) {
  if (event.target.id === "modal") {
    hideModal();
  }
}

searchInput.addEventListener("input", renderMaterials);

renderMaterials();
    
