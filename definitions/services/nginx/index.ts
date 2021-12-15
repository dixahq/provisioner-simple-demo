import * as fs from 'fs'
import * as path from 'path'
import { K8sYamlDefinition } from "../../../provisioners/k8sYaml/types"
import { ServiceTypes } from "../../enums"

const definition: K8sYamlDefinition = {
  name: 'nginx',
  domain: 'core',
  team: 'core',
  type: ServiceTypes.K8sYaml,
  environments: ['stag'],
  k8sYaml: fs.readFileSync(path.join(__dirname, 'template.yaml'), { encoding: 'utf8' }),
}

export default definition
