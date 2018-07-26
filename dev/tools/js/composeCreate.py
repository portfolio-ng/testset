#!/usr/bin/env python3

#functions for creating new tests from and for js functions


import json
import linecache
import re
import sys



#each attribute is broken into its own function
# so future additions or subtractions can be
# easily made on an existing test suite
#  see : compose.py-> contemporise()
#         in contemporise() we use dir(composeCreate)
#         to determine which attributes are missing
# format: createtestATT[test object key name]()
def createtestATTfuncname(ftest,fdata):
  ftest["funcname"]=fdata["funcname"]
  return ftest

def createtestATTdesc(ftest,fdata):
  ftest["desc"]=fdata["thewhy"]
  return ftest

def createtestATTarguments(ftest,fdata):
  ftest["arguments"]=fdata["vars"]["pass"]
  return ftest
###



def createtestREQindi(fdata):
  #create test for individual function
  ftest={}
  ftest=createtestATTfuncname(ftest,fdata)
  ftest=createtestATTdesc(ftest,fdata)
  ftest=createtestATTarguments(ftest,fdata)
  ftest=createtestREQsubtest(ftest,fdata)
  return ftest

def createtest(testd):
  #create tests for all fucntions
  testtowrite=[]
  cnt=1 # will cnt testd, skip 0 meta data
  ltst=len(testd)
  while cnt < ltst:
    try:
      thistest=testd[cnt]["precomposed"]
      testtowrite.append(thistest)
    except:
      ftest=fdata=createtestREQindi(testd[cnt])
      testtowrite.append(ftest)
      #TOOLtoform(json.loads(ftest[:-1]),'p')
    cnt+=1
  return testtowrite

def createtestREQsubtest(ftest,fdata):
  # imagine.. a why for each test
  ###can be automated in parellel reasoning to assert and expect
  #ftdwhy=createtestREQtdwhy(fdata,fassert,fexpect)
  stest={}
  stest["why"]="" #standin until ftdwhy() is fully imagined
  fassert=createtestSubtestREQassert(fdata)
  #print(json.dumps(fassert,sort_keys=True,indent=2))
  fexpect=createtestSubtestREQexpect(fdata)
  stest["assert"]=fassert
  stest["expect"]=fexpect
  ftest["tests"]=[]
  ftest["tests"].append(stest)
  return ftest


def createtestSubtestREQexpect(fdata):
  aexp=fdata["vars"]["retd"]
  fexpect=[]
  if len(aexp)==0:
    fexpect.append({"what":None,"where":"without return"})
  else:
    for eai,ea in enumerate(aexp):
      expo={}
      if type(ea) == str:
        expo["where"]=ea
        expo["what"]="??"
      else:
        expo["where"]="$"+str(eai)
        expo["what"]=ea
      fexpect.append(expo)
  return fexpect




def createtestSubtestassertREQfrompmut(ea,fdata):
  #pmut or pass?
  #pmut=fdata["vars"]["pmut"]
  pmut=fdata["call"]["allpmut"]
  pmat=[]
  for val in pmut:
    pmat.append(val)
    # if will be useful when i correlate sub pmuts to topside
    ## right now just matching on pass
    ## but functions with obj.id, or elle.x, miss when pass is jsond, thought elle is jsond[i]
    #if val==ea or val.split(".",1)[0]==ea:
      #pmat.append(val)
  return pmat

# imagine a schema lookout to determine 'default' test values
def schemaPropChk():
  return "" #standing until schema lookup fully realised


def createtestSubtestREQassert(fdata):
  aexp=fdata["vars"]["pass"]
  fassert=[]
  if len(aexp)==0:
    fassert.append({"what":"()","where":"void function()"})
  else:
    for eai,ea in enumerate(aexp):
      for pea in createtestSubtestassertREQfrompmut(ea,fdata):

        ## TODO, imagine,
        ##    go through the AST to find instances of calling the function
        ##    use those for the assertions
        #print(json.dumps(pea,sort_keys=True,indent=2))
        tryo={}
        tryo["where"]=pea
        tryo["what"]=schemaPropChk()
        fassert.append(tryo)
  return fassert

