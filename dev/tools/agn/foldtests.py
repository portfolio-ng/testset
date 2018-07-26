#!/usr/bin/env python3

#  ?? needs description


import json
import sys

def TOOLtoform(toform,instruction):
  if instruction == "print" or instruction == "p":
    formd=json.dumps(toform,indent=2,sort_keys=True)
    print(formd)
    #print(formd,"\n^^^^^^^^^^^^^^^\n")
    ret=0
  if instruction == "return" or instruction == "r":
    formd=json.dumps(toform,indent=2,sort_keys=True)
    ret=formd
  return ret

def findfold(jtst,foldinto):
  for ei,ea in enumerate(jtst):
    if ea["funcname"]==foldinto:
      return jtst[ei]
  print("unable to find the function to fold others into")

def fold(jtst,foldinto,foldfrom):
  tstinto=findfold(jtst,foldinto)
  olen=len(tstinto["tests"])
  for ea in foldfrom:
    tstfrom=findfold(jtst,ea)
    for tea in tstfrom["tests"]:
      tstinto["tests"].append(tea)
  print("alltests = ")
  TOOLtoform(jtst,"p")
  #print(olen,len(tstinto["tests"]))

def onit():
  spl=sys.argv[1].split(",")
  foldinto=spl[0]
  foldfrom=spl[1:]
  tsfn=sys.argv[2]
  fole=open(tsfn,"r")
  next(fole) #skip first line: alltests=;
  predict=""
  for line in fole:
    predict+=line
  jtst=json.loads(predict)
  fold(jtst,foldinto,foldfrom)
onit()
#imagine, -r REG_EXP flag
#./foldtests.py "tack,tackOPTtopright,tackOPTbottomleft" /home/cing/cinger/proj/pane/tests/tests.json
#./foldtests.py FOLD_FN REG_EXP LOC/TEST_FILE_NAME.json
