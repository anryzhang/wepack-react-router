
import React, { Component } from 'react'

class App extends React.Component{
  render() {
    return (
      <div>
          <div>App模块已经加载了</div>
          <div className="App">{this.props.children}</div>
      </div>
    )
  }
}
export default App