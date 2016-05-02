import React, { Component, PropTypes } from 'react';
import Surface from '../container/Surface';
import Layer from '../container/Layer';
import Polygon from '../shape/Polygon';
import { findChildByType, getPresentationAttributes,
  validateWidthHeight } from '../util/ReactUtils';
import classNames from 'classnames';
import pureRender from '../util/PureRender';
import _ from 'lodash';

@pureRender
class Funnel extends Component {
  static displayName = 'Treemap';

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    dataKey: PropTypes.string,
  }

  static defaultProps = {
    dataKey: 'value',
  }

  renderTrapezoid(upLength, bottomLength, height, cx, cy) {
    const vertices = [
      { x: cx - upLength / 2, y: cy - height / 2 },
      { x: cx + upLength / 2, y: cy - height / 2 },
      { x: cx + bottomLength / 2, y: cy + height / 2 },
      { x: cx - bottomLength / 2, y: cy + height / 2 },
    ];

    return (
      <Polygon
        points={vertices}
      />
    );
  }

  renderStage(curr, next, i) {
    const { height, width, data, dataKey } = this.props;
    const stageCount = data.length;
    const stageHeight = height / stageCount;
    const stageCx = width / 2;
    const stageCy = stageHeight * (0.5 + i);
    const upLength = curr / data[0][dataKey] * width;
    const bottomLength = next / data[0][dataKey] * width;

    return this.renderTrapezoid(upLength, bottomLength, stageHeight, stageCx, stageCy);
  }


  renderAllStages() {
    const { data, dataKey } = this.props;

    return data.map((v, i) => {
      const curr = v[dataKey];
      const next = i < data.length - 1 ? data[i + 1][dataKey] : curr;
      return this.renderStage(curr, next, i);
    });
  }

  render() {
    if (!validateWidthHeight(this)) {return null;}

    const { width, height, className, style } = this.props;

    return (
      <div className={classNames('recharts-wrapper', className)}
        style={{ position: 'relative', cursor: 'default', ...style }}
      >
        <Surface width={width} height={height}>
          {this.renderAllStages()}
        </Surface>
      </div>
    );
  }
}

export default Funnel;
