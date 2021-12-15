# provisioner-demo

Goal: Write Pulumi automation wrapper that computes Pulumi stacks and provisions them dynamically based on provided definitions.
Program should produce a stack containing all connected resources per service. Program should also include consideration about multi-cluster deploys (include `clusterShortName` in the stack name, i.e. `<serviceName>-<environment>-<clusterShortName>`).

Use `minikube` as your target cluster. 

Scope:
- Deploy simple nginx as service (provisioner for K8S YAML)
- Deploy kube-prometheus-stack as cluster-service (provisioner for HELM service)
- Deploy a single alarm to validate that it works (provisioner for Prometheus Alerts)

