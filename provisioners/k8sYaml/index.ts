import { K8sYamlDefinition, K8sYamlOutputs } from "./types";
import * as k8s from '@pulumi/kubernetes'
import { buildConventionName } from "../utils";
import * as pulumi from "@pulumi/pulumi";
import { Context } from "../../types";

const provisionK8sYaml = (
  d: K8sYamlDefinition,
  k: Context,
  opts: pulumi.ComponentResourceOptions
): K8sYamlOutputs => {
  new k8s.yaml.ConfigGroup(
    buildConventionName({
      baseName: d.name,
      environment: k.environment,
      clusterShortName: k.clusterShortName
    }),
    {
      yaml: d.k8sYaml,
    },
    opts
  )
  return {
    serviceName: pulumi.output(d.name)
  }
}

export default provisionK8sYaml