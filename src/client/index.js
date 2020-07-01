import { handleSubmit } from "./js/formHandler";
import { isValueEmpty } from "./js/isValueEmpty";
import { submitHandler } from "./js/submitHandler";

import "./styles/style.scss";

const handleSubmitButton = document.getElementById("handleSubmit");
handleSubmitButton.addEventListener("click", submitHandler);

export { handleSubmit, isValueEmpty, submitHandler };
