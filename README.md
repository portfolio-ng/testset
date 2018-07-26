A language agnostic live editing test suite
Autogenerate tests for individual functions from source utilising type fuzzing

#### Supported Languages:
* js : javascript EMCAScript 5+
* py : python 3.6+

#### Source Files
testsetedit.htm : live editing test HTML scaffolding    
srv_testSetEdit.py : simple server to run test suite on localhost   

#### Directory Tree
* dev/ : development folders of various languages
  * lang/ : language specific development
    * TEMPLATE_languageDir/ : acts as template for new languages
      funcTools.js
    * js/ : js testset src files
      testset.js : process tests
      testsetedit.js : live editing functionality
      testset_HTTP.js : HTTP requests for testset
      js_funcTools.js : js function call specifics
      ui.js : terse ui with live editing disabled
      * indi/ : project independant .js toolset
    * agn/ : where language specific actions are unecessary 'agn' folder contents can be used
    * py : py testset src files
      py_SRV_moduleImport.py : python specific functions for srv_ to import test module
      py_funcTools.js : python function call specifics
  * tools/ : JSON test file tooling
    * agn/ : language agnostic tooling on test JSON dada
      foldtests.py :
      quickchng.py : allows for quick changes to multiple tests in a test file
      explode.py : explode test file into individual tests
      implode.py : concat a directory of tests files into one
    * js/ : javascript specific test tooling
      composeCreate.py : autogenerate function test dada
      testset_jsCompose.py : build a template test framework
    * py/ : python specific test tooling
      composeCreate.py : autogenerate function test dada
      testset_pyCompose.py : build a template test framework
      importTest.py : import module to test 
  * templates/ : example templates files
    TEMPLATE_testconfig : used to configure tests for multiple projects
    TEMPLATE_tests.json : empty test dada file
* tests/ : the test set for testset
  panecomposepydocs.json : auto doc dada file
  testsetjs_tests.json : the tests for testset

#### JSON test config schema
```javascript
{
  "PROJ_NAME": {
    "projDir": "project directory",
    "projFileName": "project filename",
    "testFileDir": "directory of test file for project",
    "testFileName": "test file for project" 
  }
}
```

#### JSON test schema
```javascript
[
  {
    "funcname": "NAME OF FUNCTION TO TEST",
    "tests": [
      {
        "assert": [
          {
            "what": "ASSERTION",
            "where": "OBJ.PROPERTY"
          },
          {
            "what": "ASSERTION",
            "where": "OBJ.PROPERTY"
          }
        ],
        "expect": [
          {
            "what": "DESIRED VALUE",
            "where": "OBJ.PROPERTY.ANY.DEPTH"
          },
          {
            "what": "DESIRED VALUE",
            "where": "OBJ.PROPERTY.ANY.DEPTH"
          }
        ],
        "why": "TERSE, CONCISE EXPLANATION FOR THIS SPECIFIC TEST"
      }
    ]
  }
]
```
