function handleSubmit(event) {
  event.preventDefault();

  // check what text was put into the form field
  let formText = document.getElementById("name").value;

  if (!Client.isValueEmpty(formText)) {
    console.log("::: Form Submitted :::");

    fetch("http://localhost:8081/sentiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: formText }),
    })
      .then((res) => res.json())
      .then(function (res) {
        console.log(res);
        document.getElementById("text-sent").innerHTML = res.text;
        document.getElementById("polarity").innerHTML = res.polarity;
        document.getElementById("subjectivity").innerHTML = res.subjectivity;
      });
  } else {
    alert("invalid value");
  }
}

export { handleSubmit };
