rm -fr compiled
git add .
git commit -m "update blog source"
git push -u origin master
ruhoh compile
cp -fr compiled/* ../tangsan.im
cd ../tangsan.im
git add .
git commit -m "post new blog"
git remote add origin https://github.com/ecchanger/ecchanger.github.com.git
git push -u origin master
