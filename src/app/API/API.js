const host = "http://localhost:3001";

async function get(route) {
  const response = await fetch(host + route);
  const ret = await response.json();

  return ret;
}

async function post(route, params) {
  const response = await fetch(host + route, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  return await response.json();
}

export { get, post };
