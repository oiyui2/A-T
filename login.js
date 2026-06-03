function buildLoginUI() {
  loginInput = createInput("");
  loginInput.attribute("placeholder", "아이디 입력");
  loginInput.style("font-size", "22px");
  loginInput.style("padding", "12px 22px");
  loginInput.style("border", "1.5px solid #43e0c0");
  loginInput.style("border-radius", "4px");
  loginInput.style("background", "rgba(0, 12, 12, 0.85)");
  loginInput.style("color", "#43e0c0");
  loginInput.style("outline", "none");
  loginInput.style("font-family", "'Share Tech Mono', monospace");
  loginInput.style("box-shadow", "0 0 16px rgba(67,224,192,0.45)");
  loginInput.style("box-sizing", "border-box");

  loginInput.elt.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      loginUser();
    }
  });

  loginButton = createButton("LOGIN");
  loginButton.style("font-size", "20px");
  loginButton.style("border", "1.5px solid #43e0c0");
  loginButton.style("border-radius", "4px");
  loginButton.style("background", "rgba(0, 12, 12, 0.85)");
  loginButton.style("color", "#43e0c0");
  loginButton.style("font-family", "'Share Tech Mono', monospace");
  loginButton.style("cursor", "pointer");
  loginButton.style("box-shadow", "0 0 16px rgba(67,224,192,0.45)");
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

  let panelW = min(width * 0.68, 780);
  let panelH = 360;
  let panelX = width / 2 - panelW / 2;
  let panelY = height / 2 - panelH / 2;

  noStroke();
  fill(5, 25, 23, 180);
  rect(panelX, panelY, panelW, panelH, 18);

  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = "#43e0c0";

  noFill();
  stroke(67, 224, 192, 180);
  strokeWeight(2);
  rect(panelX, panelY, panelW, panelH, 18);

  stroke(67, 224, 192, 130);
  strokeWeight(2);

  line(panelX + 30, panelY + 28, panelX + 160, panelY + 28);
  line(panelX + 160, panelY + 28, panelX + 190, panelY + 55);

  line(panelX + panelW - 30, panelY + 28, panelX + panelW - 160, panelY + 28);
  line(panelX + panelW - 160, panelY + 28, panelX + panelW - 190, panelY + 55);

  line(panelX + 30, panelY + panelH - 28, panelX + 160, panelY + panelH - 28);
  line(panelX + 160, panelY + panelH - 28, panelX + 190, panelY + panelH - 55);

  line(panelX + panelW - 30, panelY + panelH - 28, panelX + panelW - 160, panelY + panelH - 28);
  line(panelX + panelW - 160, panelY + panelH - 28, panelX + panelW - 190, panelY + panelH - 55);

  for (let i = 0; i < 6; i++) {
    let x = panelX + 70 + i * 90;
    line(x, panelY, x + 25, panelY - 18);
    ellipse(x + 30, panelY - 20, 6, 6);
  }

  drawingContext.shadowBlur = 0;

  fill(67, 224, 192);
  textFont("Share Tech Mono");
  textAlign(CENTER, CENTER);

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "#43e0c0";

  textSize(28);
  text("USER IDENTIFICATION SYSTEM", width / 2, panelY + 80);

  textSize(24);
  text("당신의 아이디를 입력하세요", width / 2, panelY + 135);

  textSize(15);
  fill(67, 224, 192, 180);
  text("Enter your ID to access 2DO orbital task system", width / 2, panelY + 175);

  if (loginMessage !== "") {
    fill(255, 130, 160);
    textSize(16);
    text(loginMessage, width / 2, panelY + panelH - 55);
  }

  drawingContext.shadowBlur = 0;

  loginInput.show();
  loginButton.show();

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
