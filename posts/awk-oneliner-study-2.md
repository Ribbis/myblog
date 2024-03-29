---
title: awk-oneliner-2
subject: "详解著名的awk Oneliner，第二部分：文本替换"
date: '2012-04-06'
time: '00:37'
categories: ["Coding","Studying"]
tags:
- shell
- awk
---

>本文转自网络，如有侵权，请联系本人删除！
>[原文](http://www.catonmat.net/blog/awk-one-liners-explained-part-two/)
>[引自](http://roylez.herokuapp.com/2010/04/28/awk-oneliner-translation-2.html)

##第二部分：文本替换
####将Windows/dos格式的换行(CRLF)转成Unix格式(LF)

	awk '{ sub(/\r$/,""); print }'

这条语句使用了sub(regex,repl,[string])函数。此函数将匹配regex的string替换成repl，如果没有提供string参数，则$0将会被默认使用。$0的含义在上一篇已经介绍过，代表整行。这句话其实是将\r删除，然后print语句在行后自动添加一个ORS，也就是默认的\n。

####将Unix格式的换行(LF)换成Windows/dos格式(CRLF)

	awk '{ sub(/$/,"\r"); print }'

这句话同样使用了sub函数，它将长度为0的行结束符$替换成\r，也就是CR。然后print语句在后面添加一个ORS，使每行最后以CRLF结束。

####在Windows下，将Unix格式的换行换成Windows/dos格式的换行符

	awk 1

这条语句不是在所有情况下都可以用，要视使用的awk版本是不是能识别Unix格式的换行而定。如果能，那么它会读出每个句子，然后输出并用CRLF结束。1其实就是{ print }的简写形式。

####删除行首的空格和制表符

	awk '{ sub(/^[ \t]+/,""); print }'

和前面的例子相似，sub函数将[ \t]+用空字符串替换，达到删除行首空格的目的。

####删除行首和行末的空格

	awk '{ gsub(/^[ \t]+|[ \t]+$/,""); print }'

这条语句使用了一个新函数gsub，它和sub的区别在于它会替换句子里面的所有匹配。如果仅仅是要删除字段间的空格，你可以这样：

	awk '{ $1=$1; print }'

这是条很取巧的语句，看起来是什么也没作。awk会在你给字段重新赋值的时候对$0重新进行架构，用OFS也就是单个空格分隔所有字段，这样以来所有的多余的空格就消失了。

####在每行首加5个空格

	awk '{ sub(/^/,"     "); print }'

同上，sub将行首符替换为5个空格，达到了在行首添加空格的目的。

####让内容在79个字符宽的页面上右对齐

	awk '{ printf "%79s\n", $0 }'

同上一篇，又使用了printf函数。

####让内容在79个字符宽的页面上居中对齐

	awk '{ l=length(); s=int((79-l)/2); printf "%"(s+l)"s\n", $0 }'

第一句用length函数计算当前行内容的长度，第二句计算行首应该添加多少空格，第三句让内容在s+l宽度靠右对齐。

####把foo替换成bar

	awk '{ sub(/foo/,"bar"); print }'

同上，sub函数将每行中第一个foo换成了bar。但是，如果想要把每行中所有的foo都替换成bar，你需要

	awk '{ gsub(/foo/,"bar"); print }'

另外一种方法就是使用gensub函数

	awk '{ $0=gensub(/foo/,"bar",4); print }'

这条语句的不同在于它只是将每行第四次出现的foo替换成bar，它的原型是gensub(regex,s,h[,t])，它将字符串t中第h个regex替换成s，如果没有提供t参数，那么默认t就是$0。gensub不是一个标准函数，你只有在GNU Awk或者netBSD带的awk里面才能用到它。

####在含有baz的行里面，把foo替换成bar

	awk '/baz/ { sub(/foo/,"bar") }; {print}'


####在不含baz的行里，把foo替换成bar

	awk '!/baz/ { gsub(/foo/, "bar") }; { print }'

跟上一句的差别是用!让搜到baz的返回为假。

####把scarlet或者ruby或者puce替换成red

	awk '{ gsub(/scarlet|ruby|puce/,"red"); print }'


####让文本首位倒置，模仿tac

	awk '{ a[i++] = $0} END { for (j=i-1; j>=0;) print a[j--] }'

首先，把每一行的内容放到数组a里面。在最后，让变量j从a的最大编号变到0，从后望前逐行输出a里面的内容。

####把以\结束的行同下一行相接

	awk '/\\$/ { sub(/\\$/,""); getline t; print $0 t; next }; 1'

首先查找以\结束的行，并删除\。然后getline函数获取下一行的内容，输出当前行（去掉了\）和下一行的相接后的内容。并用next跳过后面的1避免重复输出。如果当前行行末没有\，会直接执行1输出。

####将所有用户名排序并输出

	awk -F ":" '{ print $1 | "sort" }' /etc/passwd

这里首先用-F指定了分隔符为冒号，然后用|指定输出的内容逐行pipe给外部程序sort。(这写法真是奇怪)。

####将前两个字段倒序输出

	awk '{ print $2, $1 }' file


####将每行里面的前两个字段交换位置

	awk '{ temp = $1; $1 = $2; $2 = temp; print }'

因为要输出整行，只好重新给$1和$2赋值，用个临时变量做中转。

####删除每行的第二个字段

	awk '{ $2 = ""; print }'

就是把第二个字段赋值为空字符串

####把每行的所有字段倒序输出

	awk '{ for (i=NF; i>0; i--) printf("%s ", $i); printf ("\n") }'


####删除连续的重复行

	awk 'a != $0; { a = $0 }'

前一句省略了action，选择输出整行内容与a不一样的；后一句省略了pattern，把当前行的内容赋值给a。a在这个例子中的左右是记录上一行的内容。

####删除非连续的重复行

	awk '!a[$0]++'

这一句真是很有ee的风范！把当前行的内容作为数组a的索引，如果a里面已经有了$0的记录，即遇到了重复，pattern的值为0，不输出。

####把每5行用逗号相连

	awk 'ORS=NR%5?",":"\n"'

这里在每行输出前，对ORS重新进行定义，如果行号能被5整除则为\n，否则为逗号。（也很天书的一句）