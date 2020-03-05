// Libraries
import React, { PureComponent } from 'react';

// Services & Utils
import { config } from 'app/core/config';

// Components
import { Gauge, DataLinksContextMenu } from '@grafana/ui';

// Types
import { GaugeOptions } from './types';
import { VizRepeater } from '@grafana/ui';
import { FieldDisplay, getFieldDisplayValues, VizOrientation, PanelProps } from '@grafana/data';
import { getFieldLinksSupplier } from 'app/features/panel/panellinks/linkSuppliers';

export class GaugePanel extends PureComponent<PanelProps<GaugeOptions>> {
  renderValue = (value: FieldDisplay, width: number, height: number): JSX.Element => {
    const { options } = this.props;
    const { field, display } = value;

    return (
      <DataLinksContextMenu links={getFieldLinksSupplier(value)}>
        {({ openMenu, targetClassName }) => {
          return (
            <Gauge
              value={display}
              width={width}
              height={height}
              field={field}
              showThresholdLabels={options.showThresholdLabels}
              showThresholdMarkers={options.showThresholdMarkers}
              theme={config.theme}
              onClick={openMenu}
              className={targetClassName}
            />
          );
        }}
      </DataLinksContextMenu>
    );
  };

  getValues = (): FieldDisplay[] => {
    const { data, options, replaceVariables, fieldConfig } = this.props;
    return getFieldDisplayValues({
      fieldConfig,
      fieldOptions: {
        calcs: options.fieldOptions.calcs,
        values: options.fieldOptions.values,
        limit: options.fieldOptions.limit,
      },
      replaceVariables,
      theme: config.theme,
      data: data.series,
      autoMinMax: true,
    });
  };

  render() {
    const { height, width, data, renderCounter } = this.props;
    return (
      <VizRepeater
        getValues={this.getValues}
        renderValue={this.renderValue}
        width={width}
        height={height}
        source={data}
        renderCounter={renderCounter}
        orientation={VizOrientation.Auto}
      />
    );
  }
}
