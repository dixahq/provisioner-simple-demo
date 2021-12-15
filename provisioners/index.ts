import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation"
import { ServiceTypes } from "../definitions/enums"
import provisionHelmChart from "./helmChart"
import provisionK8sYaml from "./k8sYaml"
import { ComponentResourceOptions } from "@pulumi/pulumi"
import { HelmChartDefinition } from "./helmChart/types"
import { K8sYamlDefinition } from "./k8sYaml/types"
import { Context, Definition } from "../types"
import { KubeConfig } from "@kubernetes/client-node"
import { Provider } from "@pulumi/kubernetes"
import { buildConventionName, makeid } from "./utils"
import { PulumiCommand } from "./types"


const runProgram = async (args: InlineProgramArgs, command: string) => {
  const stack = await LocalWorkspace.createOrSelectStack(args)
  switch (command) {
    case PulumiCommand.Up: {
      console.info("updating stack...");
      const upRes = await stack.up({ onOutput: console.info });
      // console.log(`update summary: \n${JSON.stringify(upRes.summary.resourceChanges, null, 4)}`);
      return upRes
    }
    case PulumiCommand.Preview: {
      console.info("previewing stack...");
      const previewRes = await stack.preview({ onOutput: console.info });
      // console.log(`preview summary: \n${JSON.stringify(previewRes.changeSummary, null, 4)}`);
      return previewRes
    }
    case PulumiCommand.Destroy: {
      console.info("destroying stack...");
      const destroyRes = await stack.destroy({ onOutput: console.info });
      // FIXME: Removing the stack also removes the Activity history, so don't do that.
      // await stack.workspace.removeStack(args.stackName)
      // console.log(`update summary: \n${JSON.stringify(destroyRes.summary, null, 4)}`);
      return destroyRes
    }
  }
}

const kc = new KubeConfig()
kc.loadFromDefault()
const kubeconfig = kc.exportConfig()

const provisionDefaultProvider = (k: Context, suffix?: string) => {
  const kc = new KubeConfig()
  kc.loadFromDefault()
  const provider = new Provider(buildConventionName({
    baseName: `k8s-provider-${suffix}`,
    environment: k.environment,
    clusterShortName: k.clusterShortName
  }), {
    kubeconfig,
    suppressDeprecationWarnings: true,
  })
  return provider
}

const provisionService = (
  d: Definition,
  k: Context,
  opts: ComponentResourceOptions
) => {
  switch (d.type) {
    case ServiceTypes.HelmChart: {
      return provisionHelmChart(d as HelmChartDefinition, k, opts)
    }
    case ServiceTypes.K8sYaml: {
      return provisionK8sYaml(d as K8sYamlDefinition, k, opts)
    }
    default: {
      throw `No provisioner for ${d.type}`
    }
  }
}

export { provisionService, provisionDefaultProvider, runProgram }