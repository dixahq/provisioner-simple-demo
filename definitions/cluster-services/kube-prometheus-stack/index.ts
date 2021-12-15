import { HelmChartDefinition } from "../../../provisioners/helmChart/types"
import { HelmRepoUrl, ServiceTypes } from "../../enums"

const definiton: HelmChartDefinition = {
  name: 'prometheus',
  domain: 'monitoring',
  type: ServiceTypes.HelmChart,
  team: 'sre',
  environments: ['dev'],
  chartName: 'kube-prometheus-stack',
  chartRepo: 'prometheus-community',
  chartRepoUrl: HelmRepoUrl.PrometheusCommunity,
  chartVersion: '13.7.2',
  chartValuesFile: {
    // Source: https://github.com/prometheus-community/helm-charts/blob/54f0c4af9550dcadbd8e57b986f5bc8e8ffe3770/charts/kube-prometheus-stack/values.yaml
    fullnameOverride: 'kube-prometheus-stack',
    namespaceOverride: 'cluster-services',
    defaultRules: {
      create: false,
    },
    grafana: {
      enabled: false,
    },
    prometheus: {
      statefulSet: {
        enabled: true,
      },
      service: {
        type: 'NodePort',
      },
      prometheusSpec: {
        probeSelectorNilUsesHelmValues: false,
        podMonitorSelectorNilUsesHelmValues: false,
        serviceMonitorSelectorNilUsesHelmValues: false,
        replicas: 1,
        resources: {
          requests: {
            memory: '0.5Gi',
            cpu: '0.2',
          },
          limits: {
            memory: '2Gi',
            cpu: '1'
          },
        },
      },
    },
    kubeControllerManager: {
      enabled: false,
    },
    kubeEtcd: {
      enabled: false,
    },
    kubeScheduler: {
      enabled: false,
    },
    coreDns: {
      enabled: true,
    },
    kubeDns: {
      enabled: true,
    },
    kubeProxy: {
      enabled: true,
    },
    kubeStateMetrics: {
      enabled: true,
    },
  },
}

export default definiton