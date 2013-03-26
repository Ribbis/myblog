---
title: 「转」Guava 教程2-深入探索 Google Guava 库
date: '2013-02-19'
time: '22:16'
categories: ["Coding","Studying"]
tags:
- guava
- google
- google collections
---
>本文转自网络，如有侵权，请联系本人删除！
>[原文](http://codemunchies.com/2009/10/diving-into-the-google-guava-library-part-2/)
>[译文](http://www.oschina.net/translate/diving-into-the-google-guava-library-part-2)  

<p>
<img class="alignleft" src="{{urls.media}}/img/code-guava/title.jpg">
　　在这个系列的第一部分里，我简单的介绍了非常优秀的Google collections和Guava类库，并简要的解释了作为Java程序员，如果使用Guava库来减少项目中大量的样板代码。在这篇博文中我们将深入挖掘Guava提供的更高级的特性。  
　　我们将深入挖掘Guava库，并了解一下优雅的CharMatcher类、Joiner以及Splitter类，以及在处理Java基本类型时Guava给我们带来的别的工具类。  
</p>

###The Guava CharMatcher
　　CharMatcher 可以非常方便地添加到你的java工具箱中。有些人形容它：“像打了兴奋剂的StringUtils”:p
你可以使用预先设定好的常量，比如CharMatcher.WHITESPACE, CharMatcher.JAVA_DIGIT 或者CharMatcher.ASCII,此外你还有很多简便的工厂方法如CharMatcher.is(‘aaa’), CharMatcher.isNot(‘bbb’), CharMatcher.oneOf(‘abcd’).negate()，甚至更复杂一些比如：  

    CharMatcher.inRange('a', 'z').or(inRange('A', 'Z'));

　　当然你可以继承它然后实现方法 matches(char c)。你可以把 Google Collection中都创造实现一遍(当然下次我们会覆盖到)！  
如果你想从字符串中得到所有的数字，那么你可以这样：  

    String string = CharMatcher.DIGIT.retainFrom("some text 89983 and more");

如果你想把字符串中的数据都去掉，可以如下：

    String string = CharMatcher.DIGIT.removeFrom("some text 89983 and more");

还有好多匹配的方法： 

>matchesAllOf(CharSequence)  
>atchesAnyOf(CharSequence)  
>matchesNoneOf(CharSequence)  

除了indexIn, lastIndexIn and countIn这些方法，还有很多trimming, replacing and collapsing相关的方法。
更多信息查看[Java doc](http://guava-libraries.googlecode.com/svn/trunk/javadoc/com/google/common/base/CharMatcher.html).

###Joiner and Splitter
　　目前Joiner还是Collections 的一部分，Splitter 已经加入了Guava (不过一旦Collections 发布1.0版本，那么它们会一起加入到Guava)。  
可以这么使用Joiner：

    String[] subdirs = { "usr", "local", "lib" };
    String directory = Joiner.on("/").join(subdirs);

或者这样：

    int[] numbers = { 1, 2, 3, 4, 5 };
    String numbersAsString = Joiner.on(";").join(Ints.asList(numbers));

得益于Guava对基本型的支持，可以很方便这么处理：

    String numbersAsStringDirectly = Ints.join(";", numbers);

　　对于字符串，我们可以直接进行分割，但是这样做多少有些奇怪， Splitter 提供了更多的操作，而且更加健壮。字符创分割通常返回的是一个数组而 Splitter 返回的是一个迭代 Iterable。

    Iterable split = Splitter.on(",").split(numbsAsString);

你可以简单地分割字符串：

    String[] splitRegular = testString.split(",");

但是当需要处理下面这样的字符串时：

    String testString = "foo , what,,,more,";

输出结果是：

>‘foo ‘  
>‘ what’  
>”  
>”  
>‘more  

这样的结果也许还可以，但是Splitter允许我们对分割结果做更多的控制：

    Iterable<String> split = Splitter.on(",").omitEmptyStrings().trimResults().split(testString);

得到的结果是 foo’,'what’,'more’  

Joiner和Splitter都是可配置的，甚至你可以把Joiner使用在map中。

###Working with primitives cont’d
　　在博客的第一部分，我简单提到了基本型的用法。Guava已经提供了诸如Ints.compare(a, b)和Ints.toArray(list)。  
　　让我介绍Guava 关于基本型提供的更多的一些用法吧。  

假如我有一个整型数字数组，我们想知道数组中是否有特定的整型数字。传统的写法如下：

    int[] array = { 1, 2, 3, 4, 5 };
    int a = 4;
    boolean hasA = false;
    for (int i : array) {
        if (i == a) {
            hasA = true;
        }
    }

使用Guava，我们可以如下：

    boolean contains = Ints.contains(array, a);

同样，其他类型的基本型数组也可以这么来做。我们甚至可以直接对数组做如下的事： 

    int indexOf = Ints.indexOf(array, a);
    int max = Ints.max(array);
    int min = Ints.min(array);
    int[] concat = Ints.concat(array, array2);

　　在这个系列的下一章我们将关注下 Google Collections library包的更高级特性如：Functions, Filtering and Ordering!欢迎继续收看，请与我们分享你的看法。 