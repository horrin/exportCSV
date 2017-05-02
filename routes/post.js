var express = require('express');
var genCSV = require("./genCSV.js")

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'API Test' });
});


router.post('/', function (req, res, next) {
  console.log("receive Json: " + req.body.post_json);


  let fixedJson = genCSV.fixedJson(JSON.parse(req.body.post_json).results);

  var result = genCSV.exportExcel(fixedJson);

  var path = __dirname + "/../public/files/file.csv";
  console.log(path);

  genCSV.WriteFile(path, result)
    .then(function () {
      //  console.log("Shoul pop later: "+__dirname);

      res.download(path, 'testData.csv', function (err) {
        if (err)
        { console.log(err); }
        else {
          
          console.log("download finished.")
          // return res.status(200).send("Success"); 
        }

      });



    })
    .catch(err => {
      return res.status(500).send(err);
    })


})

module.exports = router;
