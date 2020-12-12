import { useState } from "react";

async function formatContent(content) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  };

  const response = await fetch("/formatter", requestOptions);
  return response.json();
}

export function App() {
  const [content, setContent] = useState(`body {
    background-color: #f5f5f5;
    color: #333;
}`);

  async function onSubmit(event) {
    event.preventDefault();

    const { result } = await formatContent(content);
    console.log(result);
    setContent(result);
  }

  function onChange(event) {
    setContent(event.target.value);
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Declare Hex Codes</button>
      <div>
        <textarea value={content} onChange={onChange} rows={30} cols={60} />
      </div>
    </form>
  );
}
