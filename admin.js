const statusBox = document.getElementById("status");
const loginSection = document.getElementById("login");
const panel = document.getElementById("panel");

async function checkAdmin() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    loginSection.style.display = "block";
    panel.style.display = "none";
    return;
  }

  const { data, error } = await supabaseClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    statusBox.textContent = "У этого аккаунта нет прав администратора.";
    await supabaseClient.auth.signOut();
    return;
  }

  loginSection.style.display = "none";
  panel.style.display = "block";
  statusBox.textContent = "Добро пожаловать!";
}

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    statusBox.textContent = "Ошибка входа: " + error.message;
    return;
  }

  await checkAdmin();
};

document.getElementById("addBtn").onclick = async () => {
  const material = {
    title: document.getElementById("title").value.trim(),
    category: document.getElementById("category").value,
    description: document.getElementById("description").value.trim(),
    image_url: document.getElementById("image").value.trim(),
    download_url: document.getElementById("download").value.trim()
  };

  if (!material.title || !material.download_url) {
    statusBox.textContent = "Заполни название и ссылку на скачивание.";
    return;
  }

  const { error } = await supabaseClient
    .from("materials")
    .insert(material);

  if (error) {
    statusBox.textContent = "Ошибка: " + error.message;
    return;
  }

  statusBox.textContent = "Материал успешно добавлен!";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("image").value = "";
  document.getElementById("download").value = "";
};

document.getElementById("logoutBtn").onclick = async () => {
  await supabaseClient.auth.signOut();
  panel.style.display = "none";
  loginSection.style.display = "block";
  statusBox.textContent = "Ты вышел из аккаунта.";
};

checkAdmin();
