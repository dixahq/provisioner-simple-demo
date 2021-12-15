import { Output } from "@pulumi/pulumi"
import { Definition } from "../../types"

type K8sYamlOutputs = {
  serviceName: Output<any>
}

type K8sYamlDefinition = Definition & {
  k8sYaml: string
}

export { K8sYamlDefinition, K8sYamlOutputs }
