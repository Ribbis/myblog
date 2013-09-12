rm -fr compiled
#git add .
#git commit -m "update blog source"
#git push -u origin master
ruhoh compile
rm -fr ../tangsan.im/*
cp -fr compiled/* ../tangsan.im
cd ../tangsan.im
echo tangsan.im>CNAME
git add .
git commit -m "post new blog"
git remote add origin https://github.com/ecchanger/ecchanger.github.io.git
git push -u origin master
