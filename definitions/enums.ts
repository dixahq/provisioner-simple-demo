enum ServiceTypes {
  StandardK8sPod = 'standardK8sPod',
  HelmChart = 'helmChart',
  K8sYaml = 'k8sYaml',
}

enum HelmRepoUrl {
  PrometheusCommunity = 'https://prometheus-community.github.io/helm-charts',
  Codesim = 'https://helm.codesim.com',
  Bitnami = 'https://charts.bitnami.com/bitnami',
  HelmIncubator = 'https://charts.helm.sh/incubator',
  Jetstack = 'https://charts.jetstack.io',
  NginxStable = 'https://kubernetes.github.io/ingress-nginx',
  EmberStack = 'https://emberstack.github.io/helm-charts',
  ActionsRunnerController = 'https://actions-runner-controller.github.io/actions-runner-controller',
  DixaSRERepo = 'https://dixahq.github.io/sre-helm-repo',
}

export { ServiceTypes, HelmRepoUrl }