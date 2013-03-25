---
title: 「转」Guava 教程4-条件，多重映射和分片
date: '2013-02-20'
time: '22:36'
categories: ["Coding","Studying"]
tags:
- guava
- google
- google collections
---
>本文转自网络，如有侵权，请联系本人删除！
>[原文](http://codemunchies.com/2009/11/preconditions-multimaps-and-partitioning-with-google-collections-part-4/)
>[译文](http://www.oschina.net/translate/preconditions-multimaps-and-partitioning-with-google-collections-part-4)  

　　在本系列博客的前三章，我们大概介绍了Google的Guava类库和Collections类库，作为一名Java开发人员，相信你会从使用这些类库，进而来减少在你项目中使用样板文件的数量而获益。在本系列博客的最后一篇中，我将带大家来了解一个会让你完全爱上并沉浸于其中的的集合工具类-Multimap。我们将带大家了解下如何使用Google Collections的Preconditions来做校验，但是在此之前，先让我们来了解下如何对Set和Map进行交集、并集和差集的运算。  

####Set的交集，并集和map的相关操作

　　有时，当我们需要去对两个Set的取交集、并集和差集的时候，那是一件相关麻烦的事情，而且代码看起来很凌乱。经常情况，你会以一遍又一遍的循环来结束这种做法。但是如果我们使用Google Collections提供的Sets类就可以轻而易举的完成这些操作，并且是完全免费的！  

    HashSet setA = newHashSet(1, 2, 3, 4, 5);
    HashSet setB = newHashSet(4, 5, 6, 7, 8);

    SetView union = Sets.union(setA, setB);
    System.out.println("union:");
    for (Integer integer : union)
        System.out.println(integer);        

    SetView difference = Sets.difference(setA, setB);
    System.out.println("difference:");
    for (Integer integer : difference)
        System.out.println(integer);       

    SetView intersection = Sets.intersection(setA, setB);
    System.out.println("intersection:");
    for (Integer integer : intersection)
        System.out.println(integer);

From the [Public Object blog](http://publicobject.com/2008/08/coding-in-small-with-google-collections.html):

>“不同于惯例，这些方法没有做任何的拷贝。相反，他们返回了代表了这两个集合的视图。 但是在有些情况下，这些拷贝又很有用，我们可以用immutableCopy类中提供的一个便利方法来实现拷贝”

同样地，对于Map而言，我们可以像下面这样处理:

    MapDifference differenceMap = Maps.difference(mapA, mapB);

如果用MapDifference类，我们还可以这样:

    differenceMap.areEqual();
    Map entriesDiffering = differenceMap.entriesDiffering();
    Map entriesOnlyOnLeft = differenceMap.entriesOnlyOnLeft();
    Map entriesOnlyOnRight = differenceMap.entriesOnlyOnRight();
    Map entriesInCommon = differenceMap.entriesInCommon();

Thank you, Google Collections！

####用Preconditions进行校验

　　早在初夏的时候，一个叫刚刚加入我们的同事Bent André向我介绍了用Preconditions进行校验的想法，但是,直到最近我才发现Google Collections实际上已经包含了相应的实现（我们自己也已经有了相似的实现）。  

　　那么这个实现具体是什么样子的呢？校验就是要求我们准确无误的做一些事情，通常情况下，它看起来就是类似下面这样的代码：  

if (count <= 0) {
    throw new IllegalArgumentException("must be positive: " + count);
}

　　我们想校验调用我们的方法的方法传参是否正确，如果错了，应该发出一个“他出错了”的警告信息。
JavaDoc中是这样解释的：

>“Precondition异常通常表示被调用方法发生了一个错误。它告诉调用者不能用这种方式、这种参数或者其它来调用这个方法。Postcondition或其它运行失败是不会抛出这种类型的异常的。”

因此用Preconditions类或者静态导入，我们就可以用下面这行简单的代码来替代上面那些的冗长的代码了：

    checkArgument(count > 0, "must be positive: %s", count);

同样，该类里还有其它类似的方法来检验状态和空值。

    checkNotNull(entry);

相当简洁，不是么？

>“请注意这里是相反的表达（译者注：应该指的是checkNotNull中有not的意思，所以是相反的）; 你用Preconditions声明什么是你期望返回true的，就好像你在Java中运用断言，或者在JUnit中调用assertTrue方法一样。”

From the excellent [blog series on Google Collections](http://publicobject.com/2007/09/coding-in-small-with-google-collections_08.html) over at [Public Object](http://publicobject.com/):

>“Preconditions提供对方法状态的校验。它能使你输入的参数如你所期望的的那样足够简洁，与Java内建的断言不同的是Preconditions是一直开启的。”

下面是我在[Integrasco](http://www.integrasco.com/)上翻遍我所有的代码中，找到的一个比较好的例子：

    public PostExample(final String title, final Date date, final String author) {
       //some code to validate that title is not null
       //some code to validate that date is not null
       //some code to validate that author is not null

        this.title = title;
        this.date = date;
        this.author = author;
    }

用了Preconditions之后我们再来看看代码变得有多工整：

    public PostExample(final String title, final Date date, final String author) {
        this.title = checkNotNull(title);
        this.date = checkNotNull(date);
        this.author = checkNotNull(author);
    }

很简洁，不是么?  
稍后我们会发表一篇关于异常和校验的更详细的文章，敬请关注!  

####一个集合统治一切 – Multimap

　　我已经数不清我有多少次需要在一个Map中实现一个key对应多个value的需求，最终不得不以`Map<K, List<V>>`这种结构来实现的经历了。
并且用这种方式实现一键多值的需求还存在很大的争议，如下所示:

    Map<Person, List<BlogPost>> map = new HashMap<Person, List<BlogPost>>();

    public void addBlogPost(final Person author, final BlogPost blogPost) {
        List<BlogPost> blogPosts = map.get(author);
        if (blogPosts == null) {
            blogPosts = new ArrayList<BlogPost>();
            map.put(author, blogPosts);
        }
        blogPosts.add(blogPost);
    }

别告诉你你从来没这样做过？利用Google Collections中的Multimap类我们可以轻松实现上述需求，而且感觉很时髦（我很开心我可以这样表达）：

    Multimap<Person, BlogPost> multimap = ArrayListMultimap.create();

    public void addBlogPost(final Person author, final BlogPost blogPost) {
        multimap.put(author, blogPost)
    }

Whoop, whoop!  

　　Google Collections提供了多种Multimaps的实现，如果你想防止出现键值对，可以用HashMultimap；如果你需要键值对按照自然顺序排列，你可以使用TreeMultimap；甚至你想按插入顺序来遍历集合，LinkedHashMultimap可以满足你的需求。  

　　Multimaps同样提供了很多有用的方法，详细内容可以参考Multimap 和 Multimaps的API文档！很激动是么？那就继续往下看吧...

####分片集合

　　我管这节叫分片，相信很多人会觉得叫我们在之前文章叫提到的“过滤集合”更准确。但是当我们把把Multimap的概念和功能相结合的时候，你就会意识到他到底有多强大了，而不仅仅是过滤那么简单！  

我们假设我们已经拥有了包含了一组map的list。list里的每一个Map代表拥有指定属性的一个文档。这个Map看起来可能会是下面这个样子：

    mapOf("type", "blog", "id", "292", "author", "john");

即每个Map中我们拥有3个属性，他们分别是“type”、 “id”和“author”。  
如上所示，所有我们的List看起来应该是下面这个样子：

    List<Map<String, String>> listOfMaps

　　现在，我们想把这个list根据所装载对象的类型不同分成多个list，比如一个叫“blog”，一个叫“news”等等...  

　　如果没有Google Collections这将是一场恶梦！我们必须得先循环这个list，然后再分别检查每一个map中的key，然后再把根据类型的不同放入不同的list中。但如果我们不知道map里都有哪些类型，这个过程会更痛苦！  

想不想和我一起来看看有没有轻松的办法解决？

用一点点Function的魔法加上Multimaps，我样可以以一种上相当优雅的方式来解决这个问题：

    Multimap<String, Map<String, String>> partitionedMap = Multimaps.index(listOfMaps, new Function<Map<String, String>, String>() {
        public String apply(final Map<String, String> from) {
            return from.get("type");
        }
    });

　　现在我们拥有了每一个key代表不同类型的Multimaps了！  
　　如果现在我们想要指定类型的所有map，唯一需要做的就是找Multimaps要！

　　好，就到这里为止了！希望你喜欢这段旅程，同时也希望你能从Google这些真正伟大的项目中受到启发！  
　　欢迎反馈！  