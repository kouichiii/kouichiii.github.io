// クエリパラメータを取得する関数
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// クエリパラメータからジャンルを取得
const genre = getQueryParam('genre');

// JSONファイルからデータを取得する関数
function fetchQuizData() {
  return fetch('question.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // JSONデータを取得
    })
    .then(data => {
      return data[genre];
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      return []; // エラー時は空の配列を返す
    });
}

// クイズのデータと状態を管理
let quiz = [];
let score = 0;
let quizIndex = 0;
let buttonIndex = 0;

const $button = document.querySelectorAll('.quiz-option');
const $description = document.getElementById('description');
const $footer = document.querySelector('#description .alert-footer');
const $heading = document.querySelector('#description .alert-heading');
const $showans = document.querySelector('#description .alert-showAnswer');
const $nextButton = document.querySelector('.next');
const $quizcontainer = document.getElementById('quiz-container');
const $resultcontainer = document.getElementById('result-container');
const $resultscore = document.getElementById('result-message');
const $restartbutton = document.querySelector('#result-container .btn');
const buttonLength = $button.length;

// クイズのセットアップ関数
const setupQuiz = () => {
  buttonIndex = 0;
  document.getElementById('js-question').textContent = quiz[quizIndex].question;
  while (buttonIndex < buttonLength) {
    $button[buttonIndex].textContent = quiz[quizIndex].answers[buttonIndex];
    buttonIndex++;
  }
  $footer.textContent = quiz[quizIndex].description;
}

const setButtonState = (state) => {

  $button.forEach(button => {
    if (state) {
      button.setAttribute('disabled', 'true'); // Disable button
    } else {
      button.removeAttribute('disabled'); // Enable button
    }
  });
}

// 次の問題に進む関数
const nextHandler = () => {
  setButtonState(false);
  quizIndex++;
  $description.style.visibility = "hidden";
  if (quizIndex < quiz.length) {
    setupQuiz();
  } else {
    $quizcontainer.style.visibility = 'hidden';
    $resultcontainer.style.visibility = 'visible';
    $resultscore.textContent = 'あなたの正解数は' + score + '/' + quiz.length + 'です！';
  }
}

// 結果を表示する関数
const showResult = (result) => {
  $heading.textContent = result;
  $showans.textContent = '正解：' + quiz[quizIndex].correct;
  $description.style.visibility = "visible";
}

// クリックイベントハンドラ
const clickHandler = (e) => {
  setButtonState(true);
  let result;
  if (quiz[quizIndex].correct === e.target.textContent) {
    result = '正解！';
    score++;
  } else {
    result = '不正解！';
  }
  showResult(result);
}

// 帰タイトルのハンドラ
const restartHandler = () => {
  window.location.href = 'index.html';
}

// ボタンにクリックイベントを設定
buttonIndex = 0;
while (buttonIndex < buttonLength) {
  $button[buttonIndex].addEventListener('click', (e) => {
    clickHandler(e);
  });
  buttonIndex++;
}

$nextButton.addEventListener('click', () => {
  nextHandler();
});

$restartbutton.addEventListener('click', () => {
  restartHandler();
});

// クイズデータの取得と初期セットアップ
fetchQuizData().then(fetchedQuiz => {
  quiz = fetchedQuiz;
  setupQuiz();
});
