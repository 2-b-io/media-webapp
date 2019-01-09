import request from 'services/graphql'

export const REPORT_FRAGMENT = `
  timestamp,
  value
`

export default {
  async generateUsageReport(params, options) {
    const {
      endTime,
      metricNames,
      period,
      projectIdentifier,
      startTime
    } = params
    const { token } = options

    if (metricNames.length === 0) {
      return null
    }

    const queryResponse = metricNames.map((name) => {
      return `
        ${ name }: metric(name: "${ name }") {
          name,
          datapoints(startTime: $startTime, endTime: $endTime, period: $period) {
            ${ REPORT_FRAGMENT }
          }
        }`
    }).join(', ')

    const body = await request(`
      query generateReport($token: String!, $projectIdentifier: String!, $startTime: Float!, $endTime: Float! ,$period: Float!) {
        session(token: $token) {
          account {
            project(identifier: $projectIdentifier) {
              ${ queryResponse }
            }
          }
        }
      }
    `, {
      endTime,
      period,
      projectIdentifier,
      startTime,
      token
    })

    return body.session.account.project
  }
}
