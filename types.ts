type Definition = {
  name: string
  type: string
  environments: string[]
  team: string
  domain: string
}

type Context = {
  environment: string
  clusterShortName: string
  namespace?: string
}

export {Definition, Context}