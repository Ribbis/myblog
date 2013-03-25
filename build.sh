git add .
git commit -m "update blog source"
git remote add origin git@github.com:ecchanger/myblog.git
git push -u origin master
ruhoh compile
cp -fr compiled/* ../tangsan.im
cd ../tangsan.im
git add .
git commit -m "post new blog"
git push -u origin master
