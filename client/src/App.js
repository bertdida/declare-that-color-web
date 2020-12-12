import { useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const defaultContent = `body {
  height: 100vh;
  width: 100vw;
  background-image: linear-gradient(
    to right top,
    #d16ba5,
    #c777b9,
    #ba83ca,
    #aa8fd8,
    #9a9ae1,
    #8aa7ec,
    #79b3f4,
    #69bff8,
    #52cffe,
    #41dfff,
    #46eefa,
    #5ffbf1
  );
}`;

export function App() {
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const { result } = await formatContent(content);
    setIsLoading(false);
    setContent(result);
  }

  function onChange(value) {
    setContent(value);
  }

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Declare Hex Codes</button>
      <div>
        <AceEditor
          mode="css"
          theme="monokai"
          onChange={onChange}
          fontSize={14}
          value={isLoading ? "⌛ transpiling..." : content}
          readOnly={isLoading}
          focus={true}
          setOptions={{
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            useWorker: false,
          }}
        />
      </div>
    </form>
  );
}

async function formatContent(content) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  };

  const response = await fetch("/formatter", requestOptions);
  return response.json();
}
