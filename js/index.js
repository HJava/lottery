const KEY = '_lottery_winner';
const RECORD_KEY = '_lottery_winner_record';
let winnerMap = new Map();
let winRecords = [];

function loadStorage() {
  try {
    let result = localStorage.getItem(KEY);
    let record = localStorage.getItem(RECORD_KEY);

    if (result && record) {
      winnerMap = new Map(JSON.parse(result));
      winRecords = JSON.parse(record);
    } else {
      winnerMap.clear();
      winRecords = [];
    }
  } catch (e) {
    console.error('读取数据异常', e);
  }
}

function clearStorage() {
  localStorage.clear(KEY);
  localStorage.clear(RECORD_KEY);
}

function setStorage() {
  localStorage.setItem(KEY, JSON.stringify(Array.from(winnerMap.entries())));
  localStorage.setItem(RECORD_KEY, JSON.stringify(winRecords));
}

function addWinners(winners) {
  winRecords.push({ time: Date.now(), winners });
  winners.forEach(winner => {
    winnerMap.set(getKey(winner), true);
  });
}

function initTagCanvas() {
  TagCanvas.Start('memberCanvas', '', {
    textColour: null,
    initial: speed(),
    dragControl: 1,
    textHeight: 14,
  });
}

function speed() {
  return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
}

function speedUp() {
  TagCanvas.SetSpeed('memberCanvas', speed());
}

function speedDown() {
  TagCanvas.SetSpeed('memberCanvas', [5, 1]);
}

function reloadTagCanvas() {
  TagCanvas.Reload('memberCanvas');
}

function getKey(item) {
  return item.name + '-' + item.phone;
}

function updateCanvasInnerHTML() {
  const html = ['<ul>'];
  allMembers.forEach(item => {
    let className = winnerMap.has(getKey(item)) ? 'winner' : 'member';

    html.push(`<li><a href="#" class="${className}">${item.name}</a></li>`);
  });
  html.push('</ul>');
  document.getElementById('memberCanvas').innerHTML = html.join('');
}

function getRandomMembers(members, selectedNumber) {
  if (members.length <= selectedNumber) {
    return [...members];
  }

  let currentSelectedMembers = [];

  while (currentSelectedMembers.length < selectedNumber) {
    let random = Math.floor(Math.random() * members.length);
    let randomMember = members[random];
    if (
      currentSelectedMembers.findIndex(element => {
        return element.name === randomMember.name;
      }) === -1
    ) {
      currentSelectedMembers.push(randomMember);
    }
  }

  return currentSelectedMembers;
}

function isWinner(member) {
  return winnerMap.has(getKey(member));
}

function createWinnerHTML(winners) {
  return winners.reduce((prev, next) => {
    return `${prev}<span>${next.phone}-${next.name}</span>`;
  }, '');
}

function createWinnerRecordsHTML() {
  if (winRecords.length === 0) {
    return `<div class="winnerRecord">无记录!</div>`;
  }

  return winRecords.reduce((prev, next) => {
    let winnersHTML = next.winners.map(winner => {
      return `<span>${winner.phone}-${winner.name}</span>`;
    });

    return `${prev}<div class="winnerRecord"><span>${new Date(
      next.time,
    ).toLocaleString()}<span>:&nbsp;<span>${winnersHTML.join(',')}</span></div>`;
  }, '');
}

function hideWinnersMask() {
  document.querySelector('#result').style.display = 'none';
  document.querySelector('#main').classList.remove('mask');
}

function showWinnersMask() {
  document.querySelector('#main').classList.add('mask');
}

function hideWinnerRecords() {
  let $winnerRecords = document.querySelector('#winnerRecords');
  if ($winnerRecords.style.display !== ' none') {
    $winnerRecords.innerHTML = '';
    $winnerRecords.style.display = 'none';
  }
}

function lottery(number) {
  let notSelectedMembers = allMembers.filter(member => !isWinner(member));
  let newWinners = getRandomMembers(notSelectedMembers, number);

  addWinners(newWinners);
  setStorage();

  return newWinners;
}

function initVue() {
  new Vue({
    el: '#container',
    data: {
      selected: 3,
      running: false,
      btns: [
        { name: '三等奖(3)人', value: 3 },
        { name: '二等奖(2)人', value: 2 },
        { name: '一等奖(1)人', value: 1 },
      ],
    },
    mounted() {
      updateCanvasInnerHTML();
      initTagCanvas();
    },
    methods: {
      reset: function () {
        if (confirm('确定要重置么？所有之前的抽奖历史将被清除！')) {
          hideWinnerRecords();
          hideWinnersMask();

          clearStorage();
          loadStorage();
          updateCanvasInnerHTML();
          reloadTagCanvas();
        }
      },

      loadStorageInfo() {
        //   if(confirm('是否需要读取之前的缓存记录?')) {

        //   }
        loadStorage();
        updateCanvasInnerHTML();
        reloadTagCanvas();
      },
      showWinnerRecords() {
        let $winnerRecords = document.querySelector('#winnerRecords');
        if ($winnerRecords.style.display !== 'block') {
          $winnerRecords.innerHTML = createWinnerRecordsHTML();
          $winnerRecords.style.display = 'block';
        }
      },
      onClick: function (num) {
        hideWinnersMask();

        this.selected = num;
      },
      toggle: function () {
        hideWinnerRecords();
        if (this.running) {
          let $result = document.querySelector('#result');

          speedUp();
          if (allMembers.length === winnerMap.size) {
            $result.style.display = 'block';
            $result.innerHTML = '<span>已抽完</span>';
            return;
          }
          let winners = lottery(this.selected);

          $result.style.display = 'block';
          $result.innerHTML = createWinnerHTML(winners);
          updateCanvasInnerHTML();
          reloadTagCanvas();
          setTimeout(() => {
            showWinnersMask();
          }, 300);
        } else {
          hideWinnersMask();
          speedDown();
        }
        this.running = !this.running;
      },
    },
  });
}

function init() {
  let canvas = document.querySelector('#memberCanvas');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  initVue();
}

init();
