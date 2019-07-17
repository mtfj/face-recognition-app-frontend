import React, { PureComponent } from "react";
import commonStyles from '../common/Common.module.css';

interface IState {
  curTime: string;
}

export default class Now extends PureComponent<{}, IState> {
  state = {
    curTime: new Date().toLocaleString(),
  };

  timerId: number | null = null;

  componentDidMount() {
    this.timerId = window.setInterval( () => {
      this.setState({
        curTime : new Date().toLocaleString()
      })
    },300)
  }

  componentWillUnmount() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }
  }

  render() {
    return <div className={commonStyles.bigText}>{this.state.curTime.split(',')[1]}</div>
  }
}
