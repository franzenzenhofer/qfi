var events = require("events");

var Q = function()
{
  var self = this;
  self.pointer = 0;
  self.stopflag = false;
  self.breakpoint = false;
  self.breakIf = function(){ return false; }
  self.breakcallback = function(currentpointer) { console.log('break before '+currentpointer); }
  self.outtime = 0;
}

Q.prototype = Object.create(Array.prototype, {constructor:{value:Q, enumberable:true}});

for(var z in events.EventEmitter.prototype) {
  Q.prototype[z] = events.EventEmitter.prototype[z];
}

var WorkItem = function(func, args, thisarg, eventname, q)
{
    var self = this;
    self.func = func;
    self.args = args;
    self.thisarg = thisarg;
    self.eventname = eventname;
    self.q = q;
}

WorkItem.prototype.apply = function(thisarg, args)
{
  var self = this;
  var func = self.func;
  var thisarg = thisarg || self.thisarg;
  var args = args || self.args;
  var eventname = self.eventname;
  var r = func.apply(thisarg, args);
  self.q.emit(eventname, r);
  return r;
}

WorkItem.prototype.call=function(thisarg) 
{
  var self = this;
  var a = [];
  for(var i = 1; i<arguments.length; i++)
  {
    a.push(arguments[i]);
  }
  return self.apply(thisarg, a);
}

WorkItem.prototype.execute = function(){
  var self = this;
  return self.apply();
};
WorkItem.prototype.x = WorkItem.prototype.execute;

Q.prototype.createWorkItem = function(func, args, thisarg, eventname){
  var self = this;
    if(arguments[0] && typeof arguments[0] === 'object' && arguments[0] && arguments[0].func && typeof arguments[0].func === 'function')
  {
    var func = arguments[0].func;
    var args = arguments[0].args || undefined;
    var thisarg = arguments[0].thisarg || undefined;
    var eventname = arguments[0].eventname || undefined;
  }
  return new WorkItem (func, args, thisarg, eventname, self );
};

Q.prototype.add = function(func, args, thisarg, eventname){
  var self = this;
  var wi;
  wi = self.createWorkItem(func, args, thisarg, eventname);
  self.push(wi);
  return self;
};
Q.prototype.addWorkItem = Q.prototype.add;

Q.prototype._run = function(conf)
{
  var self = this;
  if(conf){ self.setConf(conf); }
  if(self.pointer<self.length)
  {
    if(self.stopflag===true||(self.breakpoint!==false&&self.breakpoint===self.pointer))
    {
      self.stopflag=false;
      if(self.breakcallback)
      {
        self.breakcallback(self.pointer);
      }
    }
    else if(self.breakIf())
    {
    
    }
    else
    {
      self[self.pointer].x();
      self.pointer=self.pointer+1;
      setTimeout(function(){self._run();},self.outtime);
    }
  }
  return self;
}
Q.prototype.setConf = function(conf){
  var self = this;
  for(var z in conf)
  {
    self[z]=conf[z];
  }
  return self;
};
Q.prototype.start = function(conf){var self = this;return self.startAt(0,conf);};
Q.prototype.restart = Q.prototype.start;
Q.prototype.stop = function(conf){
  var self = this;
  if(conf){ self.setConf(conf); }
  self.stopflag = true;
  return self;
};
Q.prototype.resume = function(conf){
  var self = this;
  if(self.pointer === self.breakpoint)
  {
    self.clearBreak();
  }
  return self._run(conf);
};
Q.prototype.startAt = function(start,conf){
 var self = this;
 
 self.pointer = start || 0;
 return self._run(conf);
};
Q.prototype.breakBefore = function(stop,conf){
  var self=this;
  if(conf){ self.setConf(conf); }
  self.breakpoint=stop;
  return self;
};

Q.prototype.breakAt = function(stop,conf){
  var self=this;
  return self.breakBefore(stop+1,conf);
};

Q.prototype.clearBreak = function(conf){
  var self=true;
  if(conf){ self.setConf(conf); }
  self.breakpoint=false;
  return self;
};
Q.prototype.startAtbreakBefore = function(start,stop,conf){
  var self = this;
  self.pointer=start;
  self.breakpoint=stop;
  return self._run(conf);
};
Q.prototype.pause = function(val,conf){
  var self = this;
  if(conf){ self.setConf(conf); }
  self.stop();
  setTimeout(function(){
    self.resume();
  },val);
  return self;

};

Q.prototype.setRate = function(hits, milsec){
  var self = this;
  self.outtime = milsec / hits;
  return self;
  };
Q.prototype.setSecondRate = function(hits){
  var self = this;
  return self.setRate(hits,1*1000);
};
Q.prototype.setMinuteRate = function(hits){
  var self = this;
  return self.setRate(hits,60*1000);
};

Q.prototype.setHourlyRate = function(hits){
  var self = this;
  return self.setRate(hits,60*60*1000);
};
Q.prototype.setDailyRate = function(hits){
  var self = this;
  return self.setRate(hits,24*60*60*1000);
};



var createQ = function() { 
  var q = new Q();
  return q;
}

/*var q = createQ();
q.add(function(u){console.log(u); return "a return value"; }, ["test_this"], null,"hey" );
q.add(function(u){console.log(u); return "a second returnvalue"; }, ["test_this"], null,"hey" );
console.log(q);
q.on('newListener', function(){ console.log('new li'); });
q.on('test', function(){ console.log('test'); });
q.on('hey', function(r){console.log(r);})
//q[0].x();
q.setMinRate(5);
q.start();//q.stop();*/

var q_interface = {
  create:createQ
}

module.exports = q_interface.create();
module.exports.create = q_interface.create;

