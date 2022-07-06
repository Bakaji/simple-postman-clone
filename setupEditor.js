import "./ace/ace";

ace.config.set("basePath", "./ace/");

const theme = "ace/theme/textmate";
const mode = "ace/mode/json";

var responseEditor = ace.edit("responseEditorContainer");
var requestEditor = ace.edit("requestEditorContainer");

const options = {
  fontSize: "1rem",
};

responseEditor.session.setUseWrapMode(true);
responseEditor.session.setUseWrapMode(true);

requestEditor.session.setWrapLimitRange(120, 120);
requestEditor.session.setWrapLimitRange(120, 120);

responseEditor.setOptions(options);
requestEditor.setOptions(options);

responseEditor.setTheme(theme);
requestEditor.setTheme(theme);

responseEditor.session.setMode(mode);
requestEditor.session.setMode(mode);

responseEditor.session.setUseWorker(false);
responseEditor.setShowPrintMargin(false);
responseEditor.setReadOnly(true);

requestEditor.session.setValue("{\n\t\n}");

export function getRequestEditorValue() {
  return requestEditor.session.getValue();
}
export function setResponseViewer(data) {
  responseEditor.setValue(JSON.stringify(data, null, 2));
}
