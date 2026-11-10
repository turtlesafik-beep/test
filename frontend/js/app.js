const valueElement = document.querySelector("#counter-value");
const statusElement = document.querySelector("#status");
const decrementButton = document.querySelector("#decrement");
const incrementButton = document.querySelector("#increment");

let requestInProgress = false;

function setBusy(isBusy) {
  requestInProgress = isBusy;
  decrementButton.disabled = isBusy;
  incrementButton.disabled = isBusy;
}

function showStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("error", isError);
}

function renderCounter(value) {
  if (!Number.isInteger(value)) {
    throw new Error("Сервер вернул некорректное значение счётчика");
  }

  valueElement.textContent = String(value);
}

async function requestCounter(path = "/api/counter", method = "GET") {
  if (requestInProgress) return;

  setBusy(true);
  showStatus("Обращаемся к серверу…");

  try {
    const response = await fetch(path, {
      method,
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: HTTP ${response.status}`);
    }

    const data = await response.json();
    renderCounter(data.value);
    showStatus("Данные синхронизированы с сервером");
  } catch (error) {
    showStatus(error.message || "Не удалось связаться с сервером", true);
  } finally {
    setBusy(false);
  }
}

decrementButton.addEventListener("click", () => {
  requestCounter("/api/counter/decrement", "POST");
});

incrementButton.addEventListener("click", () => {
  requestCounter("/api/counter/increment", "POST");
});

requestCounter();
