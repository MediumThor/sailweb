import liveData from "./liveData";

const channel = new BroadcastChannel("saildash-data");

export function syncValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  liveData.set({ [key]: value });
  channel.postMessage({ key, value });
}

export function listenForValue(key) {
  const apply = (val) => {
    const parsed = typeof val === "string" ? JSON.parse(val) : val;
    console.log("🔄 SYNCED:", key, parsed);
    liveData.set({ [key]: parsed });
  };

  const existing = localStorage.getItem(key);
  if (existing) apply(existing);

  window.addEventListener("storage", (e) => {
    if (e.key === key) apply(e.newValue);
  });

  channel.addEventListener("message", (e) => {
    if (e.data?.key === key) apply(e.data.value);
  });
}
