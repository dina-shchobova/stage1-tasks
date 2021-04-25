let hours = new Date().getHours();
let counter = 0;

const divFilter = document.querySelector('.filters');
const input = document.querySelectorAll("input[type=\'range\']");
const btnReset = document.querySelector('.btn-reset');
const btnNext = document.querySelector('.btn-next');
const fileInput = document.querySelector('input[type="file"]');
// const imageContainer = document.querySelector('.container-img');
const canvas = document.querySelector('.canvas');
const btnSave = document.querySelector('.btn-save');
const fullScr = document.querySelector('.fullscreen');

function setValueFilter(inputItem, value) {
  const nameFilter = inputItem.getAttribute('name');
  const dataSizing = inputItem.getAttribute('data-sizing');
  const img = document.querySelector('img');
  img.style.setProperty(`--${nameFilter}`, value + `${dataSizing}`);
  drawImage();
}

function updateValue(event) {
  if (event.target.matches("input[type='range']")) {
    const output = event.target.nextElementSibling;
    output.value = event.target.value;
    setValueFilter(event.target, output.value);
  }
}

function resetAll() {
  input.forEach(item => {
    const value = item.getAttribute('value');
    setValueFilter(item, value);
    const output = item.nextElementSibling;
    output.value = value;
    item.value = value;
  })
}

function setCounter() {
  counter++;
  if (counter > 20) {
    counter = 1;
  }
  if (counter < 10) {
    counter = '0' + counter;
  }
  nextPicture(counter);
}

function nextPicture(number) {
  let timesOfDay;
  if (hours >= 18) {
    timesOfDay = 'evening';
  } else if (hours >= 12) {
    timesOfDay = 'day';
  } else if (hours >= 6) {
    timesOfDay = 'morning';
  } else if (hours >= 0) {
    timesOfDay = 'night';
  }
  let src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timesOfDay}/${number}.jpg`;
  getImage(src);
}

function getImage(src) {
  const imgNew = new Image();
  imgNew.src = src;
  imgNew.onload = () => {
    const img = document.querySelector('img');
    img.setAttribute('src', `${src}`);
    drawImage();
  };
}

function fileUpload() {
  const img = document.querySelector('img');
  let filters = getComputedStyle(img).filter;
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const imgNew = new Image();
    imgNew.src = reader.result;
    img.setAttribute('src', reader.result);
    drawImage();
  }
  reader.readAsDataURL(file);
  fileInput.value = '';
}

function drawImage() {
  const img = document.querySelector('img');
  const imgNew = new Image();
  imgNew.setAttribute('crossOrigin', 'anonymous');
  imgNew.src = img.getAttribute('src');
  imgNew.onload = function() {
    canvas.width = imgNew.width;
    canvas.height = imgNew.height;
    const ctx = canvas.getContext("2d");
    let filters = calculateFiltersCanvas(canvas.width);
    ctx.filter = filters;
    ctx.drawImage(imgNew, 0, 0);
    console.log(filters);
  };
}

function calculateFiltersCanvas() {
  const img = document.querySelector('img');
  const coefWidth = canvas.width / img.width;
  const coefHeight = canvas.height / img.height;
  const coef = (coefWidth > coefHeight) ? coefWidth : coefHeight;
  const blurImg = document.querySelector('.result-blur').value;
  const blurCanvas = coef * blurImg;
  let filtersImg = getComputedStyle(img).filter;
  const filtersImgArr = filtersImg.split(' ');
  filtersImg = filtersImgArr.slice(1).join(' ');
  return `blur(${blurCanvas}px) ` + filtersImg;
}

function saveImage() {
  btnSave.href = canvas.toDataURL('image/png',0.7);
  btnSave.download = "myPainting.png";
}

divFilter.addEventListener('input', updateValue);
btnReset.addEventListener('click', resetAll);
btnNext.addEventListener('click', setCounter);
fileInput.addEventListener('change', fileUpload);
btnSave.addEventListener('click', saveImage);

