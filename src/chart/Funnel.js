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
    leftPadding: PropTypes.number,
    rightPadding: PropTypes.number,
    data: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    dataKey: PropTypes.string,
  }

  static defaultProps = {
    dataKey: 'value',
    leftPadding: 0,
    rightPadding: 0,
  }

  renderComment(comment, x1, x2, y) {
    return (
      <Layer>
        <line
          x1={x1} y1={y}
          x2={x2} y2={y}
          stroke="#999"
        />
        <text fontSize={12} stroke="#333" x={x2 + 6} y={y + 6}>{comment}</text>
      </Layer>
    );
  }

  renderTrapezoid(upLength, bottomLength, height, cx, cy) {
    const vertices = [
      { x: cx - upLength / 2, y: cy - height / 2 },
      { x: cx + upLength / 2, y: cy - height / 2 },
      { x: cx + bottomLength / 2, y: cy + height / 2 },
      { x: cx - bottomLength / 2, y: cy + height / 2 },
    ];

    return <Polygon points={vertices} />;
  }

  renderStage(curr, next, i) {
    const { height, width, leftPadding, rightPadding, data, dataKey } = this.props;
    const upLength = curr[dataKey] / data[0][dataKey] * (width - leftPadding - rightPadding);
    const bottomLength = next[dataKey] / data[0][dataKey] * (width - leftPadding - rightPadding);
    const stageHeight = height / data.length;
    const stageCx = leftPadding + (width - leftPadding - rightPadding) / 2;
    const stageCy = stageHeight * (0.5 + i);

    const comment = curr.name;
    const commentWidth = width - leftPadding - rightPadding;
    const commentX1 = stageCx + (upLength + bottomLength) / 4;
    const commentX2 = stageCx + commentWidth / 2;
    const commentY = stageCy;

    return (
      <Layer>
        { this.renderComment(comment, commentX1, commentX2, commentY) }
        { this.renderTrapezoid(upLength, bottomLength, stageHeight, stageCx, stageCy) }
      </Layer>
    );
  }


  renderAllStages() {
    const { data, dataKey } = this.props;

    return data.map((v, i) => {
      const curr = v;
      const next = i < data.length - 1 ? data[i + 1] : curr;
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
