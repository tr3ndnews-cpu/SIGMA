import fetch from "node-fetch";

async function test() {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer ",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-1.5-flash",
      messages: [{ role: "user", content: "hello" }]
    })
  });
  console.log("Empty token:", res.status, await res.text());

  const res2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer testkeyyyyyy",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-1.5-flash",
      messages: [{ role: "user", content: "hello" }]
    })
  });
  console.log("Bad token:", res2.status, await res2.text());
}
test();
