// POST /api/contact — the contact form's only backend.
//
// Checks the Cloudflare Turnstile token, then relays the message to Formspree.
// The Formspree form id is a secret here (FORMSPREE_ID) and appears nowhere in
// the pages, so there is no endpoint for a spam bot to harvest and post to
// directly. Secrets: TURNSTILE_SECRET, FORMSPREE_ID (Pages → Settings).

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const LIMITS = { name: 200, email: 320, message: 10000 };

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: 'bad_request' });
  }
  if (!data || typeof data !== 'object') return json(400, { ok: false, error: 'bad_request' });

  // Honeypot: a filled field means a bot. Answer as if it worked.
  if (data._gotcha) return json(200, { ok: true });

  const fields = {};
  for (const key of Object.keys(LIMITS)) {
    const value = typeof data[key] === 'string' ? data[key].trim() : '';
    if (!value || value.length > LIMITS[key]) return json(400, { ok: false, error: 'invalid_' + key });
    fields[key] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return json(400, { ok: false, error: 'invalid_email' });

  if (!env.TURNSTILE_SECRET || !env.FORMSPREE_ID) return json(500, { ok: false, error: 'not_configured' });

  const token = typeof data.token === 'string' ? data.token : '';
  if (!token) return json(403, { ok: false, error: 'captcha' });

  const check = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) check.set('remoteip', ip);
  let outcome;
  try {
    outcome = await (await fetch(SITEVERIFY, { method: 'POST', body: check })).json();
  } catch {
    return json(502, { ok: false, error: 'captcha_unavailable' });
  }
  if (!outcome.success) return json(403, { ok: false, error: 'captcha' });

  let relay;
  try {
    relay = await fetch('https://formspree.io/f/' + env.FORMSPREE_ID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': request.headers.get('Referer') || new URL(request.url).origin + '/'
      },
      body: JSON.stringify(fields)
    });
  } catch {
    return json(502, { ok: false, error: 'relay_failed' });
  }
  if (!relay.ok) return json(502, { ok: false, error: 'relay_failed' });

  return json(200, { ok: true });
}
