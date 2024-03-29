---
title: awk-oneliner-4
subject: "详解著名的awk Oneliner，第四部分：定义字符串和数组"
date: '2012-04-12'
time: '00:37'
categories: ["Coding","Studying"]
tags:
- shell
- awk
---

>本文转自网络，如有侵权，请联系本人删除！
>[原文](http://www.catonmat.net/blog/update-on-famous-awk-one-liners-explained/)
>[引自](http://roylez.herokuapp.com/2010/07/29/awk-oneliner-translation-4.html)

##第四部分：定义字符串和数组
####创建一个固定长度的字符串

	awk 'BEGIN { while (a++<513) s=s "x"; print s }'

这个段程序用BEGIN这个特殊的匹配模式让后面的代码在awk试图读入任何东西前就执行。在里面是一个被执行了513次的循环，每次循环中“x”都被添加到变量s的最后。循环结束后，s的内容被输出。因为这段代码只有这一句，所以awk在执行完BEGIN模式语句后就退出了。

这段循环代码不仅仅可用在BEGIN中，你可以在awk的任何代码段里面使用，包括END。

很不幸这段代码不是最有效率的，这是一个线性的解决方案。10 Awk Tips, Tricks and Pitfalls的作者 waldner 有一个非线性的解决方案

	function rep(str, num, remain, result) {
		if (num<2){
	  	remain=(num==1)
		}else{
			remain=(num%2==1)
			result=rep(str,(num-remain)/2)
		}
		return result result (remain?str:"")
	}

我看不懂，被这awk oneliner的作者蒙了，没成高手…T_T

这个函数可以这样用

	awk 'BEGIN { s = rep("x", 513) }'

####在某个位置插入指定长度的字符串

	gawk --re-interval 'BEGIN{ while(a++<49) s=s "x" }; { sub(/^.{6}/,"&" s) }; 1'

这段代码只能在gawk下使用，因为它用到了interval expression，即这里的{6}，作用是让前一个字符.匹配多次。.{6}便可以匹配6个任意字符。gawk使用interval expression需要用到参数-re-interval。

同前一例一样，首先在BEGIN段里面，一个叫做s的49个字符长的字符串被建立了。接下来是对每一行，进行替换，&这里代表的是匹配的字符串部分，所以sub的结果是将每一行第7个字符开始的内容替换成了s。然后是逐行输出。

如果不是gawk，需要这样写

	awk 'BEGIN{ while(a++<49) s=s "x" }; { sub(/^....../,"&" s) }; 1'
orz

####利用字符串建立数组

这里数组这个翻译，其实并不能十分正确的表达Array的含义。鉴于大部分时候大家都是这么叫的，这里也用数组代表Array。

	split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", month, " ")

很简单，数组month被初始化了。month[1]的内容是Jan，month[2]是Feb，….

建立用字符串做编号的数组（类似Ruby的Hash，Python的dict）

	for (i=1; i<=12; i++) mdigit[month[i]] = i

很明了，所以不说了，用到了上面的month数组。

####输出第5个字段为abc123的行

	awk '$5 == "abc123"'

没什么好说的，等价于

	awk '$5 == "abc123" {print $0}'

####输出第5个字段不为abc123的行

	awk '$5 != "abc123"'

也等价于

	awk '$5 != "abc123" {print $0}'

或

	awk '!($5 == "abc123")'

输出第7字段匹配某个正则表达式的行

	awk '$7  ~ /^[a-f]/'

这里用了~来进行正则表达式的匹配哦。如果你要不匹配的行，可以

	awk '$7 !~ /^[a-f]/'