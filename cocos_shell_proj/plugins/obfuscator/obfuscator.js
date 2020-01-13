const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../../assets/Texture/static');
const scenePath = path.join(__dirname, '../../assets/Scene');
const prefabPath = path.join (__dirname, '../../assets/');
console.log(scenePath);

fs.readdir(directoryPath, function (err, files) {
    
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    files.forEach(function (file) {
        if(file.indexOf("meta") != -1) {
            let filePath = directoryPath +"/" + file;
            // 读取文件meta
            let rawdata = fs.readFileSync(filePath);
            let student = JSON.parse(rawdata);
            if(null == student.subMetas[getFileName(file)])
                continue;
            let olduuid = student.subMetas[getFileName(file)].uuid;
            let newuuid = createUUID();
            console.log(olduuid, newuuid);
            //修改meta文件id
            student.subMetas[getFileName(file)].uuid = newuuid;
            fs.truncate(filePath, 0, function(){
                console.log('done')
                //写入修改后的内容
                fs.writeFileSync(filePath, JSON.stringify(student),"utf8");
                //去遍历场景文件
                fs.readdir(scenePath, function (err, files) {
                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    } 
                    //同步场景资源的更新
                    syncSceneUUID(files, scenePath, olduuid, newuuid);
                    //同步预制体的更新 
                    syncPrefabUUID(file, prefabPath, olduuid, newuuid);
                });
                
            });
        }
    });
});


 //同步场景资源的更新
function syncSceneUUID (files, scenePath, olduuid, newuuid) {
    files.forEach(function (file) {
        if(file.indexOf("meta") == -1) {
            let filePath = scenePath +"/" + file;
            //console.log(filePath);
            let rawdata = fs.readFileSync(filePath);
            let student = JSON.parse(rawdata);
            //console.log(student);
            for(var i = 0; i < student.length; i++) {
                if(null != student[i]["__type__"]  && student[i]["__type__"] == "cc.Sprite" )  {
                    var temp = student[i]["_spriteFrame"];
                    if(null != temp && olduuid == temp["__uuid__"]) {
                        temp["__uuid__"] = newuuid;
                        console.log("oldpath:" + olduuid);
                        console.log("newpath:" + temp["__uuid__"]);
                    } 
                }
            }
            fs.truncate(filePath, 0, function(){
                fs.writeFileSync(filePath, JSON.stringify(student),"utf8");
                console.log('done')
            });
        }
       
    });
}
//同步预制体的更新 
function syncPrefabUUID (files, prefabPath, olduuid, newuuid) {

}

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

function getFileName (filename) {
    if(null == filename) {
        console.error("filename is null");
        return null;
    }
    var tmp = filename.indexOf(".");
    var retStr = filename.substr(0, tmp);
    return retStr;
}


















