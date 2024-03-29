---
title: work deal with group attacked record
subject: "没有情人的情人劫——帮派系统被攻击手记"
date: '2012-02-14'
time: '19:41'
categories: ["Coding", "Working"]
tags:
- 帮派
- 淘宝
- 攻击
---
<img src="{{urls.media}}/img/work-bangpai/title.jpg"/>

**时间**：2012-2-14 情人节  
**现象**：收到系统的报警信息，提示Load偏高，马上登录指定服务器查日志，在查的过程中，其它报警接二连三的都陆续来了，然后PE开始旺我，问我情况… 

**处理过程**：

1. 查看业务日志，并没有发现太多问题，都是正常的错误，而且大小也与之前的日志大小差不多；
- 查看哈勃系统，发现QPS、LOAD、CPU、GC次数都急剧上升，怀疑有运营有活动，有大量用户进来，与运营确认后，说没有推广活动；
- 查看Apache访问日志，发现有大量请求进来，而且大多是同一URL的，而且大多没有refer，立刻对此URL进行了流控处理，未登录用户进行302重定向，其它用户则正常访问，观察了一会发现效果并不明显，把设置了按一定百分比去丢弃请求，设置了丢弃60%的用户后，Load仍然较高，索性直接把所有这个URL的请求全丢弃，Load、QPS等开始下降到一个正常值；
- 对Apache访问日志进行分析处理，发现这些请求来自不同的IP，但在每台机器的TOP 10基本都是那几个IP，初步断定这是一次恶意攻击事件；后来发这个帖子的运营打来电话询问情况，说自己并不知情，应该是被外部用户攻击，要求恢复，但看到这个URL的请求点请请求的35%以上时，放弃了，重新开帖进行运营；
- 对Apache访问日志的URL进行统计分析发现了另外一个恶意刷回复抢奖品的URL，直接流控；仔细分析发现帮派一直存在不同程度的刷流量事件，只是事件比较轻，所以没有这么大影响。事后把这些IP整理发给PE，并且给帮派部署了TDOD系统，至此，此事告一段落；

**名词解释**  

　　看完之后你肯定心里有着很多的疑问，比如流控系统是什么样的、TDOD是什么、怎么统计IP……我下面一一解释下…  

1. 流控系统：
	* 当系统并发量比较大，可预见系统在不久的将来存在宕机风险时，一般我们会做服务降级处理，降级的种类有很多，其中流控就是一种比较常见的方法。像帮派帖子这种某个帖子的请求量比较大时，一般我们会对这种特殊URL进行302重定向处理；
	* 重定向可以让PE直接从Apache端来做处理，当Apache接收到请求后，符合规则会自动重定向；
	* 直接用Apache对这个URL的所有请求进行重定向显然过于暴力，还是最佳的降级手段，如果能自己根据实际场景设定流控规则是比较灵活的，所以我们在帮派的系统上开发了一个流控系统，系统很简单，主要分成3部分：第1部分是是否开启流控开关；第2部分是判定条件；第3部分是执行逻辑。如下图：  

	<img src="{{urls.media}}/img/work-bangpai/tmd_bangpai.jpg"/>

		* 第1部分是是否开启流控开关，如果开启则走流控判断，否则正常走系统逻辑；
		* 第2部分是判断丢弃条件，常见的逻辑有未登录用户、按百分比丢用户、随机丢弃用户、指定URL处理…根据业务场景可以可以自定义逻辑，然后用语言表达出来即可；
		* 第3部分则是具体的处理结果，常见的就是重定向到各种错误或者系统繁忙页面，或者重定向到淘宝首页；

- TDOD：
	* TDOD是Taobao Department Of Defense的简称，意思是淘宝国防部
	* TDOD其实就是一个Apache/Nginx模块（当然，不只这么多，还有另外两部分），部署在上面之后可以对请求进行监控，并做一定的分析处理，对应用无侵入。可以防止一些[CC攻击](http://baike.baidu.com/view/662394.htm)、URL跳转域检查和系统的流量保护；
- 如果统计URL访问量的排行
	* 在哈勃系统中进行配置，可以直接对Apache访问日志进行分析，可以分析其访问量、RT等信息；
	* 用Shell脚本进行统计：  


	>awk '{CMD[$7]++; count++;} END {for (a in CMD) print CMD[a] " " CMD[a]/count*100 "% " a;}' 2012-02-14-taobao-access_log | sort -nr |more


- 如果统计IP访问情况
	* Shell脚本

	>grep "548716-270500175.htm" 2012-02-14-taobao-access_log |awk '{CMD[$1]++; count++;} END {for (a in CMD) print CMD[a] " " CMD[a]/count*100 "% " a;}' |sort -nr >> /tmp/548716-270500175-host.log

