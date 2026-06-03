function buildLoginUI() {
  loginInput = createInput("");
  loginInput.attribute("placeholder", "아이디 입력");
  loginInput.style("font-size", "18px");
  loginInput.style("padding", "12px 18px");
  loginInput.style("border", "1px solid #43e0c0");
  loginInput.style("border-radius", "4px");
  loginInput.style("background", "rgba(0, 0, 0, 0.75)");
  loginInput.style("color", "#43e0c0");
  loginInput.style("outline", "none");
  loginInput.style("font-family", "'Share Tech Mono', monospace");
  loginInput.style("box-sizing", "border-box");
  loginInput.elt.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      loginUser();
    }
  });

  loginButton = createButton("LOGIN");
  loginButton.style("font-size", "18px");
  loginButton.style("padding", "12px 28px");
  loginButton.style("border", "1px solid #43e0c0");
  loginButton.style("border-radius", "4px");
  loginButton.style("background", "rgba(0, 0, 0, 0.75)");
  loginButton.style("color", "#43e0c0");
  loginButton.style("font-family", "'Share Tech Mono', monospace");
  loginButton.style("cursor", "pointer");
  loginButton.style("box-sizing", "border-box");
  loginButton.mousePressed(loginUser);
}

function showOnlyLoginUI() {
  hideAllUI();
  loginInput.show();
  loginButton.show();
}

function drawLoginPage() {
  if (navHomeBtn) navHomeBtn.hide();
  if (navTodoBtn) navTodoBtn.hide();
  if (navMusicBtn) navMusicBtn.hide();
  background(0);

  drawIntroStars();
  drawCRTOverlay();

  fill(67, 224, 192);
  textFont("Share Tech Mono");
  textAlign(CENTER, CENTER);

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "#43e0c0";

  textSize(30);
  text("USER IDENTIFICATION SYSTEM", width / 2, height * 0.28);

  textSize(24);
  text("당신의 아이디를 입력하세요", width / 2, height * 0.38);

  textSize(16);
  text("Enter your ID to access 2DO orbital task system", width / 2, height * 0.45);

  if (loginMessage !== "") {
    fill(255, 130, 160);
    textSize(16);
    text(loginMessage, width / 2, height * 0.68);
  }

  drawingContext.shadowBlur = 0;

  loginInput.position(width / 2 - 250, panelY + 215);
  loginInput.size(350, 54);

  loginButton.position(width / 2 + 115, panelY + 215);
  loginButton.size(135, 54);

  textFont("sans-serif");
}

function loginUser() {
  let value = loginInput.value().trim();

  if (value === "") {
    loginMessage = "아이디를 입력해주세요.";
    return;
  }

  userId = value;
  localStorage.setItem("twoDoLastUserId", userId);

  loadInventory();

  todoList = [];
  messageText = "";
  loadedFromSave = false;
  rewardClaimed = false;

  currentPage = "input";
  showOnlyInputUI();
}
