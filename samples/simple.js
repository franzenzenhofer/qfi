var q = require('../q.js');
console.log(q);
for(var i = 0; i<500; i++)
{
  q.add(function(t){ console.log("function "+this.pointer+" with arguement "+t); return { "pointer":this.pointer,
  "t":t
  } }, [(i*i)], q, 'testevent');
} 

q.on('testevent', function(r){ console.log(r);});
q.setMinuteRate(500);
q.start().breakBefore(250);
console.log(q);
var q2 = q.create();
console.log(q2);