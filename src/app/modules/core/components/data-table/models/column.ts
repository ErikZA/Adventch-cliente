export interface Column {
  header?: string,
  label?: string,
  size?: Size | string
}

export enum Size {
  ExtraSmall = 1,
  Small = 2,
  Medium = 3,
  Large = 4,
  ExtraLarge = 5
}
