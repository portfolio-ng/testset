#!/usr/bin/env python3
# explode a test file into individual functions

import sys
import json

def helper():
  print("  ./explode.py FILE_NAME               # explodes a test file")
  print("  ./explode.py FILE_NAME -f FUNC_NAME  # removes a function from test file")
  sys.exit(0)


def loadJSON(ins):
  fn=ins[0]
  try:
    jsond=json.loads(open(fn,'r').read())
  except:
    try:
      fi=open(fn,'r').read()
      tests=fi.split("alltests = ")[1]
      jsond=json.loads(tests)
    except err:
      print("  "+fn+": bad filename or invalid json")
      print("err:",err)
      helper()
  return jsond


def removeFunction(jsond,ins):
  #ins=["|","FUNC,FUNC, .."]
  #ins[0]=="|" signalling a jsond pipe
  remFuncs=ins[1].split(",")  # str(FUNC,FUNC,FUNC)->[FUNC,FUNC,FUNC]
  ole_jsond=jsond[:]
  jsond=[]
  for ea in ole_jsond:
    if ea["funcname"]not in remFuncs:
      jsond.append(ea)
    else:
      fn="test."+ea["funcname"]
      writeToJS(fn,[ea])
  writeToJS("alltests",jsond)
  return jsond

def explode(jsond):
  for ea in jsond:
    fn="test."+ea["funcname"]
    writeToJS(fn,[ea])
  return jsond

def cmdLine(args):
  funcCalls=[]
  #-f : functionName(), this will remove this function from tests file
  print(args)
  if len(args)>1: #args[0]==basename
    if args[1]=="-h" or args[1]=="--help":
      #helper()
      funcCalls.append(["helper"])
    else:
      fn=args[1]
      funcCalls.append(["loadJSON",[fn]])
      if len(args)>2:
        if args[2]=="-f":
          remFunc=args[3]
          funcCalls.append(["loadJSON",[fn]])
          funcCalls.append(["removeFunction",["|",remFunc]])
      else:
        funcCalls.append(["loadJSON",[fn]])
        funcCalls.append(["explode",["|"]])
  else:
    #helper()
    funcCalls.append(["helper"])
  return funcCalls


def writeToJS(fn,jsond):
  fo=open("tmp."+fn+".js","w")
  fo.write("alltests = "+json.dumps(jsond,sort_keys=True,indent=2))
  fo.close

def writeToJSON(fn,jsond):
  fo=open("tmp"+fn+".json","w")
  fo.write(json.dumps(jsond,sort_keys=True,indent=2))
  fo.close()


def onit():
  funcCalls=cmdLine(sys.argv)
  for ea in funcCalls:
    if len(ea[1])==0:
      jsond=globals()[ea[0]]()
    else:
      if len(ea[1])>0:
        if ea[1][0]=="|":
          if len(ea[1])==1:
            jsond=globals()[ea[0]](jsond)
          else:
            jsond=globals()[ea[0]](jsond,ea[1])
        else:
          jsond=globals()[ea[0]](ea[1])

  #writeToJSON(jsond)
  #print(jsond)

if __name__=='__main__':
  onit()
print("..01x17")
#./explode.py FILE_NAME -f FUNC_NAME  # removes a function from test file
#./explode.py FILE_NAME               # explodes a test file
