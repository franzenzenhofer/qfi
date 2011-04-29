Q  - a function processing queue for node.js
===

`q` ( /ˈkjuː/; named cue) is the love child of an array and an eventemitter

it supports all 
  
  * array https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array
  * and eventemitter http://nodejs.org/docs/v0.4.7/api/events.html

methods and properties. this is allready useful in itself, but there is more.

additonal `q` supports various native methods to 

  * store
  * execute
  * delay
  * iterate

functions.

INSTALL

      var q = require('/path/to/q.js');
      
or via npm (not yet published)

      >npm install q
      var q = require('q');
      
**Q**

**q properties**
  pointer
  breakpoint
  breakIf 
  breakcallback
  
**q methods**  
q.createFunctionItem 
q.add()  / q.addFunctionItem()
q.setConf
q.start 
q.restart
q.stop 
q.resume
q.startAt
q.breakBefore 
q.breakAt
q.clearBreak
q.startAtbreakBefore
q.pause
q.setRate
q.setSecondRate
q.setMinuteRate
q.setHourlyRate 
q.setDailyRate
q.create()

**FUNCTIONITEM**

**FunctionItem properties**
q[n].func
q[n].args
q[n].thisarg
q[n].eventname

**FunctionItem methods**
q[n]() / q[n].execute() / x()
q[n].apply()
q[n].call()
