---
title: guava-1
subject: Guava 教程1-使用 Google Collections,Guava,static imports 编写漂亮代码
date: '2013-02-18'
time: '22:06'
categories: ["Coding","Studying"]
tags:
- guava
- google
- google collections
---

>**写在前面：**  
>以前在一个项目中用到过guava，当时匆匆用，也没细研究，今天偶然在occhina看到这个系列教程的翻译，感觉不错，介绍得还比较全面，就一口气全看完了，但看到第四节，发现还没翻译，于是自己就硬着头皮看了英文，发现也能看懂大概意思，就顺手翻译了一下，也算是为开源事业做点儿贡献吧。把文章转到自己博客记录一下。  
>附：  
>[Guava API](https://code.google.com/p/guava-libraries/)  
>[Guava 用法整理](http://macrochen.iteye.com/blog/737058)
  
>本文转自网络，如有侵权，请联系本人删除！
>[原文](http://codemunchies.com/2009/10/beautiful-code-with-google-collections-guava-and-static-imports-part-1/)
>[译文](http://www.oschina.net/translate/beautiful-code-with-google-collections-guava-and-static-imports-part-1)  

　　这个夏天的早些时候，我已经极力向我的所有同事推荐了 Google Collections 。 Kevin Bourrillion说他的一个同事告诉他“没有使用Google Collections前编程就像把一只手绑在背后”。  
　　我灰常同意Kevin的这个同事！  
　　可能文章的标题有点奇怪。我指的是“编写漂亮代码”。我猜我应该说“简洁的”Java代码，但是，它们意思可不一样(译者注：漂亮的代码看着很爽，简洁的不一定爽)。  

　　在我准备开始卖力的吆喝这个我最最喜欢的Java类库前，我有几个额问题要问问你：  
多少次你写了像下面一样的代码：

    Map<String, Map<Long, List<String>>> map = new HashMap<String, Map<Long,List<String>>>();

或者像这样的不堪入目的代码:

    int a = 5;
    int b = 10;
    int compareTo = Integer.valueOf(a).compareTo(Integer.valueOf(b));

或者有很多的if和else :-(  
又有多少次你写了像下面这样的代码，只为了从一个文件中读一点点东西？：

    File file = new File(getClass().getResource("/test.txt").getFile());
    BufferedReader reader;
    String text = "";
    try {
        reader = new BufferedReader(new FileReader(file));
        String line = null;
        while (true) {
            line = reader.readLine();
            if (line == null) {
                break;
            }
            text += line.trim() + "\n";
        }
        reader.close();
        reader = null;
    } catch (FileNotFoundException e1) {
        e1.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }

好吧，我想说… 这是什么TM玩意？我们已经有Apache Commons Collections很多年了。那为什么我们还需要另外一个collections库呢？我看过很多像这样的评论：  

>“任何有一段时间开发经验的Java程序员都会积累这些类型的实用的工具类”

好吧，是的，这对于大多数开发者来说可能是(应该是)对的。但是，有太多理由来摆脱垃圾代码和重用漂亮的工具类！在这个博客里，我将要告诉你一些的确引起我求知欲-让我沉溺于其中的事情，那就是Google Collections。  

正如Jared Levy 曾说过的:

>这个库简化了你的代码，使它易写、易读、易于维护。它能提高你的工作效率，让你从大量重复的底层代码中脱身。

　　此外，我会给你们展示一下Guava里面包含的很多非常酷的功能，让你们看看如何用它来写出更漂亮的代码，一旦看到这些，你们就会和以前那种僵化的令人讨厌的写代码方式说拜拜了。  

　　Google Guava 是 Google 为 Java 1.6 编写的核心库。它仍然不是一个很成熟的库，在未来几个月还将不断的变化。Google Collections 将在 1.0 版本发布时将成为 Guava 的一部分。Guava (和 Google Collections) 已经率先被很多 Google 开发者使用。支持该项目的开发者有 Kevin Bourrillion, Jared Levy, Crazy Bob Lee, Josh Bloch(!) (Google 的 Java 首席架构师) 和 limpbizkit (我们找不到这家伙的真实姓名). Google Collections 在 2007 年就已经有了，但 Guava 是在 2009年9月推出的。  
　　作为这个系列的博客，我将向你介绍 Google Collections 并告诉你使用 Guava 和 Google Collections 能为你带来什么好处。包括代码量的减少以及新的更快的数据结构。在第二部分我们将深入探讨 Guava 和 Collections 的一些高级特性。  

###Google Collections一览

　　显然一篇博文不能深入地覆盖Google Collections的方方面面，所以我决定把时间放在我日常编码中使用到的基础且不失强大的特性上，首先，不要这么做：

    Map<String, Map<Long, List<String>>> map = new HashMap<String, Map<Long,List<String>>>();

要这么做：

    Map<String, Map<Long, List<String>>> map = Maps.newHashMap();

或者更甚者直接使用静态导入：

    Map<String, Map<Long, List<String>>>map = newHashMap();

　　很棒，不是吗？多亏有泛型和写Collections的哥们提供给我们的这些方便工厂方法，我们不再需要写一些Java本身应该自带的东西。好吧，我知道这些会是JDK 7里的一部分，那当然很好，不过Google Collections现在就有这些功能。  
　　类似于com.google.common.collect.Maps提供的这些静态工具方法，Lists和Sets也有：

    Lists.newArrayList();
    Sets.newHashSet();

还有更多！ 自己去看看吧！[http://code.google.com/p/google-collections/]

###操作lists和maps

当你在写单元测试时，经常会构造一些测试数据，可能是list、map、set等，对于一些像我一样草率的人来说，测试代码中会经常看到类似下面的语句：

    List<String> list = new ArrayList<String>();
    list.add("a");
    list.add("b");
    list.add("c");
    list.add("d");

　　其实我也知道，这几行代码看起来很烂，我只是想用一些测试数据构造一个不可变的list而已，我希望能像下面这样写一行代码搞定这些。。如何办到？好吧，这很简单！  

    ImmutableList<String> of = ImmutableList.of("a", "b", "c", "d");

Map也一样

    ImmutableMap<String,String> map = ImmutableMap.of("key1", "value1", "key2", "value2");

　　我现在慢慢的越来越喜欢这种简单而又有效的写代码的方式，我还想缩短一下上面的代码，但是由于ImmutableList和ImmutableMap都有of方法，不能使用静态导入。不过有一个变通的方法就是说在我们自己的集合工具中包装这些创建工厂方法，那么对于不可变的list和map我只需要简单的这么写就好：

    ImmutableMap<String,String> map2 = mapOf("key1", "value1", "key2", "value2")

或者

    ImmutableList<String> list2 = listOf("a", "b", "c", "d");

而且如果我想构造填充一个ArrayList（或者一个HashMap），我可以这样：

    ArrayList<String> list3 = arrayListOf("a", "b", "c", "d");

　　两种方式都可以，选择权在你手上，很明显，这种较之前面的方式更灵活优雅一些，你说呢？
除去可以使用方便干净的方式来创建并填充集合类，我们也提供了很多额外的工具方法，比如过滤，对set取交集和并集，排序等等一些更优雅的方法，我将会在第二部分中讲解它们。

###静态导入和Eclipse模板

　　在这之前，我想先告诉你我在写代码时，是如果借用Eclipse的Code模板功能更高效的使用集合类的。（我假设你了解在IDEA或者其他IDE中也存在类似的功能，你可以根据这部分叙述做出相应的扩展或变通）    

　　作为一个Eclipse的用户，我非常喜欢快捷键（参照这篇介绍Eclipse快捷键的博文：MouseFeed and how you can easily learn Eclipse shortcuts）  

　　OK，Ctrl+space是你们的好朋友！他也是代码自动补全的快捷键。（译者注：当然。在中国，由于这个快捷键和切换输入法冲突，一般都设置为了“Alt+/”作为代码补全的快捷键）  

　　在Eclipse下你可以创建一个模板来绑定到一个自动补全的快捷关键字上，这也是魔力所在！  

　　相对于键入Maps.newHashMap()来创建一个HashMap，或者干脆使用静态导入，就可以简单的键入newHashMap()来创建一个HashMap，我只是简单的敲入newH，按下ctrl+space，见证奇迹的时刻到了！  

　　在Eclipse菜单栏选择Window -> Preferences，进入Java -> Editor -> Templates，点击“New”。Name处就是你想敲入的快捷关键字，我通常命名为我的方法名，比如在这里，就是“newHashMap”，加上你喜欢的描述，比如”Import static Maps.newHashMap“，并增加下面的内容：

    ${:importStatic(com.google.common.collect.Maps.newHashMap)}newHashMap();${cursor}

以上就是创建快捷补全的全部步骤了，现在去为你常用到的所有方法添加模板吧！

###Guava走马观花

　　最后，但并非不重要，我将向你展示一下如果使用Guava来处理本文开头留下来的两个问题：

1.从文件中按行读取内容：

    File file = new File(getClass().getResource("/test.txt").getFile());
    List<String> lines = null;
    try {
      lines = Files.readLines(file, Charsets.UTF_8);
    } catch (IOException e) {
      e.printStackTrace();
    }


2.比较两个基本类型：

    int compare = Ints.compare(a, b);

3.把一个List<Integer>转换为int数组：

    List<Integer> list = listOf(1, 2, 3, 4);
    int[] array2 = Ints.toArray(list);

　　Guava为我们提供了对Core Java类库全面的扩展，我们可以使用com.google.common.primitices包下的Ints，Doubles，Floats，Shorts，Bytes以及Bools等工具类操作基本类型的数据；com.google.common.io包提供了操作streams，buffers以及files等等，而且并发包中提供了一些像Futures，Callables以及Executors等方便的工具类来减轻我们写并发代码的痛苦。除此之外，Guava提供了对Collections的增强，以及非常优雅的CharMatcher、Joiner以及Splitter类，这些类我将在下篇博文中提到。  
可以从这里获得源码:

    svn checkout http://guava-libraries.googlecode.com/svn/trunk/guava-libraries-read-only

　　下次我们会深入Guava 的高级功能，探索一下集合的用法，看看怎样通过Multimap使java的功能更加强大，如何用mapping功能来转换集合。请拭目以待。如果你们也用过Guava或者Google Collections请分享一下你们的心得。


