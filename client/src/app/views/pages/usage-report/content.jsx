import ms from 'ms'
import React, { Fragment } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import styled from 'styled-components'

import dataFormat from 'services/data-format'
import { mapDispatch } from 'services/redux-helpers'
import { actions, selectors } from 'state/interface'
import { AreaChart, Break, Container } from 'ui/elements'
import { DescriptionTextLine, TextLine } from 'ui/typo'

import _UsageReportForm from './form'

const DATA_DEFAULT = {
  date: {
    endDate: dataFormat.formatTime(new Date(), 'yyyy-mm-dd'),
    startDate: dataFormat.formatTime(new Date()- ms('7d'), 'yyyy-mm-dd')
  },
  granularity: [
    {
      label: 'Daily',
      value: 'daily'
    },
    {
      label: 'Hourly',
      value: 'hourly'
    }
  ]
}

const Analysis = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const Border = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  border: 1px solid ${ ({ theme }) => theme.secondary.base };
`

const Content = styled.div`
  position: relative;
  box-shadow: 4px 4px ${ ({ theme }) => theme.black.opaque.base };
  background: ${
    ({ theme }) => theme.white.base
  };
`

const AreaChartContent = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
  background: transparent;
  color: ${ ({ theme }) => theme.black.base };
`

const renderTooltip = (period) => ({ payload, label }) => (
  <Content>
    <Border />
    <AreaChartContent>
      <DescriptionTextLine mostLeft mostRight>
        {
          `Date: ${
            period === 'hourly' ?
              dataFormat.formatTime(label, 'mmm, dd, HH:MM') :
              dataFormat.formatTime(label, 'mmm, dd')
          }`
        }
      </DescriptionTextLine>
      <DescriptionTextLine mostLeft mostRight>
        {
          `Reports: ${ dataFormat.formatNumber(payload[0].value) }`
        }
      </DescriptionTextLine>
    </AreaChartContent>
  </Content>
)

const _CustomizedXAxisTick = ({
  className,
  payload,
  period,
  x, y
}) => (
  <g transform={ `translate(${ x },${ y })` } className={ className }>
    <text x={ 0 } y={ 0 } dy={ 16 } textAnchor="middle" fill="currentColor">
      {
        dataFormat.formatTime(payload.value, 'mmm, dd')
      }
    </text>
    { period === 'hourly' &&
      <text x={ 0 } y={ 0 } dy={ 32 } textAnchor="middle" fill="currentColor">
        {
          dataFormat.formatTime(payload.value, 'HH:MM')
        }
      </text>
    }
  </g>
)

const CustomizedXAxisTick = styled(_CustomizedXAxisTick)`
  & text {
    color: ${ ({ theme }) => theme.secondary.base };
    line-height: 24px;
    font-size: 12px;
  }
`

const renderXAxisTick = (period) => ({ payload, x, y }) => (
  <CustomizedXAxisTick
    payload={ payload }
    period={ period }
    x={ x } y={ y }
  />
)

const _CustomizedYAxisTick = ({
  convertData,
  className,
  payload,
  x, y
}) => (
  <g transform={ `translate(${ x },${ y })` } className={ className }>
    <text
      x={ -16 } y={ 0 } dy={ 8 }
      textAnchor="middle"
      fill="currentColor"
    >
      {
        convertData ?
          convertData(payload.value) :
          payload.value
      }
    </text>
  </g>
)

const CustomizedYAxisTick = styled(_CustomizedYAxisTick)`
  & text {
    color: ${ ({ theme }) => theme.secondary.base };
    line-height: 24px;
    font-size: 12px;
  }
`

const renderYAxisTick = (convertData) => ({ payload, x, y }) => (
  <CustomizedYAxisTick
    convertData={ convertData }
    payload={ payload }
    x={ x } y={ y }
  />
)

const UsageReportForm = reduxForm({
  form: 'usageReportForm',
  enableReinitialize: true
})(_UsageReportForm)

const UsageReport = ({
  generateReport,
  options,
  ui: {
    data,
    idle,
    period,
    usageData,
    requestData
  }
}) => {
  if (!options.projects.length) {
    return <TextLine mostLeft mostRight>No project found.</TextLine>
  }

  return (
    <Container>
      <UsageReportForm
        idle={ idle }
        initialValues={ {
          projectIdentifier: options.projects[0].value,
          granularity: options.granularity[0].value,
          startDate: DATA_DEFAULT.date.startDate,
          endDate: DATA_DEFAULT.date.endDate
        } }
        onSubmit={ generateReport }
        options={ options }
      />
      <Break double />
      {
        data && data.bytesDownloaded &&
          <Fragment>
            <AreaChart
              data={ data.bytesDownloaded.datapoints }
              name="Bytes Downloaded"
              valueKey="value"
              xKey="timestamp"
              yKey="value"
              type="linear"
              customTooltip={ renderTooltip(period) }
              customXAxisTick={ renderXAxisTick(period) }
              customYAxisTick={ renderYAxisTick(dataFormat.formatSize) }
            />
            <Analysis>
              <TextLine mostLeft mostRight>
                Total Bytes: { dataFormat.formatSize(usageData.totalBytes) }
              </TextLine>
            </Analysis>
            <Break />
          </Fragment>
      }
      {
        data && data.requests &&
          <Fragment>
            <AreaChart
              data={ data.requests.datapoints }
              name="Requests"
              valueKey="value"
              xKey="timestamp"
              yKey="value"
              type="linear"
              customTooltip={ renderTooltip(period) }
              customXAxisTick={ renderXAxisTick(period) }
              customYAxisTick={ renderYAxisTick(dataFormat.formatNumber) }
            />
            <Analysis>
              <TextLine mostLeft mostRight>
                Average: { dataFormat.formatNumber(requestData.average) }
              </TextLine>
              <TextLine mostLeft mostRight>
                Total: { dataFormat.formatNumber(requestData.total) }
              </TextLine>
              <TextLine mostLeft mostRight>
                Maximum: { dataFormat.formatNumber(requestData.maximum) }
              </TextLine>
              <TextLine mostLeft mostRight>
                Minimum: { dataFormat.formatNumber(requestData.minimum) }
              </TextLine>
            </Analysis>
            <Break />
          </Fragment>
      }
    </Container>
  )
}
export default connect(
  (state) => {
    const projects = selectors.allProjects(state)

    if (!projects) {
      return null
    }

    const projectsSelect = projects.map((project) => ({
      label: `${ project.name } (${ project.identifier })`,
      value: project.identifier
    }))

    const options = {
      projects: projectsSelect,
      granularity: DATA_DEFAULT.granularity
    }

    return {
      options
    }
  },
  mapDispatch({
    generateReport: actions.generateReport
  })
)(UsageReport)
