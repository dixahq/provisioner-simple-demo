import { Output } from "@pulumi/pulumi"
import { Definition } from "../../types"

type HelmChartOutputs = {
  serviceName: Output<any>
}

type HelmChartDefinition = Definition & {
  chartName: string
  chartRepo: string
  chartVersion: string
  /**
   * If chartRepoUrl is set, instead of looking for a chart locally Pulumi fetch it from the remote location.
   */
  chartRepoUrl?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartValuesFile?: Record<string, any>
  apiVersions?: string[]
}

export { HelmChartDefinition, HelmChartOutputs }