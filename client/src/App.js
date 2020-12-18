import { useState, useRef } from "react";
import AceEditor from "react-ace";
import { SettingsLogo } from "./icons";
import { useOnClickOutside } from "./useOnClickOutside";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-less";
import "ace-builds/src-noconflict/mode-stylus";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import "./App.scss";

const DEFAULT_INPUT = `body {
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

const DEFAULT_OUTPUT = `/* DeclareThatColor was inspired by [Chirag Mehta's name that color tool][1]
   and was initially developed as a [Sublime Text 3 plugin][2].

   By any chance, if you found a bug or have a suggestion, feel free
   to create issues or pull requests on [GitHub][3]. :)

   [1]:https://chir.ag/projects/name-that-color
   [2]:https://packagecontrol.io/packages/DeclareThatColor
   [3]:https://github.com/bertdida/declare-that-color-web
*/`;

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [response, setResponse] = useState({
    result: DEFAULT_OUTPUT,
    settings: {},
  });
  const [settings, setSettings] = useState({
    css_preprocessor: "none",
    type_case: "dash",
  });

  function onSaveSettings(values) {
    setSettings(values);
  }

  function onChangeContent(value) {
    setInput(value);
  }

  async function declareHexCodes() {
    setIsLoading(true);

    const response = await formatContent({ content: input, settings });
    setIsLoading(false);
    setResponse(response);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__nav">
          <Settings values={settings} onSave={onSaveSettings} />
          <button
            type="button"
            className="btn btn--primary"
            onClick={declareHexCodes}
            disabled={isLoading}
          >
            Declare hex codes
          </button>
        </div>

        <a className="header__title" href="/">
          <h1>DeclareThatColor</h1>
        </a>
      </header>

      <div className="main">
        <Editor
          mode="css"
          value={input}
          onChange={onChangeContent}
          readOnly={isLoading}
          focus={true}
          name="input"
        />
        <Editor
          mode={response.settings.css_preprocessor || "css"}
          value={isLoading ? "⌛ transpiling..." : response.result}
          readOnly={true}
          highlightActiveLine={false}
          name="ouput"
        />
      </div>
    </div>
  );
}

function Editor(props) {
  return (
    <AceEditor
      width="100%"
      height="100%"
      theme="solarized_dark"
      fontSize={16}
      wrapEnabled={true}
      showPrintMargin={false}
      setOptions={{
        enableLiveAutocompletion: true,
        showLineNumbers: true,
        useWorker: false,
      }}
      {...props}
    />
  );
}

function Settings(props) {
  const [showForm, setShowForm] = useState(false);

  function onShow() {
    setShowForm(true);
  }

  function onHide() {
    setShowForm(false);
  }

  return (
    <div className="settings">
      <button
        type="button"
        aria-label="settings"
        className="btn btn--settings"
        onClick={onShow}
      >
        <SettingsLogo />
      </button>

      {showForm && <SettingsForm onHide={onHide} {...props} />}
    </div>
  );
}

function SettingsForm({ onHide, values: valuesProp, onSave }) {
  const form = useRef();
  const [values, setValues] = useState(valuesProp);
  const { css_preprocessor, type_case } = values;

  useOnClickOutside(form, onHide);

  function onChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function onSubmit(event) {
    event.preventDefault();
    onSave(values);
    onHide();
  }

  return (
    <form ref={form} className="settings__form form" onSubmit={onSubmit}>
      <div className="form__body">
        <div className="form__group">
          <label className="form__label" htmlFor="css_preprocessor">
            CSS Preprocessor
          </label>
          <select
            className="form__select"
            name="css_preprocessor"
            id="css_preprocessor"
            value={css_preprocessor || "none"}
            onChange={onChange}
          >
            <option value="none">None</option>
            <option value="scss">SCSS/Sass</option>
            <option value="less">Less</option>
            <option value="stylus">Stylus</option>
          </select>
        </div>

        <div className="form__group">
          <label className="form__label" htmlFor="type_case">
            Type Case
          </label>
          <select
            className="form__select"
            name="type_case"
            id="type_case"
            value={type_case}
            onChange={onChange}
          >
            <option value="dash">Dash</option>
            <option value="camel">Camel</option>
            <option value="pascal">Pascal</option>
            <option value="snake">Snake</option>
            <option value="screaming_snake">Screaming Snake</option>
          </select>
        </div>
      </div>

      <div className="form__footer">
        <button type="button" className="btn" onClick={onHide}>
          Cancel
        </button>
        <button type="submit" className="btn btn--save">
          Save
        </button>
      </div>
    </form>
  );
}

async function formatContent({ content, settings = {} }) {
  if (settings.css_preprocessor === "none") {
    settings.css_preprocessor = null;
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, settings }),
  };

  const response = await fetch("/api/formatter", requestOptions);
  return response.json();
}
