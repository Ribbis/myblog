---
title: "Log4j vs Logback 性能测试及原理分析"
date: '2013-01-16'
time: '16:27'
description:
categories: ["Coding", "Working"]
tags: 
- log4j
- logback
- performance
- java
---

<img src="{{urls.media}}/img/work-logsystem-perf/title.jpg"/>
###测试环境：
- CPU：Intel(R) Xeon(R) CPU E5520 @ 2.27GHz 5核  
- Memory：8G  
- OS：Red Hat Enterprise Linux Server release 5.7 (Tikanga)  
- JDK：1.6.0_32  

###软件版本：
- SLF4J： 1.7.2
- LOGBACK：1.0.9
- LOG4J：1.2.17

###测试方法：
1. 单线程执行100万次的debug写操作，取耗时平均值算一次，单位是纳秒；  
2. 多线程开启20的线程池，分别测试10、20、50、100、500、1000线程的debug写操作，每线程循环写5000次，取平均值。  
3. 每个脚本执行一次，休息30秒，再执行，执行3次取平均值。  
	**注**：详情见代码

###测试场景及数据：
1. 关闭immediateFlush：  

- 开启AsyncAppender：  
![image]({{urls.media}}/img/work-logsystem-perf/img-1.jpg)

- 关闭AsyncAppender：  
![image]({{urls.media}}/img/work-logsystem-perf/img-2.jpg)

2. immediateFlush对性能的影响  

- 开启AsyncAppender：  
![image]({{urls.media}}/img/work-logsystem-perf/img-3.jpg)

- 关闭AsyncAppender：  
![image]({{urls.media}}/img/work-logsystem-perf/img-4.jpg)
 
###结果分析：
**从测试结果可见：**

- 如果不开启AsyncAppender，Log4j和Logback的性能不相上下；如查开启了AsyncAppender，Logback的性能将有非常大的提升。
- 关闭immediateFlush，在开启AsyncAppender的情况下，对Logback的影响很小，但对Log4J的影响却很大；但在不开启的AsyncAppender的情况下，对二都影响都很大。  

　　原因是Logback对AsyncAppender做了很多优化，主要对并发处理方式的不同。二者都采用了生产者、消费者模型。

**Log4j的实现原理如下：**

1. Logging Event进入AsyncAppender，AsyncAppender会调用append方法，在append方法中会去把logging Event填入Buffer中，当消费能力不如生产能力时，AsyncAppender会把超出Buffer容量的Logging Event放到DiscardSummary中，作为消费速度一旦跟不上生成速度，中转buffer的溢出处理的一种方案。

2. AsyncAppender有个线程类Dispatcher，它是一个简单的线程类，实现了Runnable接口。它是AsyncAppender的后台线程。  
Dispatcher所要做的工作是：  

- (1)锁定Buffer，让其他要对Buffer进行操作的线程阻塞。
- (2)看Buffer的容量是否满了，如果满了就将Buffer中的Logging Event全部取出，并清空Buffer和DiscardSummary；如果没满则等待Buffer填满Logging Event，然后notify Disaptcher线程。
- (3)将取出的所有Logging Event交给对应appender进行后面的日志信息推送。  

　　于是Log4J用ArrayList实现了一个buffer队列（@see org.apache.log4j.AsyncAppender#append）来用户缓冲，并用一堆的synchronized来保证线程安全，对于AppenderAttachable则采用Vector来保证线程安全。  

　　Logback的整体原理与Log4J基本相似，但直接使用了并发包的ArrayBlockingQueue来实现Buffer缓冲，对于AppenderAttachable并没采用加锁的机制来保证线程安全，而是通过读写分离来实现了线程安全，具体用的是CopyOnWriteArrayList。  

　　综于以上原因，不难理解为什么异步下Logback比Log4J性能高出如此多。

###结论：

　　考虑到Logback在多线程情况下的性能优秀表现，加上接口使用的方便性，强烈建议新应用接入Logback。老的应用如果日志没有成为系统的性能瓶颈，考虑到迁移成本较高，可以保留现状。

**附：** [测试代码](http://yunpan.alibaba.com/share/link/2415l21j1)
