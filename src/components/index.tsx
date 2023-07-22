import { ButtonComponent, VariantColors } from "./styles"

interface Props {
  variant: VariantColors
}

export function Button({ variant = 'primary' }:Props) { //color = 'primary => default value'
  return (
    <ButtonComponent variant={variant}>Button</ButtonComponent>
  )
}