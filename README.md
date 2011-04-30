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

**USE CASES**
  
  * usefull if you work with REST APIs that have rate limits. 
  * zillion other things 

**INSTALL**

      var q = require('/path/to/q.js');
      
or via npm (not yet published)

      >npm install q
      var q = require('q');
      
**Q**

**q properties**
  pointer
  breakpoint
  breakIf 
  
  daemon
  outtime
  
  breakcallback(pointer)
  exitcallback()
  
**q methods**  

      //returns a new FunctionItem
      q.createFunctionItem(func, args, thisarg, eventname)
      
      
      //adds a new FunctionItem to q
      //more details see the section about FunctionItem
      q.add(func, args, thisarg, eventname)
      //===
      q.addFunctionItem(func, args, thisarg, eventname)

      //set the properties of q
      q.setConf(confobject)
      
      //start daemon mode
      //q waits if new FunctionItems get added (and then executes them)
      q.startDaemon()

      //turn of deamon mode
      q.stopDaemon()

      //executes all stored FunctionItems from q[0]
      //takes an optional conf object -> see q.setConf
      q.start(conf) 
      // ===
      q.restart(conf)

      //stop execution of FunctionItems  
      q.stop(conf) 
      
      //if execution of FunctionItems was stopped
      //`resume` continues execution where it was stopped
      q.resume(conf)
      
      //executes all FunctionItmes starting from q[start]
      q.startAt(start, conf)
      
      //stops execution before q[stop] gets executed
      q.breakBefore(stop,conf) 
      
      //stops execution after q[stop] was executed
      q.breakAfter(stop,conf)

      //deletes the brek set with q.breakBefore and q.breakAfter  
      q.clearBreak(stop,conf)
      
      //start execution from q[start], stop execution before q[stop] 
      q.startAtbreakBefore(start, stop, conf)

      //pauses execution for `milsec` milseconds 
      //q.pause(milsec,conf)

      //define how fast the FunctionItmes in q get executed (how many `hits`(executions) during `milisec`) 
      //q.setRate(hits, milsec)

      //how many executions should happen in one second
      q.setSecondRate(hits)

      //how many executions should happen in one minute/hour/day 
      q.setMinuteRate
      q.setHourlyRate 
      q.setDailyRate

      //create a new (blank) q
      q.create()

**FUNCTIONITEM**

**FunctionItem properties**
      
      //stores a function 
      q[n].func
      
      //storeas an arguements array
      q[n].args

      //stores a `this` value of `func`
      q[n].thisarg

      //after `func` gets executed, this event is emitted (with the returnvalue of `func`)
      q[n].eventname

**FunctionItem methods**
      
      //FunctionItems are ...ta da... functions 
      //executes the stored FunctionItem, with the values storred in FuncionItem
      q[n]()
      //===
      q[n].execute()
      //===
      q[n].x()

      //similar to https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/function/apply
      // applies thisarg and args instead of the FunctionItems storred values
      q[n].apply(thisarg, args)
  
      //similar to https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/function/call
      //applies thisarg and arg1, ... instead of the FunctionItems storred values
      q[n].call(thisarg, arg1, arg2, arg3, ...)
