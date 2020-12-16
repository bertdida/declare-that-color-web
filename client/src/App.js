import { useState } from "react";
import AceEditor from "react-ace";
import * as antd from "antd";
import { SettingOutlined } from "@ant-design/icons";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-less";
import "ace-builds/src-noconflict/mode-stylus";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import "antd/dist/antd.css";
import "./App.css";

const {
  Form,
  Button,
  Select,
  Input,
  Tooltip,
  Modal,
  Row,
  Col,
  Layout,
  Space,
  Typography,
} = antd;

const { Option } = Select;
const { Header, Content } = Layout;
const { Title } = Typography;

const FORM_STATUS = {
  LOADING: "loading",
  SUBMITTED: "submitted",
};

const DEFAULT_CONTENT = `body {
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
  const [formStatus, setFormStatus] = useState();
  const [input, setInput] = useState(DEFAULT_CONTENT);
  const [response, setResponse] = useState({ result: "", settings: {} });
  const [settings, setSettings] = useState();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  async function declareHexCodes() {
    setFormStatus(FORM_STATUS.LOADING);

    const response = await formatContent({ content: input, settings });
    setFormStatus(FORM_STATUS.SUBMITTED);
    setResponse(response);
  }

  function onChangeContent(value) {
    setInput(value);
  }

  function showSettings() {
    setIsSettingsVisible(true);
  }

  function hideSettings() {
    setIsSettingsVisible(false);
  }

  function onSaveSettings(values) {
    setSettings(values);
    hideSettings();
  }

  const isLoading = formStatus === FORM_STATUS.LOADING;

  return (
    <Layout className="app">
      <Header className="header">
        <a href="/">
          <Title className="header__title">DeclareThatColor</Title>
        </a>

        <Space>
          <Button type="primary" onClick={declareHexCodes}>
            Declare Hex Codes
          </Button>

          <Tooltip title="settings">
            <Button
              shape="circle"
              onClick={showSettings}
              icon={<SettingOutlined />}
            />
          </Tooltip>
        </Space>
      </Header>
      <Content>
        <Row className="editorContainer">
          <Col span={12}>
            <Editor
              mode="css"
              value={input}
              onChange={onChangeContent}
              readOnly={isLoading}
              focus={true}
            />
          </Col>
          <Col span={12}>
            <Editor
              mode={response.settings.css_preprocessor || "css"}
              value={isLoading ? "⌛ transpiling..." : response.result}
              readOnly={true}
              highlightActiveLine={false}
            />
          </Col>
        </Row>

        <SettingsForm
          visible={isSettingsVisible}
          onOk={onSaveSettings}
          onCancel={hideSettings}
        />
      </Content>
    </Layout>
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

function SettingsForm({ visible, onCancel, onOk: onOkProp }) {
  const [form] = Form.useForm();

  function onOk() {
    onOkProp(form.getFieldsValue());
  }

  const initialValues = {
    type_case: "dash",
    css_preprocessor: "",
    color_name_prefix: "",
  };

  return (
    <Modal
      title="Settings"
      okText="Save"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
        name="settings"
      >
        <Form.Item name="css_preprocessor" label="CSS Preprocessor">
          <Select>
            <Option value="">None</Option>
            <Option value="scss">SCSS/Sass</Option>
            <Option value="less">Less</Option>
            <Option value="stylus">Stylus</Option>
          </Select>
        </Form.Item>

        <Form.Item name="type_case" label="Type Case">
          <Select>
            <Option value="dash">Dash</Option>
            <Option value="camel">Camel</Option>
            <Option value="pascal">Pascal</Option>
            <Option value="snake">Snake</Option>
            <Option value="screaming_snake">Screaming Snake</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Color Name Prefix" name="color_name_prefix">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

async function formatContent({ content, settings = {} }) {
  if (settings.css_preprocessor === "") {
    settings.css_preprocessor = null;
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, settings }),
  };

  const response = await fetch("/formatter", requestOptions);
  return response.json();
}
