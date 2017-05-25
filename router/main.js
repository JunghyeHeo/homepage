// module.exports 는 모듈을 생성하는 부분으로 다른 파일에서 require 할 수 있다.
module.exports = function(app, fs)
{

    var fs = require('fs');    			// 파일시스템 모듈
    var express = require('express');   // express 모듈
    var app = express();                // express 객체 생성
    var http = require('http');         // Http 웹 서버 모듈
    var server = http.createServer(app);    // 서버 객체 생성

    app.set('port',7080);      // 서버 포트 설정

    server.listen(app.get('port'),function(){       // 서버 가동 
         console.log('Express server listening on port ' + app.get('port'));
    });
    
    app.get('/public/image/:name',function (req,res){     
    var filename = req.params.name;
    console.log(__dirname+'/public/images/'+filename);
    fs.exists(__dirname+'/public/images/'+filename, function (exists) {
        if (exists) {
            fs.readFile(__dirname+'/public/images/'+filename, function (err,data){
                    res.end(data);
                });
            } else {
                res.end('file is not exists');
            }
        })
    });

     app.get('/',function(req,res){
         res.render('index', {
             title: "MY SHOPPINGMALL",
             length: 5
         })
     });

    app.get('/list', function (req, res) {
       fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
       });
    });

    app.get('/getUser/:username', function(req, res){
       fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
       });
    });

    app.post('/addUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });


    app.put('/mergeUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            // ADD/MODIFY DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });


    app.delete('/deleteUser/:username', function(req, res){
        var result = { };
        //LOAD DATA
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            // DELETE FROM DATA
            delete users[req.params.username];

            // SAVE FILE
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            })
        })

    })

}
