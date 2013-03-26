---
title: 「转」Guava 教程3-Java 的函数式编程，通过 Google Collections 过滤和调用
date: '2013-02-20'
time: '22:26'
categories: ["Coding","Studying"]
tags:
- guava
- google
- google collections
---
>本文转自网络，如有侵权，请联系本人删除！
>[原文](http://codemunchies.com/2009/11/functional-java-filtering-and-ordering-with-google-collections-part-3/)
>[译文](http://www.oschina.net/translate/functional-java-filtering-and-ordering-with-google-collections-part-3)  

　　在本系列博客的第一、二部分，我介绍了非常优秀的Google Collections和Guava包。本篇博客中我们来看看如何使用Google Collections来做到过滤和排序功能。此外，我会带你看看Google Collections是如何使Java有一点点“functional（方法化）”的进步了。  

###Functions, Functions, Functions!!

　　Google Collections给我们带来了一对非常优雅的东东，叫做:Functions and Predicates! 和你使用的scala一样有神奇的地方，现在你可以使用在no-functional 的java身上了。你可以在com.google.common.base包里找到这些（更多）。  

　　我们将在下一部分过滤集合的时候谈到Predicates类，首先我们先看一下Function的用法！  
　　Google collections提供了Function<F,T>接口，实际上，一个function就是从一个对象到另外一个对象的转换变形。  

像Lists和Maps这类的Collection工具类给我们提供了转换的方法：

    topMap = Maps.transformValues(fromMap, function);
    toList = Lists.transform(fromList, function);

举个例子来说，假设你有一个Map，key是物品，value是对应的价格，单位是欧元。那么，你有个需求是将里面的价格都转换为美元，传统的做法是遍历整个Map，然后更新每个value值，将价格转换为美元价格，好麻烦...  
有了Functions，世界一下子变清净了...  

    Map usdPriceMap = Maps.transformValues(eurPriceMap, new Function() {
        double eurToUsd = 1.4888;
        public Double apply(final Double from) {
            return from * eurToUsd;
        }
    });

好吧，你可能说匿名内部类搞的有点糟，因为 你可能想重用这个function---这里只是演示函数式的一些特点而已。  
和这个类似的，我们也可以使用Functions来把一个对象转换成一个完全不同的对象，比如将一个整形转换为字符串。  
我们稍后再深入Functions类，首先我们浏览一下Multimap集合以及我们如果使用一点function来转换一个集合。  

###使用条件过滤集合

我在Integrasco做数据工作时遇到的最常见的任务是过滤数据和对大集合进行排序。 简单起见，我们假设你有一个姓名列表想要过滤（看起来有点幼稚）：　　

    List<String> names = listOf("Aleksander", "Jaran", "Integrasco", "Guava", "Java");

我们可以使用com.google.common.collect.Iterables和com.google.common.base.Predicates类来过滤例子中的列表，使过滤后的列表中只包含Aleksander或者Jaran：  

现在我知道这听起来有点傻帽，但是你仍然可以实现自己的Predicates条件类，比如返回名字长度小于5的列表（我从codemonkeyism.com偷到了下面这个例子）：  

    Iterable<String> filtered = filter(names, or(or(equalTo("Aleksander"),equalTo("Jaran")), lengthLessThan(5)));

　　这个例子返回的是Aleksander，Jaran以及Java（因为Java的长度小于5）。or条件的部分读起来有点绕，但我还可以忍受。equalTo以及or条件都是Predicates自带的方法，用起来很方便。  

现在我们来实现一个lengthLessThan的条件，我们只需要这么做：

    private static class LengthLessThanPredicate implements Predicate<String> {
        private final int length;
        private LengthLessThanPredicate(final int length) {
            this.length = length;
        }
        public boolean apply(final String s) {
            return s.length() < length;
        }
    }

把这个实现在你的工具类里包装一下就像这样：

    public static Predicate<String> lengthLessThan(final int length) {
        return new LengthLessThanPredicate(length);
    }

关注一下[Stephan](http://codemonkeyism.com/)的博文[fluent interfaces for Google Collections](http://codemonkeyism.com/creating-a-fluent-interface-for-google-collections/) --写的相当优雅~！

###对集合排序

多亏有了java Collections类，我们可以这么排序：

    Collections.sort(List<T>, Comparator<? super T>)

　　但有时候我们想做更复杂一些的事情，比如合并多个Comparator或者我们可能只是想要排序过的集合的一个视图，而不改变原来集合的顺序。  
　　Google Collections给我们提供了Ordering，让我们更好地掌控排序。假如我们有两个对Person类排序的comparator，一个是根据lastName排序，一个是根据firstName排序： 

    Comparator<Person> byLastName = new Comparator<Person>() {
        public int compare(final Person p1, final Person p2) {
            return p1.getLastName().compareTo(p2.getLastName());
        }
    }


    Comparator<Person> byFirstName = new Comparator<Person>() {
        public int compare(final Person p1, final Person p2) {
            return p1.getFirstName().compareTo(p2.getFirstName());
        }
    }; 

那么，假如我们现在想现根据last name排序，再根据first name排序，然后对排序结果反序，那我们我们需要做的是：

    List<Person> sortedCopy = Ordering.from(byLastName).compound(byFirstName).reverse().sortedCopy(persons);

而且，你甚至无需创建Comparator比较器，你可以直接扩展Ordering类！

    List<Person> sortedCopy = orderByLastName.compound(orderByFirstName).reverse().sortedCopy(persons);

###继续过滤和排序

在这个系列的第一部分，Steve提到了在Scala中，你可以这么做：

    people.filter(_.firstName == "Steve").sort(_.lastName < _.lastName) 

　　功能是说从people这个集合中筛选出firstName为“Steve”的，并且按他们的lastName属性排序。  

　　从语法上来看，这行代码非常优雅！那么我们也来看一下使用Google Collections时应该怎么做。Google Collections给我们提供了前面提到的Iterables类，我们可以使用Iterables类来实现过滤和转换（你可以使用Google Collections里的Collections2来实现同样的功能）。  

　　那现在我们就来看一下如何实现和Steve的那行Scala代码一样的功能，虽然看起来没有Scala实现的那么优雅，但却是使用Predicates和Ordering类来实现上面功能的一种方式。  

    Ordering.from(byLastName).sortedCopy(filter(persons, withFirstName("Steve")));

　　虽然跟Scala提供的语法糖有点差距（很明显我们还是需要我们的“withFirstName”条件谓词以及“byLastName”比较器），但至少这比我们不使用Google Collections接近多了！（如果采用Stephen的流式接口的话，代码会更易读）。

　　Kevin Bourrillion在另一篇关于使用[Google Collections编写函数式的Java](http://blogs.warwick.ac.uk/chrismay/entry/writing_functional_java/)的文章中提到：

>语法很烂。而且同时这在语言本身改变之前只是权宜之计，到那时我们才真正的选择最佳的语法并开始真正的函数式编程。所以我还没决定我会投入多大的努力到Function/Predicate中去（这段真的很难翻译..我去..）

　　在下篇也是最后一篇关于Google Collections和Guava的博文中，我们将看到如果使用Google Collections操作Set和Map，以及使用Preconditiones来做验证，而且我们带你体验一下奇妙的Multimap集合类以及如何进行切分！拭目以待吧！
