---
title: 博客迁移到octopress了
date: '2012-02-12'
time: '17:57'
description:
categories: ["Living"]
tags:
- Life
- blog
- octopress
- wordpress
---
<img src="{{urls.media}}/img/blog-to-octopress/title.jpg"/>

　　大学时候还有一个写日记的习惯，从2005年到2008年，在CY上坚持写了3年的日记。可是毕业后，公司不能上外网，另外也担心信息泄露逐渐把写日记的习惯丢掉了...  

　　2011年初突然又想写博客记录下自己了，心血来潮弄了个域名，在朋友的服务器上搭了个WP，一年下来博客没写几篇，域名也过期了..倒是微博没少发...  

　　2012年初，我回顾了自己的微博，又看了看大学的日记，发现微博上的这些记录零散了，无法沉淀，于是我又要开博了..希望这次我能坚持下来...  

　　身边几个朋友的博客都已经被墙，考虑到自己平时说话的态度和对党国的感激之情，也担心本博客有一天也通过“GFW”国际资格认证，所以放弃了SAE等国内访问比较快速的平台，于是选用了github pages..于是就有了今天的octopress...

### Octopress简介
>[Octopress](http://octopress.org/) is a framework designed by Brandon Mathis for Jekyll, the blog aware static site generator powering [Github Pages](https://github.com).

#### 优点

* 用文件方式储存数据，无需数据库
* 以静态方式发布，可直接挂在github等地方
* 用[markdown](http://en.wikipedia.org/wiki/Markdown)格式写博客
* 可以轻松的配置和发布

#### 安装

- 详情请参考*[官方文档](http://octopress.org/docs/setup/)*，安装过程非常简单  
- 安装主题，如果想安装和本博客一样的主题请参考[compbits](https://github.com/iwinux/compbits)

#### 常用命令

　　**注意**：*有些机子上运行可能会报错，需要在命令前加上bundle exec*

1. **添加文章**

		rake new_post["title"] ##生成一个博客模板，zsh下要rake new_post\["title"\]

运行后会通过title生成相关文件、链接，可在文件里修改显示出来的标题。title可以使用中文，会自动转化为拼音（个人不建议，因为链接会比较无意义）。也可以自己修改生成的文件名来个性博文的排序。  
**注意**:这里我用zsh一直无法执行，始终说参数不正确，后来切换到bash下就正常了

- **预览**

		rake generate       #发布文件到public目录
		rake watch          #监控source和sass目录的变动
		rake preview        #启动服务器并监控变动，通过http://localhost:4000预览

本机预览建议使用[POW](http://pow.cx/)来进行

- **发布**

		rake setup_github_pages /*如果第一次发布，一定要执行这个命令，以后就不用了，因为这个命令会个性Rackfile里的相关配置*/
		rake generate
		rake deploy

- **保存源代码**

	因为发布的只是生成的静态页面，需要在项目里建立source分支用于保存整个项目源代码（配置、markdown文件等）。

		git add .
		git commit -m 'blog'
		git push origin source

- **更多设置**

	5.1 **添加”关于我”**

		1. 在source下新建about目录，并在里面添加index.markdown文件。
		2. 编辑导航条source/_includes/custom/navigation.html
		**注意**:*index.markdown文件需要加上头，否则会找不到。*

	5.2 **首页只显示摘要**

		1. 在文中加入`<!--more-->`来控制摘要截取位置
		2. 修改_config.yml里的excerpt_link控制链接文字

	5.3 **部署到Github**

		- 操作步骤参考：[Deploying to Github Pages](http://octopress.org/docs/deploying/github/)
		- 如果你有自己的域名，可参考：[Github Page](http://pages.github.com/)绑定自己域名