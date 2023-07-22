import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyles } from './styles/global'

import { Fragment } from 'react'
import { Button } from './components'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Fragment>
        <h1>Home</h1>

        <Button variant='primary' />
        <Button variant='secondary' />
        <Button variant='danger' />
        <Button variant='success' />
      </Fragment>

      <GlobalStyles />
    </ThemeProvider>
  )
}
