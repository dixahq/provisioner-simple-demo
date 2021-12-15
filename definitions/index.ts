/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs'
import * as path from 'path'
import { Definition } from '../types'

const loadServiceTemplates = (folder: string): Definition[] => {
  return fs
    .readdirSync(path.join(__dirname, folder))
    .map((dir) => require(`.${path.sep}${folder}${path.sep}${dir}`).default)
}

export const clusterServices = loadServiceTemplates('cluster-services')
export const services = loadServiceTemplates('services')

export default [
  ...clusterServices,
  ...services,
]
