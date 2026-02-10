export type Option = {
  label: string
  value: number
}

export type Question = {
  id: string
  text: string
  dimension: string
}

export type Dimension = {
  id: string
  name: string
  description: string
  lowHint: string
  midHint: string
  highHint: string
}

export type TestConfig = {
  id: string
  title: string
  subtitle: string
  description: string
  instructions: string[]
  options: Option[]
  questions: Question[]
  dimensions: Dimension[]
}
