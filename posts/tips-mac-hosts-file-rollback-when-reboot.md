---
title: hosts file rollback when reboot on mac
subject: "Mac下修改hosts文件重启后被还原的问题解决"
date: '2012-10-24'
time: '19:50'
categories: ["Studying"]
tags: 
- hosts
- hosts.ac
- Cisco AnyConnect
- mac
- lion
---

<img src="{{urls.media}}/img/work-hosts-cisco/title.jpg">

　　之前遇到一个诡异的问题，Lion下修改/etc/hosts文件后睡眠后或者重启后，即回滚至一个固定的版本，这个问题去年就遇到过，因为当时系统还有其它问题，就直接重新安装并升级到ML了，问题没了，也没理这事…
　　昨天突然发现原来我现在的系统里还有这个问题，感觉很诡异，一直想不到原因，总不能每次都重新安装系统吧...Google了一下，果然有人遇到同样的问题…解决方案是写一个固定版本号，研究了半天不能理解，继续Google，很快找到了原因...

　　仔细查找发现/etc目录下多了个hosts.ac文件，这个文件没见过，继续Google看看hosts.ac是什么文件..发现这个居然是Cisco AnyConnect（VPN的客户端）生成的文件，安装Cisco AnyConnect后它会生成一份hosts.ac文件，当每次打开Cisco AnyConnect或者机器重启、睡眠后，都会触发hosts.ac文件替换hosts文件…难怪我重新安装系统之后都好用的，而用着用着就突然不好用了，是因为我用到VPN时才会想着去安装Cisco AnyConnect...至此问题已经水落石出了，知道原因了，解决方案也就简单了，只要我以后修改hosts文件时，把hosts和hosts.ac这两个文件都修改就OK了…不过..但这也太弱了吧？索性把hosts.ac文件删除，然后给hosts建立一个软连接，重启之后发现两个hosts文件都不在了；继续尝试，删除hosts，给hosts.ac建立一个软链接，重启后发现连接又不在了，恢复了原样...  

　　经过几番折腾，最终解决方案如下：  
　　1.用[Gas Mask]<http://code.google.com/p/gmask/>来修改hosts，虽然每次还是还原了，但Gas Mask会帮你记录恢复前的内容，只要保存下就可以了；  
　　2.就用vi修改hosts和hosts.ac两个文件吧，或者个性hosts.ac，然后启动下Cisco AnyConnect就可以了；  
　　3.写一个脚本，修改hosts后，把内容输出到hosts.ac中；  

　　目前我采用的第一种方法解决的...
