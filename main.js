import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { setResponseViewer, getRequestEditorValue } from "./setupEditor";

const $ = (selector) => document.querySelector(selector);

const queryParamsContainer = $("[data-query-params]");
const requestHeadersContainer = $("[data-request-headers]");
const responseHeadersContainer = $("[data-response-headers]");

axios.interceptors.request.use((request) => {
  request.customData = request.customData || {};
  request.customData.startTime = new Date().getTime();
  return request;
});

axios.interceptors.response.use(updateEndTime, (e) => {
  return Promise.reject(updateEndTime(e.response));
});
function updateEndTime(response) {
  response.customData = response.customData || {};
  response.customData.endTime = new Date().getTime();
  response.customData.duration =
    response.customData.endTime - response.config.customData.startTime;
  return response;
}

const form = $("[data-form]");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  axios({
    url: $("[data-url]").value,
    method: $("[data-method]").value,
    params: KeyValueParamsToObject(queryParamsContainer),
    headers: KeyValueParamsToObject(requestHeadersContainer),
    data: JSON.parse(getRequestEditorValue()) ?? {},
  })
    .catch((e) => e)
    .then((response) => {
      
      document
        .querySelector("[data-response-section]")
        .classList.remove("d-none");
      updateResponseDetails(response);
      // updateResponseViewer(response.data);
      setResponseViewer(response.data);
      updateResponseHeaders(response.headers);
    });
});

const keyValueTemplate = $("[data-key-value-template]");

queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

$("[data-add-query-param-btn]").addEventListener("click", function (e) {
  e.preventDefault();
  queryParamsContainer.append(createKeyValuePair());
});

$("[data-add-request-header-btn]").addEventListener("click", function (e) {
  e.preventDefault();
  requestHeadersContainer.append(createKeyValuePair());
});

function createKeyValuePair() {
  const element = keyValueTemplate.content.cloneNode(true);
  element
    .querySelector("[data-remove-btn]")
    .addEventListener("click", function (e) {
      e.target.closest("[data-key-value-pair]").remove();
    });
  return element;
}

function KeyValueParamsToObject(container) {
  const pairsNodeList = container.querySelectorAll("[data-key-value-pair]");
  const pairs = [...pairsNodeList];
  return pairs.reduce((data, pair) => {
    const key = pair.querySelector("[data-key]").value;
    const value = pair.querySelector("[data-value]").value;
    if (key) {
      data = { ...data, [key]: value };
    }
    return data;
  }, {});
}

function updateResponseDetails(response) {
  $("[data-status]").innerHTML = response.status;
  $("[data-time]").innerHTML = response.customData.duration;
  $("[data-size]").innerHTML = prettyBytes(
    JSON.stringify(response.data).length +
      JSON.stringify(response.headers).length
  );
}

function updateResponseHeaders(headers) {
  responseHeadersContainer.innerHTML = "";
  Object.entries(headers).forEach(([key, value]) => {
    const keyElement = document.createElement("div");
    keyElement.innerHTML = key;
    const valueElement = document.createElement("div");
    valueElement.innerHTML = value;
    responseHeadersContainer.append(keyElement);
    responseHeadersContainer.append(valueElement);
  });
}
