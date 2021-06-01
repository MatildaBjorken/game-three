document.getElementById('testiframe').addEventListener('load', loaded);
function loaded() {
  setTimeout(function () {
    document.getElementById('loader').style.display = 'none';
    document.querySelector('.main').style.display = 'block';
  }, 1000);
}
let highScores = localStorage.getItem('theMONEY') || '2500';
console.log(highScores, 'eee');
function Game() {
  this.total = 0;
  this.deg = 0;
  this.random = 0;
  this.spindeg = 0;
  this.value = 0;
  this.reward = 0;
  this.options = [];
  this.pool = localStorage.getItem('theMONEY') || '2500';
  console.log(this.pool);
  this.round = 0;
  this.poolEl = document.querySelector('.pool');

  this.rate = function () {
    this.random = Math.random() * this.total;
  };
  this.setRate = function (value, reward, rate) {
    this.total += rate;
    let total = this.total;
    let origin = this.rate;
    let newfn = function () {
      origin.call(this);
      if (this.random <= total) {
        this.random = this.total + 1;
        this.value = value;
        this.reward = reward;
      }
    };
    this.rate = newfn;
  };
  this.pay = function (money) {
    this.pool -= money;
    this.changePool();
    localStorage.setItem('theMONEY', this.pool);
  };
  this.win = function (money) {
    this.pool += money;
    localStorage.setItem('theMONEY', this.pool);
    this.changePool();
  };
  this.changePool = function () {
    this.poolEl.textContent = this.pool;
  };
  this.hint = function (text) {
    document.querySelector('.hint').textContent = text;
  };
  this.newRound = function () {
    this.round++;
    document.querySelector('.round').textContent = this.round;
  };
}
let game = new Game();
game.changePool();
game.setRate(0, 0, 10);
game.setRate(1, 10000, 3);
game.setRate(2, -500, 10);
game.setRate(3, 200, 8);
game.setRate(4, 0, 10);
game.setRate(5, 1000, 3);
game.setRate(6, 0, 10);
game.setRate(7, 1500, 12);
game.setRate(8, 0, 10);
game.setRate(9, 1000, 3);
game.setRate(10, 0, 10);
game.setRate(11, 500, 11);
let spinner = document.querySelector('.spinner');
let pay = document.querySelector('.pay');
document.querySelector('.text').addEventListener('click', function () {
  if (!this.classList.contains('disabled')) {
    if (game.pool >= 500) {
      let round = Math.floor(Math.random() * 3);
      game.newRound();
      game.hint('Spinning...');
      this.classList.add('disabled');
      pay.classList.add('pay-goTop');
      game.pay(500);
      game.rate();
      let adddeg = game.value - game.spindeg;
      if (adddeg < 0) adddeg += 12;
      game.spindeg = game.value;
      if (adddeg == 0 && round == 0) game.deg += 360;
      else game.deg += adddeg * 30 + 360 * round;
      spinner.style.transform = 'rotate(' + game.deg + 'deg)';
    } else {
      game.hint('Sorry, Not Enough Money.');
      this.classList.add('disabled');
    }
  }
});
document
  .querySelector('.spinner')
  .addEventListener('transitionend', function () {
    game.win(game.reward);
    if (game.reward == 0) game.hint('Try Again!');
    else if (game.reward == 10000) {
      game.hint('You Win the Biggest Reward!');
    } else if (game.reward < 0) {
      game.hint('You Loss Extra ' + game.reward * -1);
    } else {
      game.hint('You Win ' + game.reward + ' Dollars!');
    }
    pay.classList.remove('pay-goTop');
    document.querySelector('.text').classList.remove('disabled');
  });

//localStorage.clear();
