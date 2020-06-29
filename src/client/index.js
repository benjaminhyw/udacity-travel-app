import { handleSubmit } from "./js/formHandler";
import { isValueEmpty } from "./js/isValueEmpty";
import { generateButtonClickHandler } from "./js/generateButtonClickHandler";
import { cityNameSubmitButtonClickHandler } from "./js/cityNameSubmitButtonClickHandler";

import "./styles/style.scss";

// I think this is where you add the buttton handler
const generateButton = document.getElementById("generate");
generateButton.addEventListener("click", generateButtonClickHandler);

const handleSubmitButton = document.getElementById("handleSubmit");
handleSubmitButton.addEventListener("click", cityNameSubmitButtonClickHandler);

export {
  handleSubmit,
  isValueEmpty,
  generateButtonClickHandler,
  cityNameSubmitButtonClickHandler,
};
