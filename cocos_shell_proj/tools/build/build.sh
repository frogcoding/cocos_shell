#!/bin/bash
#author:lamyoung

your_game_name='cocos_shell'
your_target='web' #默认web平台
your_debug=0 #默认debug关闭
your_version=`date +%Y%m%d%H%M%S`

while getopts "t:dv:" arg  
do
    case $arg in
        t)
			your_target=$OPTARG
			;;
		v)
			your_version=$OPTARG
			;;
		d)
			your_debug=1
			;;
        ?)
			echo '----------------------------'	
			echo -e "-t [web:fb]\tbuild target"
			echo 'Options:'
			echo -e "-v version\tbuild version"
			echo -e "-d \t\tbuild debug"
			echo '----------------------------'
			exit 1;
			;;
    esac
done

if [ !$your_debug ]
then
	your_debug='debug=false'
else
	your_debug='debug=true'	
fi

echo "target:$your_target"  
echo "$your_debug"  
echo "version:$your_version"  

case $your_target in
	web)
		echo 'your target is web'
		/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path './../../' --build "platform=web-mobile;${your_debug};"
		gulp  -f build_web_gulpfile.js
		cd './../../build'
		zip -r "./web_${your_game_name}_${your_version}"  './web-mobile' 
		open ./
		;;
	fb)
		echo 'your target is fb'
		/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path './../../' --build "platform=fb-instant-games;${your_debug};md5Cache=false"
		gulp  -f build_fb_gulpfile.js
		cd './../../build'
		zip -r "./fb_${your_game_name}_${your_version}"  './fb-instant-games' 
		open ./
		;;
	*)
		echo '-t must be in [web/fb]'
		;;
esac
