---
title: tips for mac
subject: "Mac上的一些小记录，持续更新..."
date: '2012-08-22'
time: '15:06'
categories: ["Studying"]
tags: 
- mac
- tips
- lion
- OSX
- apple
---
<img src="{{urls.media}}/img/tips-mac/title.jpg"/>

###1、右键弹出菜单重复，如何去除重复项？

	在Terminator下执行
	/system/library/frameworks/coreservices.framework/versions/a/frameworks/launchservices.framework/versions/a/  support/lsregister -kill -r -domain local -domain system-domainuser
	即可  
  
###2、Chrome的插件地址在哪里？  

	/Users/ecchanger/Library/Application Support/Google/Chrome/Default/Extensions/kpfmckjjpabojdhlncnccfhkfhbmnjfi/0.1.5_0` 

###3、java/ruby/python等语言的系统安装路径在哪里？

>在下面这个目录下：/System/Library/Frameworks

###4、Mac下如何快速安装字体？
>有三种方法：  
>1. 把平时下载的字体复制到“资源库”下的Fonts下就行了（资源库如果在Finder里找不到，可以在Terminator下执行`cd /Library/Fonts`，然后执行`open .`就可以打开了）；  
>2. 用“应用程序”中的“字体册”安装，打开字体册，选安装字体，然后到字库文件夹下全选即可；  
>3. 双击字体，这个适合先预览再安装，单个安装；  
  
###5、安装字库后，PS启动报错了  
>由于我安装字体后，有部分错误的字体存在，造成ps出错，只要用“字体册”，选择全部字体后，左上角点选验证字体，它就能把错误的字体查出来，把它们都删除了，就能解决问题。

###6、安装字库后Safari里看部分网页，字体改变了  
>这个是由于安装的部分字体与系统自带字体有冲突，影响了safari默认字体，删除这些字体就可以正常显示。打开"字体册"，大家细心留意一下，字体的右边会有一个小黑点。这就是系统正用运用的一些字体。只要大家把相应的字体找出来，停用或删去，就能正常显示了。

###7、如何在Finder标题栏上显示完整路径？
	##在Terminator中输入
	defaults write com.apple.finder _FXShowPosixPathInTitle -bool YES
	##然后关闭Finder再打开就可以显示全路径啦...对着路径最左边的小图标点右键，就能快速访问路径中的任意一层…

###8、直接用Terminator来进行MD5/SHA1校验  
>在Terminator中输入需要验证类型的终端命令（MD5的你命令是md5，SHA1的命令是shasum）后加上一个空格，然后将需要校验的文件拖拽到终端窗口，命令生成后按下回车即可。

###9、切换MenuBar中的系统系统图标和当前应用程序的图标  
>安装[AccessMenuBarApps](http://www.ortisoft.de/en/accessmenubarapps/ "AccessMenuBarApps")小插件即可，可以设定快捷键和鼠标手势来切换当前应用程序图标与系统图标。  

###10、Moutain Lion 10.8.2下开启SSD的Trim
	##在命令行下执行以下命令：  
	##1.备份文件
	sudo cp /System/Library/Extensions/IOAHCIFamily.kext/Contents/PlugIns/IOAHCIBlockStorage.kext/Contents/MacOS/IOAHCIBlockStorage /System/Library/Extensions/IOAHCIFamily.kext/Contents/PlugIns/IOAHCIBlockStorage.kext/Contents/MacOS/IOAHCIBlockStorage.original

	##2.激活Trim
	sudo perl -pi -e 's|(\x52\x6F\x74\x61\x74\x69\x6F\x6E\x61\x6C\x00).{9}(\x00\x51)|$1\x00\x00\x00\x00\x00\x00\x00\x00\x00$2|sg' /System/Library/Extensions/IOAHCIFamily.kext/Contents/PlugIns/IOAHCIBlockStorage.kext/Contents/MacOS/IOAHCIBlockStorage

	##3.清理cache  
	sudo kextcache -system-prelinked-kernelsudo kextcache -system-caches

	##4.重启  

参考地址：<http://digitaldj.net/2011/07/21/trim-enabler-for-lion/#comments>  

###11、如何将 Mac 系统中任意文件/文件夹放到 Finder 边栏  
>1.在Finder中将文件夹直接拖到边栏即可；  
>2.在 Finder 中找到想要放到边栏的文件/文件夹，使用快捷键 Command+T；  

###12、在 Lion 和 Mountain Lion中如何刷新DNS  
	##在Terminator中执行
	sudo killall -HUP mDNSResponder
	##即可；  

###13、从 Mac OS X 菜单栏获取 WiFi 连接详细信息  
>按住 option 键点击 WiFi 图标，会显示当前连接 WiFi 节点的详细信息  

###14、在 Lion 和 Mountain Lion中如何显示“资源库”   
	##1.直接在Terminator中运行
	chflags nohidden ~/Library/
	##如果想隐藏，就运行
	chflags hidden ~/Library/
	##2.在Terminator中运行
	cd /Library
	##，然后再运行
	open .
	##就可以打开；  

`PS：以上大部分技巧来自网上，本人只负责收集整理...`

