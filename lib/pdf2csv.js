//pdf2csv.js
var http = require('http');
var iconv = require('iconv-lite');


exports.pdf2csv = function(pdfname, csvname){
  var PFParser = require('pdf2json'),
      _ = require('underscore');

  var pdfParser = new PFParser();
  var self = {};
 
  function urldecode(url) {
    return decodeURIComponent(url.replace(/\+/g, ' '));
  }

  function getText(marks, ex, ey, v) {
    var x = marks[0].x;
    var y = marks[0].y;
 
    var txt = '';
    for (var i = 0; i < marks.length; i++) {
      var c = marks[i];
      var dx = c.x - x;
      var dy = c.y - y;
 
      if (Math.abs(dy) > ey) {
        // txt += "\"\n\"";
        if (marks[i+1]) {
          // line feed - start from position of next line
          x = marks[i+1].x;
        }
      } else {
        if (Math.abs(dx) > ex) {
          txt += "\",\"";
        }
      }

      if (!c)
        txt += "\"\n\"";
      else if (c == -1)
        txt += "\",\"";
      else {
        var cell = '';
        for (var j = 0; j < c.R.length; j++) {
          cell += c.R[j].T;
        }
        txt += urldecode(cell);
      }
 
      x = c.x;
      y = c.y;  
    }

    return txt;
  }

  function csv(pages) {
    var res = '"';
    for (var i = 0; i < pages.length; i++) {
      res += getText(pages[i].Texts, 1, 1, false);
    }
    return res.slice(0, -2) + "\n";
  }

  function handleTexts(pages) {
    pages.map((page, i) => {
      var pageTexts = page.Texts;
      var arr = [22, 2, 6, 8, 10, 24, 16, 18, 14, 20];
      page.Texts = [];

      arr.map(val => {
        page.Texts.push(pageTexts[val]);
        page.Texts.push(-1);
      });
      page.Texts.push('');
    });
    return pages;
  }

  function ready(x) {
    x.formImage.Pages = handleTexts(x.formImage.Pages);
    var output = csv(x.formImage.Pages);

    var fs = require('fs');
    fs.writeFile(csvname, output, function(err) {
    // fs.writeFile(csvname + '.tmp', output, function(err) {
      if(err) {
        console.log("Error saving: " + err);
      } else {
        // // Decode stream (from binary stream to js strings)
        // http.createServer(function(req, res) {
        //     var converterStream = iconv.decodeStream('utf8');
        //     req.pipe(converterStream);

        //     converterStream.on('data', function(str) {
        //         console.log(str); // Do something with decoded strings, chunk-by-chunk.
        //     });
        // });

        // // Convert encoding streaming example
        // fs.createReadStream(csvname + '.tmp')
        //     .pipe(iconv.decodeStream('utf8'))
        //     .pipe(iconv.encodeStream('big5'))
        //     .pipe(fs.createWriteStream(csvname));
        // fs.unlink(csvname + '.tmp');

        // // Sugar: all encode/decode streams have .collect(cb) method to accumulate data.
        // http.createServer(function(req, res) {
        //     req.pipe(iconv.decodeStream('utf8')).collect(function(err, body) {
        //         assert(typeof body == 'string');
        //         console.log(body); // full request body string
        //     });
        // });
        console.log("The file was saved!");
      }
    });
  }

  function error(e) {
    console.log("error: " + JSON.stringify(e));
  }

  pdfParser.on("pdfParser_dataReady", _.bind(ready, self));
  pdfParser.on("pdfParser_dataError", _.bind(error, self));

  pdfParser.loadPDF(pdfname);

}

