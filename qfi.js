var events = require("events");
var Q = function() {
  var self = this;
  self._pointer = 0;
  self.stopflag = false;
  self._breakpoint = false;
  self.daemon = false;
  self.breakIf = function() {
    return false
  };
  self.breakcallback = function(current_pointer) {
    console.log("break before " + current_pointer)
  };
  self.exitcallback = function() {
    console.log("nothing more to do, therfore i exit")
  };
  self.outtime = 0;
};
Q.prototype = Object.create(Array.prototype, {constructor:{value:Q, enumberable:true}});
for(var z in events.EventEmitter.prototype) {
  Q.prototype[z] = events.EventEmitter.prototype[z]
}
var FunctionItem = function(func, args, thisarg, eventname, q) {
  var self = this;
  var f = function(){
    return self.x();
  }
  self.arguments = f.arguments;
  self.func = f.func = func;
  self.args = f.args = args;
  self.thisarg = f.thisarg = thisarg;
  self.eventname = f.eventname = eventname;
  self.q = f.q = q;
  f.prototype = FunctionItem.prototype;
  return f;
};
FunctionItem.prototype.apply = function(thisarg, args) {
  var self = this;
  var func = self.func;
  var thisarg = thisarg || self.thisarg;
  var args = args || self.args;
  var eventname = self.eventname;
  var r = func.apply(thisarg, args);
  self.q.emit(eventname, r);
  return r
};
FunctionItem.prototype.call = function(thisarg) {
  var self = this;
  var a = [];
  for(var i = 1;i < arguments.length;i++) {
    a.push(arguments[i])
  }
  return self.apply(thisarg, a)
};
FunctionItem.prototype.execute = function() {
  var self = this;
  return self.apply()
};
FunctionItem.prototype.x = FunctionItem.prototype.execute;
Q.prototype.createFunctionItem = function(func, args, thisarg, eventname) {
  var self = this;
  if(arguments[0] && typeof arguments[0] === "object" && arguments[0] && arguments[0].func && typeof arguments[0].func === "function") {
    var func = arguments[0].func;
    var args = arguments[0].args || undefined;
    var thisarg = arguments[0].thisarg || undefined;
    var eventname = arguments[0].eventname || undefined
  }
  return new FunctionItem(func, args, thisarg, eventname, self)
};
Q.prototype.add = function(func, args, thisarg, eventname) {
  var self = this;
  var wi;
  wi = self.createFunctionItem(func, args, thisarg, eventname);
  self.push(wi);
  return self
};
Q.prototype.addFunctionItem = Q.prototype.add;
Q.prototype._run = function(conf) {
  var self = this;
  if(conf) {
    self.setConf(conf)
  }
  if(self._pointer < self.length) {
    if(self.stopflag === true || self._breakpoint !== false && self._breakpoint === self._pointer) {
      self.stopflag = false;
      if(self.breakcallback) {
        self.breakcallback(self._pointer)
      }
    }else {
      if(self.breakIf()) {
        //break if this precondition is true
      }else {
        //self[self._pointer].x();
        //console.log(self._pointer);
        self[self._pointer]();
        self._pointer = self._pointer + 1;
        setTimeout(function() {
          self._run()
        }, self.outtime)
      }
    }
  }
  else if(self.daemon==true)
  {
    setTimeout(function() {
          self._run()
        }, self.outtime);
  }
  else
  {
    self.exitcallback();
  }
  return self
};
Q.prototype.setConf = function(conf) {
  var self = this;
  for(var z in conf) {
    self[z] = conf[z]
  }
  return self
};
Q.prototype.startDaemon = function()
{
  var self = this;
  return self.setConf({'daemon':true});
}

Q.prototype.stopDaemon = function()
{
  var self = this;
  return self.setConf({'daemon':false});
}

Q.prototype.start = function(conf) {
  var self = this;
  return self.startAt(0, conf)
};
Q.prototype.restart = Q.prototype.start;
Q.prototype.stop = function(conf) {
  var self = this;
  if(conf) {
    self.setConf(conf)
  }
  self.stopflag = true;
  return self
};
Q.prototype.resume = function(conf) {
  var self = this;
  if(self._pointer === self._breakpoint) {
    self.clearBreak()
  }
  return self._run(conf)
};
Q.prototype.startAt = function(start, conf) {
  var self = this;
  self._pointer = start || 0;
  return self._run(conf)
};
Q.prototype.breakBefore = function(stop, conf) {
  var self = this;
  if(conf) {
    self.setConf(conf)
  }
  self._breakpoint = stop;
  return self
};
Q.prototype.breakAfter = function(stop, conf) {
  var self = this;
  return self.breakBefore(stop + 1, conf)
};
Q.prototype.clearBreak = function(conf) {
  var self = true;
  if(conf) {
    self.setConf(conf)
  }
  self._breakpoint = false;
  return self
};
Q.prototype.startAtbreakBefore = function(start, stop, conf) {
  var self = this;
  self._pointer = start;
  self._breakpoint = stop;
  return self._run(conf)
};
Q.prototype.pause = function(val, conf) {
  var self = this;
  if(conf) {
    self.setConf(conf)
  }
  self.stop();
  setTimeout(function() {
    self.resume()
  }, val);
  return self
};
Q.prototype.setRate = function(hits, milsec) {
  var self = this;
  self.outtime = milsec / hits;
  return self
};
Q.prototype.setSecondRate = function(hits) {
  var self = this;
  return self.setRate(hits, 1 * 1E3)
};
Q.prototype.setMinuteRate = function(hits) {
  var self = this;
  return self.setRate(hits, 60 * 1E3)
};
Q.prototype.setHourlyRate = function(hits) {
  var self = this;
  return self.setRate(hits, 60 * 60 * 1E3)
};
Q.prototype.setDailyRate = function(hits) {
  var self = this;
  return self.setRate(hits, 24 * 60 * 60 * 1E3)
};
var createQ = function() {
  var q = new Q;
  return q
};
var q_interface = {create:createQ};
module.exports = q_interface.create();
module.exports.create = q_interface.create;