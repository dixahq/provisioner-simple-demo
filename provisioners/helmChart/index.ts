
import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Context } from '../../types'
import { buildConventionName } from '../utils'
import { HelmChartDefinition, HelmChartOutputs } from './types'

const provisionHelmChart = (
  d: HelmChartDefinition,
  k: Context,
  opts: pulumi.ComponentResourceOptions
): HelmChartOutputs => {
  const chart = new k8s.helm.v3.Chart(
    buildConventionName({
      baseName: d.name,
      environment: k.environment,
      clusterShortName: k.clusterShortName
    }),
    {
      chart: d.chartName,
      ...(!d.chartRepoUrl && {
        repo: d.chartRepo,
      }),
      version: d.chartVersion,
      values: d.chartValuesFile,
      fetchOpts: {
        repo: d.chartRepoUrl,
      },
      apiVersions: d.apiVersions,
    },
    opts
  )
  return {
    serviceName: pulumi.output(d.name)
  }
}

export default provisionHelmChart
