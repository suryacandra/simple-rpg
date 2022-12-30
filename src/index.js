import {map, user, boss} from '../data/data.js'

const img = document.getElementById("map");
let ran = Math.floor(Math.random() * map[0].tile_map.length - 1);

// const statsState = (stats, calback) => {
//   return calback(stats)
// }

// const readyOnload = (obj) => {
//   statsState(obj, (e => {

//   }))
// }
const state = (value, callback) => {
  return callback(value);
};

// const randomizer = (a) => {
//   const r = Math.floor(Math.random() * map[0].tile_map.length - 1)
//   if(a !== r) return r
//   return randomizer(a)
// }

const randomBossSpawn = (a, b) => {
  const r = Math.floor(Math.random() * map[0].tile_map.length - 1);
  const findId = document.getElementById(r < 0 ? 0 : r);
  const findBoss = document.getElementById(b);
  findId.appendChild(findBoss);
  // console.log(r);
};

const bossAppear = (a, b) => {
  const findDiv = document.getElementById("arena");
  const findBoss = document.getElementById(b);
  const stats = boss.find((e) => e.name === b);
  findDiv.innerHTML = `
      <ul id="player_stats">
      <li id="player_stats_name">
          Name: ${user.name}
      </li>
      <li id="player_stats_hp">
          HP: ${user.hp}
      </li>
      <li id="player_stats_att">
          ATT: ${user.att}
      </li>
      <li id="player_stats_def">
          DEF: ${user.def}
      </li>
      <li id="player_stats_crit">
          CRIT: ${user.crit}
      </li>
      <li id="player_stats_dex">
          DEX: ${user.dex}
      </li>
    </ul>
      <ul id="boss_stats">
      <li id="boss_stats_name">
          Name: ${stats.name}
      </li>
      <li id="boss_stats_hp">
          HP: ${stats.hp}
      </li>
      <li id="boss_stats_att">
          ATT: ${stats.att}
      </li>
      <li id="boss_stats_def">
          DEF: ${stats.def}
      </li>
      <li id="boss_stats_crit">
          CRIT: ${stats.crit}
      </li>
      <li id="boss_stats_dex">
          DEX: ${stats.dex}
      </li>
    </ul>
    <button id="attack_${stats.name}">ATTACK</button>`;
  readyHandler(true, boss[0].name);
};

const bossDisappear = () => {
  readyHandler(false);
  const findDiv = document.getElementById("arena");
  findDiv.innerHTML = "";
};

const battleCalculation = (user, boss) => {
  const calculate = ((80 + (user.crit + Math.random() * 10)) / 100) * user.att;
  const b = calculate * (100 / (boss.def + 100));
  const dexCalc = ((user.dex / (boss.dex + user.dex)) * 100) + Math.random() * (user.dex/boss.dex * 100)
  // const dexCalc =  Math.random() * ((user.dex / (boss.dex + user.dex)) * 100)
  const c = dexCalc > 90 ? b : 0
  console.log(c)
  return {
    damage: Math.round(c),
    message: `${user.name} hit ${boss.name} by ${Math.round(c)}`,
  };
};

const equipmentCheckStats = (a) => {
  let stat = {
    ...a,
  };
  for (const c in a.equipment) {
    if (Object.keys(a.equipment[c]).length > 0) {
      const hp = a.equipment[c]?.stats?.hp || 0;
      const att = a.equipment[c]?.stats?.att || 0;
      const def = a.equipment[c]?.stats?.def || 0;
      const crit = a.equipment[c]?.stats?.crit || 0;
      const dex = a.equipment[c]?.stats?.dex || 0;
      stat = {
        ...a,
        hp: a.hp + hp,
        att: a.att + att,
        def: a.def + def,
        crit: a.crit + crit,
        dex: a.dex + dex,
      };
    }
  }
  return stat;
};

const battleAboutFinish = (a, b) => {
  const button = document.getElementById(`attack_${a}`)
  button.onclick = () => {
    bossDisappear()
    randomBossSpawn('', boss[0].name)
    b.innerHTML = ''
  }
}

const readyHandler = (a, b) => {
  const arr = [];
  state(a, (e) => {
    if (e) {
      const attackButton = document.getElementById(`attack_${b}`);
      const log = document.getElementById("log");
      attackButton.onclick = (e) => {
        const findHpPlayer = document.getElementById(`player_stats_hp`)
        const findHpBoss = document.getElementById(`boss_stats_hp`)
        const bat = battleCalculation(user, boss[0]);
        const bat1 = battleCalculation(boss[0], user)
        arr.unshift({
          user: bat.message,
          boss: bat1.message
        })
        const calc = parseInt(findHpPlayer.innerText.split(' ')[1]) - bat1.damage
        const calc1 = parseInt(findHpBoss.innerText.split(' ')[1]) - bat.damage
        log.innerHTML = `
        <span>${arr[0].user}</span>
        <span>${arr[0].boss}</span>`
        if(parseInt((findHpBoss.innerText.split(' ')[1])) <= bat.damage) {
          findHpBoss.innerText = 'DEAD'
          attackButton.innerText = 'CONTINUE'
          return battleAboutFinish(b, log)
        }
        findHpPlayer.innerText = `HP: ${calc <= 0 ? 0 : calc}`
        findHpBoss.innerText = `HP: ${calc1 <= 0 ? 0 : calc1}`
          // const div = document.createElement('div')
          // div.classList.add('flex')
          // div.innerHTML = `
          // <span>${arr[0].user}</span>
          // <span>${arr[0].boss}</span>
          // `
          // console.log(arr)
      };
    } else {
      console.log(false);
    }
  });
};

map[0].tile_map.forEach((e, i) => {
  const div = document.createElement("div");
  const im = document.createElement("img");
  const src = im.setAttribute("src", e.img);
  im.classList.add("ele");
  div.classList.add("pos");
  div.setAttribute("id", i);
  div.append(im);
  im.onclick = (e) => {
    bossDisappear();
  };
  img.appendChild(div);
  if (i === (ran < 0 ? 0 : ran)) {
    const a = document.createElement("img");
    a.setAttribute("src", "public/boss1.png");
    a.setAttribute("id", boss[0].name);
    const c = a.classList.add("mon");
    a.onclick = (e) => {
      bossAppear(i, boss[0].name);
    };
    div.appendChild(a);
  }
});

// a(b(user), boss);
// a(boss, user);
