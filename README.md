## webpack+react-router 实现按需加载
#### 使用webpack打包，直接使用require模块可以解决模块的依赖的问题，对于直接require模块，WebPack的做法是把依赖的文件都打包在一起，但是将所有的代码都打包进一个文件中，加载的时候，把所有文件都加载进来，然后执行我们的前端代码。只要我们的应用稍微的复杂一点点，包括依赖后，打包后的文件都是挺大的。而我们加载的时候，不管那些代码有没有执行到，都会下载下来。如果说，我们只下载我们需要执行的代码的话，那么可以节省相当大的流量。也就是我们所说的 按需加载。
### 1. webpack的按需加载--异步加载
#### 异步加载的代码会被分片成一个个chunk，在需要该模块时再加载，即按需加载，同步加载过多代码会造成文件过大影响加载速度；异步过多则文件太碎，造成过多的Http请求，同样影响加载速度。异步加载的写法如下：
    require.ensure(['./index2'],function(require){
         var aModule = require('./index2');
    },'index2');
#### 如上第一个参数是依赖列表，webpack会加载该模块，但不会执行；第二个参数是一个回调，在函数内可以使用require载入模块；第三个参数是生成后的模块名，如果ensure不指定第三个参数的话，那么webpack会随机生成一个数字作为模块名；
#### webpack的配置如下：
    output: {
      path: path.join(__dirname,'build'),
      filename: 'js/[name].js',
      chunkFilename: 'js/[name]-[chunkhash:8].js',
      publicPath: '/build/'
    }
#### 在build文件下会生成 aMoudle-8位随机数.js文件；如下页面的请求；
#### <img src="http://images2015.cnblogs.com/blog/561794/201607/561794-20160716230123951-457901832.png"/>
#### aMoudle.js代码如下：
    webpackJsonp([1],{
     function(module, exports) {
      "use strict";
      function a() {
        console.log("我是A文件");
      }
     }
    });
#### 会通过 webpackJsonp 模块包装一下；接着我们在index.js代码看下，它使如何被调用的；如下片段代码：
    __webpack_require__.e(1, function (require) {
      var aModule = __webpack_require__(70);
    });
#### 即可引用的到；也就是说如果a.js模块有1000+行代码，不会被包含到index.js代码内，但是index.js代码有a.js代码模块的引用；可以加载到a.js代码的内容；

## webpack和react-router实现按需加载
#### react-router 是一个路由解决方案的第一选择，它本身就有一套动态加载的方案
https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md 
#### getChildRoutes
#### getIndexRoute
#### getComponents
#### 他们的作用：就是在访问到了对应的路由的时候，才会去执行这个函数，如果没有访问到，那么就不会执行。那么我们把加载的函数放在里面就正好合适了，等到访问了该路由的时候，再去执行函数去加载脚本。
#### 我现在在pages目录下 新建一个routes.js，该文件就是解决路由问题的；代码可以看如下：
    export default {
      component: require('./index/app').default,
      childRoutes:[
        { path: '/a',
            getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('./index/a').default)
                },'aModule')
            }
        },
        { path: '/b',
            getComponent: (location, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('./index/b').default)
                },'bModule')
            }
        },
        { path: '/',
            getComponent: (location, cb) => {
                return require.ensure([], (require) => {
                    cb(null, require('./index/home').default)
                },'hModule')
            }
        }
      ]
    }
#### app模块是入口文件，会首先被加载到，当我们 http://localhost:8080/webpack-dev-server/
访问的时候，会加载app.js模块和默认的home.js模块，当我们继续访问
http://localhost:8080/webpack-dev-server/a 页面的时候，会加载app.js入口文件和a.js模块；
当我们继续访问 http://localhost:8080/webpack-dev-server/b 的时候 ，也只会加载app.js入口
文件和b.js模块；

在页面中的index.js如下配置即可：
    import React from 'react'
    import { render } from 'react-dom'
    import { browserHistory, Router } from 'react-router'
    import routes from '../routes'

    render(<Router history={browserHistory} routes={routes}/>, 
      document.getElementById('root'));



