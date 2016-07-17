
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