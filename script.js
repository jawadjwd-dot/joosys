const card = document.querySelector("#business-card");
const flipButton = document.querySelector("#flip-card");
const flipLabel = document.querySelector("#flip-label");
const downloadButton = document.querySelector("#download-vcard");
const shareButton = document.querySelector("#share-card");
const shareStatus = document.querySelector("#share-status");
const toast = document.querySelector("#toast");
let toastTimer;

function setCardFlipped(nextValue) {
  card.classList.toggle("is-flipped", nextValue);
  card.setAttribute("aria-pressed", String(nextValue));
  flipLabel.textContent = nextValue ? "Voir le recto" : "Voir le verso";
}

function toggleCard(event) {
  if (event.target.closest("a")) return;
  setCardFlipped(!card.classList.contains("is-flipped"));
}

card.addEventListener("click", toggleCard);
card.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleCard(event);
  }
});

flipButton.addEventListener("click", () => {
  setCardFlipped(!card.classList.contains("is-flipped"));
  card.focus({ preventScroll: true });
});

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

downloadButton.addEventListener("click", () => {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:JooSys",
    "ORG:JooSys",
    "TITLE:Solutions de gestion et d'encaissement",
    "TEL;TYPE=WORK,VOICE:+212660602277",
    "EMAIL;TYPE=WORK:joosyscontact@gmail.com",
    "URL:https://www.instagram.com/joosys.ma/",
    "X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/joosys.ma/",
    "NOTE:Assistance et solutions JooSys",
    "END:VCARD",
  ].join("\r\n");
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "JooSys.vcf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Contact JooSys téléchargé");
});

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: "JooSys — Carte de visite",
    text: "Coordonnées de JooSys",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = "Carte partagée";
    } else {
      await navigator.clipboard.writeText(window.location.href);
      shareStatus.textContent = "Lien copié";
      showToast("Lien copié dans le presse-papiers");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      shareStatus.textContent = "Partage indisponible";
      showToast("Impossible de partager le lien");
    }
  }

  window.setTimeout(() => {
    shareStatus.textContent = "Envoyer le lien";
  }, 2600);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
