// Registers a website in this Umami instance and prints the tracking tag.
// Usage: UMAMI_URL=https://… UMAMI_USER=… UMAMI_PASSWORD=… node ops/add-website.mjs "Name" example.com
const { UMAMI_URL, UMAMI_USER, UMAMI_PASSWORD } = process.env;
const [name, domain] = process.argv.slice(2);

if (!UMAMI_URL || !UMAMI_USER || !UMAMI_PASSWORD || !name || !domain) {
  console.error('Usage: UMAMI_URL=… UMAMI_USER=… UMAMI_PASSWORD=… node ops/add-website.mjs "Name" example.com');
  process.exit(1);
}

const baseUrl = UMAMI_URL.replace(/\/$/, '');

const api = async (path, { token, ...init } = {}) => {
  const response = await fetch(`${baseUrl}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return response.json();
};

const { token } = await api('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username: UMAMI_USER, password: UMAMI_PASSWORD }),
});

const { data: existing } = await api(`/websites?search=${encodeURIComponent(domain)}`, { token });
const website =
  existing.find(site => site.domain === domain) ??
  (await api('/websites', { method: 'POST', token, body: JSON.stringify({ name, domain }) }));

console.log(`${website.name} (${website.domain}) → ${website.id}`);
console.log(`<script defer src="${baseUrl}/script.js" data-website-id="${website.id}"></script>`);
