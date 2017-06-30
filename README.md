安裝
=
```
# 你需要有Git(或者你想要下載為zip)和NodeJS
git clone https://github.com/WeiZhiHuang/pdf-js-csv.git
npm install 或 yarn install
```

使用
=
```
你只要拖曳PDF檔案至main.bat(Windows)，程式就會自動轉換PDF成CSV。
如果你想要轉換成其他編碼，只需要修改lib/pdf2csv.js裡面的big5部分成其他編碼即可。
如果你的作業系統不是Windows，你只需要使用"node main [待轉換的PDF.pdf] [轉換後的CSV後的.csv]"即可。
```

Install
=
```
# You need to have Git(or you want to download with zip) and NodeJS
git clone https://github.com/WeiZhiHuang/pdf-js-csv.git
npm install or yarn install
```

Usage
=
```
You only need to drop your PDF file into the main.bat(just for Windows), and it will auto covert your PDF file
    to CSV file with big5 encode.
If you need to covert it to other encode method, you can modify lib/pdf2csv.js to another encode method.
If your operation system is not Windows, you can use it too, just use
    "node main [inputPDFfile.pdf] [outputCSVfile.csv]".
```