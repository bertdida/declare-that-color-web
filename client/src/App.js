import { useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-less";
import "ace-builds/src-noconflict/mode-stylus";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const formStatus = {
  LOADING: "loading",
  SUBMITTED: "submitted",
};

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
  const [status, setStatus] = useState();
  const [content, setContent] = useState(defaultContent);
  const [settings, setSettings] = useState({
    css_preprocessor: "",
    type_case: "dash",
    color_name_prefix: "",
    css_selector: ":root",
    use_tabs: false,
  });

  async function onSubmit(event) {
    event.preventDefault();
    setStatus(formStatus.LOADING);

    const { result } = await formatContent({ content, settings });
    setStatus(formStatus.SUBMITTED);
    setContent(result);
  }

  function onChangeContent(value) {
    setContent(value);
  }

  function onChangeSettings(event) {
    const { name, value, checked, type } = event.target;
    setSettings({ ...settings, [name]: type === "checkbox" ? checked : value });
  }

  const isLoading = status === formStatus.LOADING;
  const isSubmitted = status === formStatus.SUBMITTED;
  const editorMode = (isSubmitted ? settings.css_preprocessor : "css") || "css";

  return (
    <div>
      <form onSubmit={onSubmit}>
        <button type="submit">Declare Hex Codes</button>

        <AceEditor
          mode={editorMode}
          theme="monokai"
          onChange={onChangeContent}
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

        <fieldset>
          <legend>Settings</legend>
          <div>
            <label htmlFor="css_preprocessor">CSS Preprocessor</label>
            <select
              onChange={onChangeSettings}
              value={settings.css_preprocessor}
              id="css_preprocessor"
              name="css_preprocessor"
            >
              <option value="">None</option>
              <option value="scss">SCSS/Sass</option>
              <option value="less">Less</option>
              <option value="stylus">Stylus</option>
            </select>
          </div>

          <div>
            <label htmlFor="type_case">Type Case</label>
            <select
              onChange={onChangeSettings}
              value={settings.type_case}
              id="type_case"
              name="type_case"
            >
              <option value="dash">Dash</option>
              <option value="camel">Camel</option>
              <option value="pascal">Pascal</option>
              <option value="snake">Snake</option>
              <option value="screaming_snake">Screaming Snake</option>
            </select>
          </div>

          <div>
            <label htmlFor="color_name_prefix">Color Name Prefix</label>
            <input
              onChange={onChangeSettings}
              value={settings.color_name_prefix}
              id="color_name_prefix"
              name="color_name_prefix"
              type="text"
            />
          </div>

          <div>
            <label htmlFor="css_selector">CSS Selector</label>
            <input
              onChange={onChangeSettings}
              value={settings.css_selector}
              id="css_selector"
              name="css_selector"
              type="text"
            />
          </div>

          <div>
            <label htmlFor="use_tabs">Use Tabs</label>
            <input
              onChange={onChangeSettings}
              value={settings.use_tabs}
              id="use_tabs"
              type="checkbox"
              name="use_tabs"
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
}

async function formatContent(payload) {
  if (payload.settings.css_preprocessor === "") {
    payload.settings.css_preprocessor = null;
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  const response = await fetch("/formatter", requestOptions);
  return response.json();
}
