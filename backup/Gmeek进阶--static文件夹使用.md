需要在docs文件内上传一些自己的文件，比如图片、js、css等，所以在v2.20版本添加了这个功能。下面就简单说明一下使用方法。

> 使用方式

在自己的仓库根目录下新建一个文件夹，名称必须是static。
然后在static文件内上传一些自己的文件，比如avatar.svg文件。
通过手动全局生成一次成功后，你就可以通过 xxx.github.io/avatar.svg 访问了。

> 例子

我新建的[static文件夹](https://github.com/Meekdai/meekdai.github.io/tree/main/static)
通过链接访问static文件夹内的文件：https://meekdai.github.io/avatar.svg

> 备注

在全局生成的时候，Actions会自动把static文件夹的所有内容拷贝到docs文件夹内。方便用户把docs当成一个目录部署到CF等其他服务器中。