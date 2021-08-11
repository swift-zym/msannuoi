const ejs = require('ejs');
const fs = require('fs');
const request = require('request-promise');
var members = require('./members');

var grades = {};

async function run(){

for(let x of members) {
    if (x.belong == "teacher") x.belong = "2000";
    const res = await request({
        url : `https://bytew.net/OIer/search.php?method=specific&name=${encodeURI(x.name)}&pinyin=&school=%E4%B8%9C%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E9%99%84%E5%B1%9E%E4%B8%AD%E5%AD%A6&province=%E5%90%89%E6%9E%97&year=`,
        json : true
    });
    x.awards = [];
    if(res.result.length > 0){
        x.awards = JSON.parse(res.result[0].awards.replace(/\'/g,'"'));
    }
}

fs.writeFileSync("members.tmp.json",JSON.stringify(members));

for (let member of members) {
    if (!grades[member.belong]) {
        grades[member.belong] = [member];
    }
    else {
        grades[member.belong].push(member);
    }
}

fs.writeFileSync("index.html", ejs.render(fs.readFileSync("index.ejs").toString(), { grades: grades, members: members }));
}

run();