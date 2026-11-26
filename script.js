
const materials = [
  {
    id: "default-1",
    category: "Обновления",
    name: "Системные обновления PS4",
    description: "Информация о системных обновлениях PlayStation 4.",
    icon: "↻"
  },
  {
    id: "default-2",
    category: "Прошивки PS4",
    name: "Прошивки PlayStation 4",
    description: "Архив версий системной прошивки PS4.",
    icon: "⚙"
  },
  {
    id: "default-3",
    category: "Приложения",
    name: "Приложения для PS4",
    description: "Подборка приложений и полезных инструментов.",
    icon: "▣"
  },
  {
    id: "default-4",
    category: "Игры для PS4",
    name: "Игровая библиотека PS4",
    description: "Каталог игр с информацией о каждой игре.",
    icon: "🎮"
  },
  {
    id: "default-5",
    category: "Файлы",
    name: "Дополнительные файлы",
    description: "Полезные материалы и дополнительные файлы.",
    icon: "▤"
  }
];

let activeCategory = "Все";

const results = document.getElementById("results");
const searchInput = document.getElementById("search");
const title = document.getElementById("catalog-title");
const empty = document.getElementById("empty");
const backButton = document.getElementById("back-button");

let databaseMaterials = [];

async function loadMaterials() {
  try {
    const { data, error } = await supabaseClient
      .from("materials")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    databaseMaterials = (data || []).map(item => ({
      id: "db-" + item.id,
      category: item.category,
      name: item.title,
      description: item.description || "",
      icon: item.category === "Приложения" ? "▣" :
            item.category === "Игры для PS4" ? "🎮" :
            item.category === "Прошивки PS4" ? "⚙" : "▤",
      download_url: item.download_url,
      image_url: item.image_url
    }));

    renderMaterials();
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    empty.hidden = false;
    empty.textContent = "Не удалось загрузить материалы. Проверь подключение Supabase.";
  }
}

function renderMaterials() {
  const query = searchInput.value.trim().toLowerCase();

  const allMaterials = [...databaseMaterials, ...materials];

  const filtered = allMaterials.filter(item => {
    const categoryMatch =
      activeCategory === "Все" ||
      item.category === activeCategory;

    const searchMatch =
      (item.name + " " + item.description + " " + item.category)
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
    button.textContent = "Открыть →";
    button.addEventListener("click", () => openMaterial(item.id));

    card.append(icon, type, name, description, button);
    results.appendChild(card);
  });

  empty.hidden = filtered.length !== 0;
  if (filtered.length === 0) {
    empty.textContent = "В этом разделе пока нет материалов.";
  }
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
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
}

function showCatalog() {
  document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
}

function showAbout() {
  document.getElementById("about").scrollIntoView({ behavior: "smooth" });
}

function openMaterial(id) {
  const item = [...databaseMaterials, ...materials]
    .find(material => material.id === id);

  if (!item) return;

  document.getElementById("modal-category").textContent =
    item.category.toUpperCase();

  document.getElementById("modal-title").textContent = item.name;
  document.getElementById("modal-description").textContent =
    item.description;

  const downloadArea = document.getElementById("modal-download");
  downloadArea.innerHTML = "";

  if (item.download_url) {
    const link = document.createElement("a");
    link.href = item.download_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Скачать / Открыть материал →";
    link.className = "primary";
    downloadArea.appendChild(link);
  } else {
    downloadArea.textContent = "Ссылки на материалы пока нет.";
  }

  document.getElementById("modal").style.display = "flex";
}

function hideModal() {
  document.getElementById("modal").style.display = "none";
}

function closeModal(event) {
  if (event.target.id === "modal") hideModal();
}

searchInput.addEventListener("input", renderMaterials);

renderMaterials();
loadMaterials();
