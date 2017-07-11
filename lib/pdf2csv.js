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
        txt += "\"\n\"";
        if (marks[i+1]) {
          // line feed - start from position of next line
          x = marks[i+1].x;
        }
      } else {
        if (Math.abs(dx) > ex) {
          txt += "\",\"";
        }
      }

      if (c) {
        var cell = '';
        for (var j = 0; j < c.R.length; j++) {
          cell += c.R[j].T;
        }
        txt += urldecode(cell);
      }
      else
        txt += "\"\n\"";
 
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
    return res + '"';
  }

  function handleTexts(pages) {
    pages.map((page, i) => {
      var pageTexts = page.Texts;
      var mapBreak = false;
      var indexFix = indexFixTmp = breakCount = 0;
      var arr = [21, 22, 27, 28, '', 30, 31, 1, 2, '', 5, 6, '', 7, 8, '', 9, 10, '', 15, 16, '', 17, 18, '', 13, 14, '', 19, 20, 35, 36, 37, 38, 39, 41, 43, ''];
      page.Texts = [];
      arr.map(val => {
        if (!val)
          page.Texts.push('');
        else
          page.Texts.push(pageTexts[val]);
      });
      pageTexts.map((text, i) => {
        if (!i)
          mapBreak = false;
        else if (pageTexts[i].x == 32.33)
          mapBreak = true;
        if (mapBreak || breakCount-- > 0)
          return;
        if (i > 43) {
          if ((i - 43 - indexFix) % 5 == 0) {
            var n = 1;
            indexFixTmp = indexFix;
            while (pageTexts[i+n].y == pageTexts[i].y && pageTexts[i+n].x != 32.33) {
              pageTexts[i].R[0].T += pageTexts[i+n].R[0].T;
              indexFix++;
              n++;
            }
            breakCount = indexFix - indexFixTmp;
            var tmp1 = page.Texts[page.Texts.length-2].R[0].T;
            var tmp2 = pageTexts[i-1].R[0].T;
            page.Texts[page.Texts.length-2].R[0].T = pageTexts[i].R[0].T;
            page.Texts[page.Texts.length-1].R[0].T = tmp1;
            pageTexts[i].R[0].T = tmp2.replace(/%20%2F%20/g, "\",\"");
          }
          page.Texts.push(pageTexts[i]);
        }
      });
      page.Texts.push('', '', '');
    });
    return pages;
  }

  function ready(x) {
    x.formImage.Pages = handleTexts(x.formImage.Pages);
    var output = csv(x.formImage.Pages);

    var fs = require('fs');
    fs.writeFile(csvname + '.tmp', output, function(err) {
      if(err) {
        console.log("Error saving: " + err);
      } else {
        // Decode stream (from binary stream to js strings)
        http.createServer(function(req, res) {
            var converterStream = iconv.decodeStream('utf8');
            req.pipe(converterStream);

            converterStream.on('data', function(str) {
                console.log(str); // Do something with decoded strings, chunk-by-chunk.
            });
        });

        // Convert encoding streaming example
        fs.createReadStream(csvname + '.tmp')
            .pipe(iconv.decodeStream('utf8'))
            .pipe(iconv.encodeStream('big5'))
            .pipe(fs.createWriteStream(csvname));
        fs.unlink(csvname + '.tmp');

        // Sugar: all encode/decode streams have .collect(cb) method to accumulate data.
        http.createServer(function(req, res) {
            req.pipe(iconv.decodeStream('utf8')).collect(function(err, body) {
                assert(typeof body == 'string');
                console.log(body); // full request body string
            });
        });
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

