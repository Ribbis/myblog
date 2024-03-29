---
title: awk-oneliner-1
subject: "详解著名的awk Oneliner，第一部分：空行、行号和计算"
date: '2012-04-05'
time: '00:36'
categories: ["Coding","Studying"]
tags:
- shell
- awk
---
<img src="{{urls.media}}/img/awk-oneliner-study/title.jpg"/>
>本文转自网络，如有侵权，请联系本人删除！
>[原文](http://www.catonmat.net/blog/awk-one-liners-explained-part-one/)
>[引自](http://roylez.herokuapp.com/2010/04/11/awk-oneliner-translation-1.html)  

##第一部分：空行、行号和计算
####将每行后面都添加一个空行  

	awk '1; { print "" }'
  
这是怎么意思呢？一个单行awk命令，其实也是一个用awk语言写的程序，每个awk程序，都是由一系列的“匹配模式 { 执行动作 }”语句所组成的。在这个例子里面，有两个语句，“1”和“{print “”}”。在每个“匹配模式——执行动作”语句中，模式和动作都是可以被省略的。如果匹配模式被省略，那么预定的动作将会对输入文件的每一行执行。如果动作被省略，那么就默认会执行{print }。所以，这个单行awk语句等同于下面的语句：  

	awk '1 {print } {print ""}'
  
动作只有在匹配模式的值为真的时候才会执行。因为“1”永远为真，所以，这个例子也可以写成下面的形式：  

	awk '{print } {print ""}'
  
awk中每条print语句后都默认会输出一个ORS变量（Output Record Separator，即输出行分隔符，默认为换行符）。第一个不带参数的print语句，等同于print $0，其中$0是代表整行内容的变量。第二个print语句什么也不输出，但是鉴于print语句后都会被自动加上ORS变量，这句的作用就是输出一个新行。于是每行后面加空行的目的就达到了。  

添加空行的另一种方法：  

	awk 'BEGIN { ORS="\n\n" }; 1'
  
BEGIN是一个特殊的模式，后面所接的内容，会在文件被读入前执行。这里，对ORS变量进行了重新定义，将一个换行符改成了两个。后面的“1”，同样等价于{print }，这样就达到了在每行后用新的ORS添加空行的目的。

####在每个非空的行后面添加空行

	awk 'NF {print $0 "\n"}'
  
这个语句里面用到了一个新的变量，NF（number of fields），即本行被分割成的字段的数目。例如，“this is a test”，会被awk分割成4个词语，NF的值就为4。当遇到空行，分割后的字段数为0，NF为0，后面的匹配动作就不会被执行。这条语句，可以理解成“如果这一行可以分割成任意大于0的部分，那么输出当前行以及一个换行符”。

####在每行后添加两个空行

	awk '1; {print "\n"}'
  
这一语句与前面的很相似。“1”可以理解为{print }，所以整个句子可以改写为：  

	awk '{print ; print "\n"}'
  
它首先输出当前行，然后再输出一个换行符以及一个结束print语句的ORS，也就是另外一个换行符。

####为每个文件的内容添加行号

	awk '{ print FNR "\t" $0 }'
  
这个awk程序在每行的内容前添加了一个变量FNR的输出，并用一个制表符进行分隔。FNR（File Number of Row）这个变量记录了当前行在当前文件中的行数。在处理下一个文件时，这个变量会被重置为0。

####为所有文件的所有行统一添加行号

	awk '{print NR "\t" $0}'
  
这一句与上一例基本一样，除了使用的行号变量是NR（Number of Row），这个变量不会在处理新文件的时候被重置。所以说，如果你有2个文件，一个10行一个12行，那这个变量会从1一直变到22。

####用更漂亮的样式添加行号

	awk '{printf("%5d : %s\n", FNR, $0)}'
  
这个例子用了printf函数来自定义输出样式，它所接受的参数与标准C语言的printf函数基本一致。需要注意的是，printf后不会被自动添加ORS，所以你需要自己指定换行。这个语句指定了行号会右对齐，然后是一个空格和冒号，接着是当前行的内容。

####为文件中的非空行添加行号

	awk 'NF { $0=++a " :" $0}; {print }'
  
Awk的变量都是自动定义的：你第一次用到某个变量的时候它就自动被定义了。这个语句在每次遇到一个非空行的时候先把一个变量a加1，然后把a的数值添加到行首，然后输出当前行的内容。

####计算文件行数（模拟 wc -l）

	awk 'END {print NR}'
  
END是另外一个不会被检验是否为真的模式，后面的动作会在整个文件被读完后进行。这里是输出最终的行号，即文件的总行数。

####对每行求和

	awk '{s=0;for (i=0;i<NF;i++) s=s+$i; print s}'
  
Awk有些类似C语言的语法，比如这里的for (;;;){ ... }循环。这句命令会让程序遍历所有NF个字段，并把字段的总和存在变量s中，最后输出s的数值并处理下一行。

####对所有行所有字段求和

	awk '{for (i=0;i<NF;i++) s=s+$i; END {print s+0}'
  
这个例子与上一个基本一致，除了输出的是所有行所有字段的和。由于变量会被自动定义，s只需要定义一次，故而不需要把s定义成0。另外需要注意的是，它输出{print s+0}而非{print s}，这是因为如果文件为空，s不会被定义就不会有任何输出了，输出s+0可以保证在这种情况下也会输出更有意义的0。

####将所有字段替换为其绝对值

	awk '{ for (i = 1; i <= NF; i++) if ($i < 0) $i = -$i; print }'
  
这条语句用了C语言的另外两个特性，一个是if (...) {...}结构，另外就是省略了大括号。它检查对每一行，检查每个字段的值是否小于0，如果值小于0，则将其改为正数。字段名可以间接地用变量的形式引用，如i=5;$i='hello'会将第5个字段的内容置为hello。  
下面的是将这条语句完整的写出来的形式。print语句会在行中所有字段被改为正数后执行。

	awk '{
  for (i = 1; i <= NF; i++) {
    if ($i < 0) {
      $i = -$i;
    }
  }
  print
}'


####计算文件中的总字段（单词）数

	awk '{total=total+NF};END {print total+0}'
  
这个命令匹配所有的行，并不断的把行中的字段数累加到变量total。执行完成上述动作后，输出total的数值。

####输出含有单词Beth的行的数目

	awk '/Beth/ {n++}; END {print n+0}'
  
这个例子含有两个语句。第一句找出匹配/Beth/的行，并对变量n进行累加。在/…/之间的内容为正则表达式，/Beth/匹配所有含有“Beth”的单词（它不仅匹配Beth，同样也匹配Bethe）。第二句在文件处理完成后输出n的数值。这里用n+0是为了让n为0 的情况下输出0而不是一个空行。

####寻找第一个字段为数字且最大的行

	awk '$1 > max { max=$1; maxline=$0 }; END { print max, maxline }'
  
这个例子用变量max记录第一个字段的最大值，并把第一个字段最大的行的内容存在变量maxline中。在循环终止后，输出max和maxline的内容。注意：如果在数字都为负数的情况下，这个例子就不能用了，下面的是修改过的版本：

	awk 'NR == 1 { max = $1; maxline = $0; next; } $1 > max { max=$1; maxline=$0 };
     END { print max, maxline }'
  

###在每一行前添加输出该行的字段数

	awk '{print NF ":" $0}'
  
这个例子仅仅是在逐行输出字段数NF，一个冒号，以及该行的内容。

####输出每行的最后一个字段

	awk '{print $NF}'
  
awk里面的字段可以用变量的形式引用。这一句输出第NF个字段的内容，而NF就是该行的字段数。

####打印最后一行的最后一个字段

	awk '{ field = $NF };END {print field}'
  
这个例子用field记录最后一个字段的内容，并在循环后输出field的内容。这里是一个更好的版本。它更常用、更简洁也更高效：

	awk 'END {print $NF}'
  

####输出所有字段数大于4的行

	awk 'NF > 4'
  
这个例子省略了要执行的动作。如前所述，省略动作等价于{print}。

####输出所有最后一个字段大于4的行

	awk '$NF > 4'
  
这个例子用$NF引用最后一个字段，如果它的数值大于4，那么就输出。