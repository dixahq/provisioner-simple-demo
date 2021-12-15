import { output } from '@pulumi/pulumi'
import { Namespace } from "@pulumi/kubernetes/core/v1";
import { InlineProgramArgs } from "@pulumi/pulumi/automation"
import allServices from "./definitions"
import { provisionDefaultProvider, provisionService, runProgram } from "./provisioners";
import { Context, Definition } from "./types";
import { buildConventionName } from "./provisioners/utils";

const run = async () => {
  const args = process.argv.slice(2);
  let project = ''
  let command = ''
  if (!args[0] || !args[1]) {
    throw `Bad pulumi command. Examples:\nnpm start -- services up\nnpm start -- clusters preview\nnpm start -- clusters destroy`
  }
  if (!['services', 'clusters'].includes(args[0])) {
    throw `Unknown project '${args[0]}''`
  }
  if (!['up', 'preview', 'destroy'].includes(args[1])) {
    throw `Unknown command '${args[1]}''`
  }
  project = args[0]
  command = args[1]
  
  // This would come from DB or Cluster stack outputs. Hard to read the outputs.
  // TODO: read from stack outputs
  const clusterDefinition = {
    environment: 'dev', // 'stag',
    clusterShortName: 'minikube', // 'euw1'
  }
  
  const {environment, clusterShortName} = clusterDefinition
  
  const clusterProgram = {
    stackName: `${environment}-${clusterShortName}`,
    projectName: environment,
    program: async () => {
      const k: Context = {
        environment,
        clusterShortName
      }
      const provider = provisionDefaultProvider(k, clusterShortName)
      const namespaces = ['services', 'cluster-services']
      const ns = namespaces.map(n => {
        return new Namespace(
          buildConventionName({
            baseName: n,
            environment,
            clusterShortName
          }),
          {metadata: {name: n}},
          {provider}
        )
      })
      return {
        availableNamespaces: [ns.map((ns: Namespace) => ns.metadata.name)],
        environment: output('dev'),
        clusterShortName: output('minikube'),
      }
    }
  }
  
  if (project === 'clusters') {
    await runProgram(clusterProgram, command).catch(err => console.log(err))
  }
  
  const servicePrograms = allServices.map((d: Definition): InlineProgramArgs => {
    const stackArgs: InlineProgramArgs = {
      stackName: `${environment}-${clusterShortName}-${d.name}`,
      projectName: environment,
      program: async () => {
        const k: Context = {
          environment,
          clusterShortName
        }
        const provider = provisionDefaultProvider(k, d.name)
        return provisionService(d, k, {provider})
      }
    }
    return stackArgs
  })
  
  // This bugs out in weird ways if not done synchronously...
  // Gotta investigate further. I believe it may be a race condition 
  // between Pulumi providers.
  if (project === 'services') {
    for (const sp of servicePrograms) {
      try {
        await runProgram(sp, command)
      } catch (e) {
        console.log(e)
      }
    }
  }
}

run().catch(err => console.log(err))
