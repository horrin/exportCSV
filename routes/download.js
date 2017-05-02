var express = require('express');
var router = express.Router();
var genCSV = require("./genCSV.js")

/* GET home page. */
router.get('/', function (req, res, next) {

  var result = genCSV.exportExcel();

  var path = __dirname + "/../public/files/file.csv";
  console.log(path);

  genCSV.WriteFile(path, result)
    .then(function () {
      //  console.log("Shoul pop later: "+__dirname);

      res.download(path, 'testasdfasdf.csv', function (err) {
        if (err)
        { console.log(err); }
        else
        { console.log("download finished.") }

      });



    })
    .catch()


  //  res.download('public/files/file.csv');

  // console.log(createCSV);

  // Promise.all([createCSV]).then(function(){console.log("Shoul pop later: "+__dirname);})

  //res.render('index', { title: 'Express' });
});

module.exports = router;
