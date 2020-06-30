import { handleSubmit } from "./js/formHandler";
import { isValueEmpty } from "./js/isValueEmpty";
import { cityNameSubmitButtonClickHandler } from "./js/cityNameSubmitButtonClickHandler";

import "./styles/style.scss";

const handleSubmitButton = document.getElementById("handleSubmit");
handleSubmitButton.addEventListener("click", cityNameSubmitButtonClickHandler);

export { handleSubmit, isValueEmpty, cityNameSubmitButtonClickHandler };
