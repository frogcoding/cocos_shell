const fs = require('fs');
const path = require('path');
// let rawdata = fs.readFileSync('test.json');
// let student = JSON.parse(rawdata);
// //console.log(student);

// console.log(student instanceof Array)//true;
// let type = student instanceof Array;

const directoryPath = path.join(__dirname, '../../assets/Texture/static');
//const scenePath = path.join(__dirname, '../../assets/Scene');
console.log(scenePath);

fs.readdir(directoryPath, function (err, files) {
    
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        if(file.indexOf("meta") != -1) {
            var filePath = directoryPath +"/" + file;
            // 读取文件meta
            let rawdata = fs.readFileSync(filePath);
            let student = JSON.parse(rawdata);
            //console.log(file); 
            //console.log(student);
            var olduuid = student["uuid"];
            var newuuid = createUUID();
            console.log(olduuid, newuuid);
            //修改meta文件id
            student["uuid"] = newuuid;
            fs.truncate(filePath, 0, function(){
                console.log('done')
                //写入修改后的内容
                fs.writeFileSync(filePath, JSON.stringify(student),"utf8");
                //去遍历场景文件

                //去遍历library目录
            });
        }
    });
});


//create uuid
function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}


// 按照路径划分 ： 
//Textures, Scenes, Library

//按照类型划分
//image, scene

//check wheter it is a array 
// if(type) {
//     var uuid = createUUID();
//     console.log('uuid = ' + uuid);
//     for(var i = 0; i < student.length; i++) {
//         if(null != student[i]["__type__"]  && student[i]["__type__"] == "cc.Sprite" )  {
//             var temp = student[i]["_spriteFrame"];
//             console.log(temp["__uuid__"]);
//         }

//     }
// }



















