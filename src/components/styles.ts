import styled, { css } from 'styled-components'

export type VariantColors = 'primary' | 'secondary' | 'danger' | 'success'

interface Props {
  variant: VariantColors
}

const variantColors = {
  primary: "purple",
  secondary: "orange",
  danger: "red",
  success: "green"
}

export const ButtonComponent = styled.button<Props>`
  width: 100px;
  height: 40px;
  cursor: pointer;

  background-color: ${props => props.theme['green-500']};
`