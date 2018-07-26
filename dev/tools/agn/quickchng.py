#!/usr/bin/env python3
# allows for quick ugly changes to multiple tests in a tests.json file
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

def fold(jtst):
  for ei,ea in enumerate(jtst[47]):
    #tstfrom=findfold(jtst,ea)
    for tei,tea in enumerate(jtst[47]["tests"]):
      #TOOLtoform(tea,"p")
      for asi,ase in enumerate(tea["assert"]):
        if ase["where"]=="elle":
         # print("elle")
          #TOOLtoform(ase["what"],"p")
          nuase={}
          nuase["where"]="obj"
          nuase["what"]={}
          nuase["what"]["jsond"]=[]
          nuase["what"]["elle"]={}
          for el in ase["what"]:
            #print(el)
            if el!="tackhei" and el!="tackwid":
              nuase["what"]["elle"][el]=ase["what"][el]
          #TOOLtoform(nuase,'p')
          tea["assert"][asi]=nuase
          #TOOLtoform(tea,'p')
      for esi,ese in enumerate(tea["expect"]):
        nuese=[]
        nuese.append({})
        nuese[0]["where"]="elle"
        nuwhat={}
        #print("ese:",ese)
        if type(ese["what"])==dict:
          for el in ese["what"]:
            if el!="tackhei" and el!="tackwid":
              nuwhat[el]=ese["what"][el]
        else:
          nuwhat=ese["what"]
        nuese[0]["what"]=nuwhat
        tea["expect"]=nuese
      #tstinto["tests"].append(tea)
  print("alltests = ")
  TOOLtoform(jtst,"p")
  #print(olen,len(tstinto["tests"]))

def onit():
  tsfn=sys.argv[1]
  fole=open(tsfn,"r")
  next(fole) #skip first line: alltests=;
  predict=""
  for line in fole:
    predict+=line
  jtst=json.loads(predict)
  fold(jtst)
onit()
#imagine, -r REG_EXP flag
#./quickchng "/home/cing/cinger/proj/pane/tests/tests.json"
#./quickchng FOLD_FN REG_EXP LOC/TEST_FILE_NAME.json
