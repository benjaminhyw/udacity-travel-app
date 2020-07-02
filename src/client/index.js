import { isValueEmpty } from "./js/isValueEmpty";
import { submitHandler } from "./js/submitHandler";

import "./styles/style.scss";
import "./styles/responsive.scss";

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", submitHandler);

export { isValueEmpty, submitHandler };
