const modal = document.getElementById("clearModal");
const clearSub = document.getElementById("clearSub");
const secretText = document.getElementById("secretText");

const memoModal = document.getElementById("memoModal");
const memoTitle = document.getElementById("memoTitle");
const memoInput = document.getElementById("memoInput");
const saveMemo = document.getElementById("saveMemo");

const subMissionArea = document.getElementById("subMissions");

const finishBtn = document.getElementById("finishBtn");
const birthdayModal = document.getElementById("birthdayModal");
const closeBirthdayBtn = document.getElementById("closeBirthdayBtn");
const questEnd = document.getElementById("questEnd");

let currentQuest = null;
let currentRandomMission = "";

let clearedRandomMissions =
  JSON.parse(
    localStorage.getItem("clearedRandomMissions")
  ) || [];

const subMissionData = {
  food: [
    {
      title: "25周年フードを2種類以上GETしよう！",
      sub: "青いキラキラフード探し。"
    },
    {
      title: "ユカタン越えの激うまフードを探せ！",
      sub: "あったら世紀の大発見。"
    }
  ],
  photo: [
    {
      title: "25周年のものを写真に収めよう！",
      sub: "31歳誕生日の思い出になる素敵な1枚を！"
    },
    {
      title: "雨ならではの写真を撮ろう！",
      sub: "あいにくの天気も楽しんでいこう。"
    }
  ],
  birthday: [
    {
      title: "バースデーシールで祝われよう！",
      sub: "何人に気付いてもらえるか！？"
    },
    {
      title: "25周年限定シールをGETしよう！",
      sub: "もらえたらかなりラッキー。"
    }
  ]
};
const memoQuestions = {
  food: "雨の中のパンも美味かった？",
  photo: "どこで撮った？",
  birthday: "あと何枚もらう？笑"
};

const randomMissions = [
  "予定になかった食べ物を1つ食べよう",
  "写真を31枚以上撮ろう！",
  "心のコンパスを見つけに行こう",
  "25周年限定グッズを確認する",
  "今日のベストグルメを決める",
  "普段乗らないアトラクションに乗ってみる"
];

function showClearModal(text = "新しい思い出を記録しました") {

  if (memoModal) {
    memoModal.classList.remove("show");
  }

  clearSub.textContent = text;

  modal.classList.add("show");

  setTimeout(() => {
    modal.classList.remove("show");
  }, 1400);
}

function addClearHistory(text) {

  const clearList =
    document.getElementById("clearList");

  const clearCount =
    document.getElementById("clearCount");

  const li = document.createElement("li");

  li.textContent = text;

  clearList.appendChild(li);

  clearCount.textContent =
    clearList.children.length;
}

function updateSecret() {
  const clearCount =
    document.querySelectorAll(
      ".main-quest.clear"
    ).length;
  const now = new Date();
  const isAfterOpenTime =
    now.getHours() >= 15;
  const secretBtn =
    document.getElementById("secretBtn");
  if (clearCount >= 3 || isAfterOpenTime) {
    secretText.textContent =
      "15:30 マゼランズへ向かおう！";
    secretBtn.style.display =
      "inline-block";
  } else {
    secretText.textContent =
      "？？？？？";
    secretBtn.style.display =
      "none";
  }
}

function closeMemoModal() {

  memoModal.classList.remove("show");

  memoInput.value = "";

  currentQuest = null;
}

function addSubMissions(id) {

  if (!subMissionData[id]) return;

  subMissionData[id].forEach(mission => {

    const div = document.createElement("div");

    div.className = "quest";

    div.innerHTML = `
      <div>
        <h3>${mission.title}</h3>
        <p>${mission.sub}</p>
      </div>
      <button type="button">未達成</button>
    `;

    const subBtn = div.querySelector("button");

    subBtn.addEventListener("click", () => {

      if (div.classList.contains("clear")) return;

      div.classList.add("clear");

      subBtn.textContent = "CLEAR";

      addClearHistory("サブ：" + mission.title);

      showClearModal(
        "サブミッションをクリアしました"
      );
    });

    subMissionArea.appendChild(div);
  });
}

document
  .querySelectorAll(".main-quest button")
  .forEach(button => {

    button.addEventListener("click", () => {

      const quest =
        button.closest(".main-quest");

      if (quest.classList.contains("clear")) return;

      currentQuest = quest;

      const id = quest.dataset.id;

      memoTitle.textContent =
        memoQuestions[id];

      memoModal.classList.add("show");
    });
});

saveMemo.addEventListener("click", () => {

  const text =
    memoInput.value.trim();

  if (text === "" || currentQuest === null) {

    alert("なにか入力してね！");

    return;
  }

  const memo = document.createElement("p");

  memo.className = "quest-memo";

  memo.textContent = `✔ ${text}`;

  currentQuest.appendChild(memo);

  currentQuest.classList.add("clear");

  currentQuest.querySelector("button")
    .textContent = "CLEAR";

  addClearHistory(
    currentQuest.querySelector("h3")
      .textContent + "：" + text
  );

  addSubMissions(currentQuest.dataset.id);

  closeMemoModal();

  showClearModal(
    `「${text}」を記録しました`
  );

  updateSecret();
});

memoModal.addEventListener("click", e => {

  if (e.target === memoModal) {

    closeMemoModal();
  }
});

document
  .getElementById("randomBtn")
  .addEventListener("click", () => {

    const availableMissions =
      randomMissions.filter(mission => {

        return !clearedRandomMissions
          .includes(mission);
      });

    if (availableMissions.length === 0) {

      currentRandomMission = "";

      document
        .getElementById("randomMission")
        .textContent =
          "おまけミッションは全部クリア！";

      document
        .getElementById("randomMissionBox")
        .style.display = "block";

      document
        .getElementById("randomMissionBox")
        .classList.add("clear");

      const clearRandomBtn =
        document.getElementById(
          "clearRandomBtn"
        );

      clearRandomBtn.style.display = "none";

      return;
    }

    currentRandomMission =
      availableMissions[
        Math.floor(
          Math.random() *
          availableMissions.length
        )
      ];

    document
      .getElementById("randomMission")
      .textContent =
        currentRandomMission;

    document
      .getElementById("randomMissionBox")
      .style.display = "block";

    document
      .getElementById("randomMissionBox")
      .classList.remove("clear");

    const clearRandomBtn =
      document.getElementById(
        "clearRandomBtn"
      );

    clearRandomBtn.style.display =
      "inline-block";

    clearRandomBtn.textContent =
      "未達成";

    clearRandomBtn.disabled = false;
});

document
  .getElementById("clearRandomBtn")
  .addEventListener("click", () => {

    if (!currentRandomMission) return;

    addClearHistory(
      "🎲 " + currentRandomMission
    );

    clearedRandomMissions
      .push(currentRandomMission);

    localStorage.setItem(
      "clearedRandomMissions",
      JSON.stringify(
        clearedRandomMissions
      )
    );

    const clearRandomBtn =
      document.getElementById(
        "clearRandomBtn"
      );

    clearRandomBtn.textContent =
      "CLEAR";

    clearRandomBtn.disabled = true;

    document
      .getElementById("randomMissionBox")
      .classList.add("clear");

    showClearModal(
      "おまけミッションをクリアしました"
    );

    currentRandomMission = "";
});

if (
  finishBtn &&
  birthdayModal &&
  closeBirthdayBtn &&
  questEnd
) {

  finishBtn.addEventListener("click", () => {

    birthdayModal.classList.add("show");
  });

  closeBirthdayBtn
    .addEventListener("click", () => {

      birthdayModal
        .classList.remove("show");

      questEnd.classList.add("show");

      setTimeout(() => {

        questEnd.classList.remove("show");

        document
          .getElementById("app")
          .style.display = "none";

        document
          .getElementById("password-screen")
          .style.display = "flex";

        document
          .getElementById("password-input")
          .value = "";

      }, 2200);
  });
}

document
  .getElementById("secretBtn")
  .addEventListener("click", () => {
    const btn =
      document.getElementById("secretBtn");
    const secretSection =
      document.getElementById("secret");
    if(secretSection.classList.contains("clear"))
      return;
    secretSection.classList.add("clear");
    btn.textContent = "CLEAR";
    btn.disabled = true;
    showClearModal(
      "シークレットミッションをクリア！"
    );
    addClearHistory(
      "Secret Mission"
    );
});
setInterval(updateSecret, 30000);

updateSecret();
