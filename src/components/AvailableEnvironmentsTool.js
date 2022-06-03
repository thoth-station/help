import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@patternfly/react-core';
import {TableComposable, Thead, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import Highlight, { defaultProps } from "prism-react-renderer";
import github from "prism-react-renderer/themes/github";


export const AvailableEnvironmentsTool = () => {
  const [availableEnvs, setAvailableEnvs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [rowSelected, setRowSelected] = useState(null)

  const getAvailableEnvs = () => {
    setIsLoading(true)
    setSelected(null);
    setRowSelected(null)
    axios.get('https://khemenu.thoth-station.ninja/api/v1/python/environment')
      .then(resp => {
        setIsLoading(false)
        setAvailableEnvs(resp.data.environment)
        setError(null)
      })
      .catch(() => {
        setIsLoading(false)
        setError("An error occured when fetching the environments")
      })
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <h4 style={{margin: 0, marginRight: "1rem"}}>Available Environments Tool</h4>
        <Button style={{padding: ".25rem", paddingLeft: ".5rem", paddingRight: ".5rem"}} variant="secondary" isLoading={isLoading} onClick={getAvailableEnvs}>Fetch Environments</Button>
        {error ? <p color="red">{error}</p> : undefined}
      </div>

      {availableEnvs.length > 0
        ? (
          <TableComposable variant={"compact"}>
            <Thead>
              <Tr>
                <Th>OS Name</Th>
                <Th>OS Version</Th>
                <Th>Python Version</Th>
                <Th> </Th>
              </Tr>
            </Thead>
            <Tbody>
              {availableEnvs.map((env, i) => {
                return (
                  <Tr isRowSelected={rowSelected === i} style={{marginBottom: ".5rem"}} key={i}>
                    <Td>{env.os_name}</Td>
                    <Td>{env.os_version}</Td>
                    <Td>{env.python_version}</Td>
                    <Td>
                      <Button onClick={() => {
                        setSelected(env);
                        setRowSelected(i)
                      }} isSmall style={{padding: ".25rem", paddingLeft: ".5rem", paddingRight: ".5rem"}}>See YAML</Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </TableComposable>
        )
          : undefined
        }
      {selected
      ? (
          <Highlight {...defaultProps} code={
            `
        runtime_environments:
        - name: 'insert-name'
          operating_system:
            name: '${selected.os_name}'
            version: '${selected.os_version}'
          python_version: '${selected.python_version}'
        `
          } language="yaml" theme={github}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={style}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
            )}
          </Highlight>
        )
      : undefined
      }
    </div>
  )
}